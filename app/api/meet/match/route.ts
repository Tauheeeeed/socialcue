import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId, durationMinutes, surpriseMe } = await request.json();

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

    let allUsers = await prisma.user.findMany({
      where: {
        id: { not: userId },
        profileReady: true,
      },
    });

    if (allUsers.length === 0) {
      const demoUser = await prisma.user.create({
        data: {
          name: "Demo User",
          age: 25,
          gender: "other",
          location: requester.location,
          interests: requester.interests.length > 0 ? requester.interests : ["coffee", "chat"],
          profileReady: true,
        },
      });
      allUsers = [demoUser];
    }

    let match: (typeof allUsers)[number];
    if (!surpriseMe && requester.interests.length > 0) {
      const withSameInterest = allUsers.filter((u: (typeof allUsers)[number]) =>
        u.interests.some((i: string) => requester.interests.includes(i))
      );
      match =
        withSameInterest.length > 0
          ? withSameInterest[Math.floor(Math.random() * withSameInterest.length)]
          : allUsers[Math.floor(Math.random() * allUsers.length)];
    } else {
      match = allUsers[Math.floor(Math.random() * allUsers.length)];
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
