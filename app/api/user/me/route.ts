import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { auth0Sub: session.user.sub },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ id: user.id });
}
