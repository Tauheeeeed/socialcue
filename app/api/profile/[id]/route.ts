import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { UserProfile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const profileData = (user.UserProfile?.profile as any) || {};

    return NextResponse.json({
      id: user.id,
      name: user.name,
      age: user.age,
      gender: user.gender,
      location: user.location,
      acceptedGuidelines: user.acceptedGuidelines,
      interests: profileData.interests || [],
      likes: profileData.likes || [],
      dislikes: profileData.dislikes || [],
      about: profileData.about || "Passionate about community service and meeting new people. Always up for a coffee chat or a weekend cleanup drive!",
      stats: profileData.stats || {
        events: 12,
        connections: 48,
        rating: 4.9,
      },
      progress: profileData.progress || {
        communityEvents: 0,
        peopleMet: 0,
        activitiesHosted: 0,
        messagesSent: 0,
        daysActive: 0,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
