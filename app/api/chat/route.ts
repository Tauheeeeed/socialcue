import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { userId, message, history } = await request.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: "Missing message or userId" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const systemPrompt = `You are a friendly onboarding bot. Ask exactly ONE short question per message. Rules:
1. One question only, 1-2 sentences max. No long intros or yapping.
2. Ask about: interests/hobbies, then likes, then dislikes (3-4 questions total).
3. After the user has answered 3-4 questions, your next reply must end with exactly: [PROFILE_READY]
4. When ending, say something like "Got it, we're all set!" then [PROFILE_READY] on the same line.

Example flow: "What are your top 2–3 hobbies or interests?" → user answers → "What do you like? (e.g. coffee, movies)" → → "Anything you dislike?" → "Got it! [PROFILE_READY]"`;

    let chatHistory = history.map((h: { role: string; content: string }) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    }));

    // Gemini requires first message to be from user; prepend placeholder if LLM started the chat
    const trimmed = chatHistory.slice(-10);
    if (trimmed.length > 0 && trimmed[0].role === "model") {
      chatHistory = [
        { role: "user" as const, parts: [{ text: "(Start)" }] },
        ...trimmed,
      ];
    } else {
      chatHistory = trimmed;
    }

    const userMessageCount = history.filter((h: { role: string }) => h.role === "user").length;
    const forceEnd = userMessageCount >= 3; // end after 3 user answers (3–4 questions total)

    if (forceEnd) {
      return NextResponse.json({
        reply: "Got it, we're all set!",
        profileReady: true,
      });
    }

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(
      history.length === 0
        ? `${systemPrompt}\n\nStart the conversation. User's first message: ${message}`
        : message
    );

    const response = result.response;
    const text = response.text();

    const profileReady = text.includes("[PROFILE_READY]");
    const reply = text.replace(/\[PROFILE_READY\]/g, "").trim();

    return NextResponse.json({ reply, profileReady });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}
