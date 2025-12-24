import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const marketTx = await prisma.marketTransaction.create({
      data: {
        id: body.id || `REC-${Date.now()}`,
        type: body.type, // "receive_market" or "send_market"
        vendor: body.vendor,
        weight: parseFloat(body.weight),
        purity: String(body.purity),
        pureGoldContent: parseFloat(body.pureGoldContent),
        receivedPurities: body.receivedPurities || null, // Stores the JSON array
        status: body.status || "completed",
        notes: body.notes || "",
        organizationId: user.organizationId,
      },
    });

    return NextResponse.json(marketTx);
  } catch (error: any) {
    console.error("MARKET_POST_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}