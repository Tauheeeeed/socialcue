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
      interests: profileData.interests || [],
      likes: profileData.likes || [],
      dislikes: profileData.dislikes || [],
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
