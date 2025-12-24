import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();



    const transaction = await prisma.transaction.create({
      data: {
        type: body.type, // "issue" or "return"
        weight: parseFloat(body.weight),
        purity: parseFloat(body.purity),
        pureGoldContent: parseFloat(body.pureGoldContent),
        toFrom: body.toFrom,
        loss: parseFloat(body.loss) || 0,
        notes: body.notes || "",
        date: body.date ? new Date(body.date) : new Date(),
        organizationId: user.organizationId,
      },
    });

    return NextResponse.json(transaction);
  } catch (error: any) {
    console.error("TRANSACTION_POST_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}