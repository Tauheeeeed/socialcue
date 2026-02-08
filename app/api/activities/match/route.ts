import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId, sport } = await request.json();

    if (!userId || !sport) {
      return NextResponse.json(
        { error: "Missing userId or sport" },
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

    const otherSearching = await prisma.activityRequest.findFirst({
      where: {
        sport,
        status: "searching",
        userId: { not: userId },
      },
      include: { User: true },
    });

    let requestId: string;
    let matchUserId: string | null = null;

    if (otherSearching) {
      // Create MeetRequest for chat
      const meet = await prisma.meetRequest.create({
        data: {
          requesterId: userId,
          receiverId: otherSearching.userId,
          meetLocation: "TBD", // Will be updated later or derived
          status: "accepted",
        },
      });

      await prisma.activityRequest.update({
        where: { id: otherSearching.id },
        data: {
          status: "matched",
          matchedWithUserId: userId,
          meetRequestId: meet.id,
        },
      });
      const created = await prisma.activityRequest.create({
        data: {
          userId,
          sport,
          status: "matched",
          matchedWithUserId: otherSearching.userId,
          meetRequestId: meet.id,
        },
      });
      requestId = created.id;
      matchUserId = otherSearching.userId;
    } else {
      const created = await prisma.activityRequest.create({
        data: {
          userId,
          sport,
          status: "searching",
        },
      });
      requestId = created.id;
    }

    return NextResponse.json({ requestId, matchUserId });
  } catch (error) {
    console.error("Activity match error:", error);
    return NextResponse.json(
      { error: "Failed to find match" },
      { status: 500 }
    );
  }
}
