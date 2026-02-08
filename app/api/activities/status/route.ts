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
      include: { User: true },
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
      meetRequestId?: string | null;
    } = {
      status: activity.status,
      sport: activity.sport,
    };

    // Check for timeout and trigger Demo Match
    if (activity.status === "searching") {
      const now = new Date();
      const createdAt = new Date(activity.createdAt);
      const diffMs = now.getTime() - createdAt.getTime();

      if (diffMs > 10000) { // 10 seconds
        const demoNames = ["Sarah", "Mike", "Jessica", "David", "Emily", "Chris", "Anna", "Tom"];
        const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];

        // Find or create a demo user with a realistic name
        let demoUser = await prisma.user.findFirst({
          where: { name: randomName, profileReady: true } // simple check, might need more robust tag
        });

        if (!demoUser) {
          demoUser = await prisma.user.create({
            data: {
              name: randomName,
              age: 24 + Math.floor(Math.random() * 5),
              gender: "other",
              location: activity.User.location || "Nearby",
              interests: [activity.sport, "coffee"],
              profileReady: true,
            }
          });
        }

        // Create MeetRequest for demo chat
        const meet = await prisma.meetRequest.create({
          data: {
            requesterId: activity.userId,
            receiverId: demoUser.id,
            meetLocation: activity.User.location || "Nearby",
            status: "accepted",
          },
        });

        // Update current request to matched
        const updatedActivity = await prisma.activityRequest.update({
          where: { id: activity.id },
          data: {
            status: "matched",
            matchedWithUserId: demoUser.id,
            meetRequestId: meet.id,
          },
          include: { User: true } // Refresh data
        });

        // Also create a request for the demo user
        await prisma.activityRequest.create({
          data: {
            userId: demoUser.id,
            sport: activity.sport,
            status: "matched",
            matchedWithUserId: activity.userId,
            meetRequestId: meet.id,
          }
        });

        // Update payload with new match info
        payload.status = "matched";
        payload.matchUserId = demoUser.id;
        payload.meetRequestId = meet.id;
        payload.matchUser = {
          id: demoUser.id,
          name: demoUser.name,
          age: demoUser.age,
          gender: demoUser.gender,
          location: demoUser.location,
          interests: demoUser.interests,
          likes: demoUser.likes,
          dislikes: demoUser.dislikes,
        };
        payload.matchName = demoUser.name || "Someone";

        const meetLocation = activity.User.location
          ? `Near ${activity.User.location} - find a ${activity.sport} venue`
          : `Find a ${activity.sport} venue near you`;
        payload.meetLocation = meetLocation;

        return NextResponse.json(payload);
      }
    }

    if (activity.status === "matched" && activity.matchedWithUserId) {
      // Self-healing: Create MeetRequest if missing
      if (!activity.meetRequestId) {
        const meet = await prisma.meetRequest.create({
          data: {
            requesterId: activity.userId,
            receiverId: activity.matchedWithUserId,
            meetLocation: activity.User.location || "Nearby",
            status: "accepted",
          },
        });

        await prisma.activityRequest.update({
          where: { id: activity.id },
          data: { meetRequestId: meet.id },
        });

        // Also update the other user's request if possible, but for now just fix this one
        // actually we should try to reuse the same meet request if the other user already has one?
        // But for simplicity, let's just create one. 
        // Ideally we should check if the OTHER user's activity request already has a meetRequestId that links these two.
        // But simple fix: create new specific for this interaction if missing.

        activity.meetRequestId = meet.id;
      }

      const matchUser = await prisma.user.findUnique({
        where: { id: activity.matchedWithUserId },
      });
      if (matchUser) {
        payload.matchUserId = matchUser.id;
        payload.meetRequestId = activity.meetRequestId;
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
      const meetLocation = activity.User.location
        ? `Near ${activity.User.location} - find a ${activity.sport} venue`
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
