import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { userId, lastMessage, chatHistory } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userMessages = chatHistory
      ? chatHistory
        .filter((h: { role: string }) => h.role === "user")
        .map((h: { content: string }) => h.content)
        .join(" ")
      : lastMessage || "";

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const result = await model.generateContent(
      `From this conversation where the user talked about themselves, extract keywords for their profile. Return ONLY a JSON object with these exact keys: interests (array of strings), likes (array of strings), dislikes (array of strings). Example: {"interests":["tennis","hiking","reading"],"likes":["coffee","movies"],"dislikes":["crowds"]}. User's messages: "${userMessages}"`
    );

    const response = result.response;
    const text = response.text();
    let interests: string[] = [];
    let likes: string[] = [];
    let dislikes: string[] = [];

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        interests = Array.isArray(parsed.interests) ? parsed.interests : [];
        likes = Array.isArray(parsed.likes) ? parsed.likes : [];
        dislikes = Array.isArray(parsed.dislikes) ? parsed.dislikes : [];
      }
    } catch {
      interests = (lastMessage || "").split(/[\s,]+/).filter((w: string) => w.length > 2).slice(0, 5);
    }

    const profilePayload = { interests, likes, dislikes };

    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        profile: profilePayload,
        updatedAt: new Date(),
      },
      create: {
        userId,
        profile: profilePayload,
        updatedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        interests,
        likes,
        dislikes,
        profileReady: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
