// src/app/api/market/route.ts
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // Calculate pure gold content if not provided
    let pureGoldContent = body.pureGoldContent;
    if (!pureGoldContent && body.weight && body.purity) {
      pureGoldContent = parseFloat(body.weight) * (parseFloat(body.purity) / 999);
    }

    const marketTx = await prisma.marketTransaction.create({
      data: {
        id: body.id || `MKT-${Date.now()}`,
        type: body.type, // "receive_market", "send_market", or "cash"
        vendor: body.vendor,
        weight: parseFloat(body.weight || 0),
        purity: body.purity ? String(body.purity) : null,
        pureGoldContent: parseFloat(pureGoldContent || 0),
        receivedPurities: body.receivedPurities || null,
        remainingBalance: body.remainingBalance !== undefined ? parseFloat(body.remainingBalance) : null,
        status: body.status || "completed",
        notes: body.notes || "",
        organizationId: user.organizationId,
      },
    });

    console.log(`[MARKET API] Saved ${body.type} for ${body.vendor}:`, {
      weight: body.weight,
      purity: body.purity,
      pureGold: pureGoldContent,
      remainingBalance: body.remainingBalance
    });

    return NextResponse.json(marketTx);
  } catch (error: any) {
    console.error("MARKET_POST_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}