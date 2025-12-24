import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const extraLoss = await prisma.extraLoss.create({
      data: {
        id: `EXT-${Date.now()}`, // Manually generating ID since schema lacks @default
        worker: body.worker,
        amount: parseFloat(body.amount),
        note: body.note || "",
        date: body.date ? new Date(body.date) : new Date(),
        organizationId: user.organizationId,
      },
    });

    return NextResponse.json(extraLoss);
  } catch (error: any) {
    console.error("EXTRA_LOSS_POST_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}