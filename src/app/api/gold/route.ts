import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET all gold for THE LOGGED IN organization
export async function GET() {
  try {
    const token = (await cookies()).get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as any;

    const gold = await prisma.goldItem.findMany({
      where: { organizationId: decoded.organizationId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(gold);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gold" }, { status: 500 });
  }
}

// POST new gold to THE LOGGED IN organization
export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as any;
    const { weight, purity, type, description } = await req.json();

    const newGold = await prisma.goldItem.create({
      data: {
        weight: parseFloat(weight),
        purity: parseFloat(purity),
        type,
        description,
        organizationId: decoded.organizationId // This links it to the workshop!
      }
    });

    return NextResponse.json(newGold);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add gold" }, { status: 500 });
  }
}