import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestId") ?? searchParams.get("matchId");
    const userId = searchParams.get("userId");

    if (!requestId || !userId) {
      return NextResponse.json(
        { error: "Missing requestId or userId" },
        { status: 400 }
      );
    }

    const activity = await prisma.activityRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    const payload: {
      status: string;
      sport: string;
      matchUserId?: string | null;
      matchUser?: {
        id: string;
        name: string | null;
        age: number | null;
        gender: string | null;
        location: string | null;
        interests: string[];
        likes: string[];
        dislikes: string[];
      } | null;
      matchName?: string;
      meetLocation?: string;
    } = {
      status: activity.status,
      sport: activity.sport,
    };

    if (activity.status === "matched" && activity.matchedWithUserId) {
      const matchUser = await prisma.user.findUnique({
        where: { id: activity.matchedWithUserId },
      });
      if (matchUser) {
        payload.matchUserId = matchUser.id;
        payload.matchUser = {
          id: matchUser.id,
          name: matchUser.name,
          age: matchUser.age,
          gender: matchUser.gender,
          location: matchUser.location,
          interests: matchUser.interests,
          likes: matchUser.likes,
          dislikes: matchUser.dislikes,
        };
        payload.matchName = matchUser.name ?? "Someone nearby";
      }
      const meetLocation = activity.user.location
        ? `Near ${activity.user.location} - find a ${activity.sport} venue`
        : `Find a ${activity.sport} venue near you`;
      payload.meetLocation = meetLocation;
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Activity status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}
