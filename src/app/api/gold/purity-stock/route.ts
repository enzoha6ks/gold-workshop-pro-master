import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const stockData = {
      p995: Number(body["995"]) || 0,
      p917: Number(body["917"]) || 0,
      p875: Number(body["875"]) || 0,
      p750: Number(body["750"]) || 0,
      pure: Number(body.pure) || 0,
    };

    const updated = await prisma.purityStock.upsert({
      where: { organizationId: user.organizationId },
      update: stockData,
      create: {
        organizationId: user.organizationId,
        ...stockData,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    // Log this to your Terminal to see the real DB error!
    console.error("DATABASE SYNC ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}