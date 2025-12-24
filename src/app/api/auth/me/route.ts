import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const token = (await cookies()).get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { organization: true }
    });

    return NextResponse.json({ 
      userName: user?.name || "Admin Manager",
      orgName: user?.organization.name || "Workshop"
    });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}