import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const meetId = searchParams.get("meetId");

    if (!meetId) {
      return NextResponse.json({ error: "Missing meetId" }, { status: 400 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { meetId },
      orderBy: { createdAt: "asc" },
      include: {
        Sender: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { meetId, senderId, content } = body;

    if (!meetId || !senderId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        meetId,
        senderId,
        content,
      },
      include: {
        Sender: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
