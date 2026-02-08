import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId, durationMinutes, surpriseMe, surpriseLevel } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const requester = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!requester) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let match: (typeof requester) | null = null;

    // 1. Surprise Me Logic (Levels 1-3)
    if (surpriseMe) {
      // Level 1: Low Surprise (Soft match - try to find shared interests)
      if (surpriseLevel === 1 && requester.interests.length > 0) {
        const usersWithInterests = await prisma.user.findMany({
          where: {
            id: { not: userId },
            profileReady: true,
            interests: { hasSome: requester.interests },
          },
        });
        if (usersWithInterests.length > 0) {
          match = usersWithInterests[Math.floor(Math.random() * usersWithInterests.length)];
        }
      }

      // Level 3: High Surprise (Anti-match - try to find NO shared interests)
      else if (surpriseLevel === 3 && requester.interests.length > 0) {
        const usersWithoutInterests = await prisma.user.findMany({
          where: {
            id: { not: userId },
            profileReady: true,
            NOT: {
              interests: { hasSome: requester.interests },
            }
          },
        });
        if (usersWithoutInterests.length > 0) {
          match = usersWithoutInterests[Math.floor(Math.random() * usersWithoutInterests.length)];
        }
      }

      // Level 2: Medium Surprise (Pure Random) - or fallback for 1/3
      if (!match) {
        // Fall through to standard random selection
      }
    }
    // 2. Standard Match (Not Surprise Me) - Priorities shared interests
    else if (requester.interests.length > 0) {
      const usersWithInterests = await prisma.user.findMany({
        where: {
          id: { not: userId },
          profileReady: true,
          interests: { hasSome: requester.interests },
        },
      });

      if (usersWithInterests.length > 0) {
        match = usersWithInterests[Math.floor(Math.random() * usersWithInterests.length)];
      }
    }

    // 3. Fallback: Any random user (for all cases)
    if (!match) {
      const userCount = await prisma.user.count({
        where: {
          id: { not: userId },
          profileReady: true,
        },
      });

      if (userCount > 0) {
        const skip = Math.floor(Math.random() * userCount);
        const randomUsers = await prisma.user.findMany({
          where: {
            id: { not: userId },
            profileReady: true,
          },
          take: 1,
          skip: skip,
        });
        if (randomUsers.length > 0) {
          match = randomUsers[0];
        }
      }
    }

    // 4. Last Resort: Create Demo User if database is empty
    if (!match) {
      const demoUser = await prisma.user.create({
        data: {
          name: "Demo User",
          age: 25,
          gender: "other",
          location: requester.location,
          interests: ["random", "surprise"],
          profileReady: true,
        },
      });
      match = demoUser;
    }

    const meetLocation =
      [requester.location, match.location].filter(Boolean).join(" & ") || "Meet up";

    const meetRequest = await prisma.meetRequest.create({
      data: {
        requesterId: userId,
        receiverId: match.id,
        meetLocation,
        durationMinutes: durationMinutes ?? 60,
        surpriseMe: surpriseMe ?? false,
        status: "accepted",
      },
    });

    return NextResponse.json({
      matchId: meetRequest.id,
      matchName: match.name ?? "Someone",
      meetLocation,
    });
  } catch (error) {
    console.error("Match error:", error);
    return NextResponse.json(
      { error: "Failed to find match" },
      { status: 500 }
    );
  }
}
