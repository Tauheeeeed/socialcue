import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth0 } from "@/lib/auth0";

export const POST = async (req: Request) => {
    try {
        const session = await auth0.getSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { name, age, location } = data;

        // Upsert User
        const user = await prisma.user.upsert({
            where: { auth0Sub: session.user.sub },
            update: {
                name,
                age: parseInt(age),
                location,
            },
            create: {
                auth0Sub: session.user.sub,
                name,
                age: parseInt(age),
                location,
            },
        });

        // Initialize UserProfile
        await prisma.userProfile.upsert({
            where: { userId: user.id },
            update: {
                profile: {
                    interests: [],
                    likes: [],
                    dislikes: []
                },
                updatedAt: new Date()
            },
            create: {
                userId: user.id,
                profile: {
                    interests: [],
                    likes: [],
                    dislikes: []
                },
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ id: user.id });
    } catch (error) {
        console.error("Onboarding error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
