import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const order = await prisma.order.create({
      data: {
        id: body.id || `ORD-${Date.now()}`,
        customer: body.customer,
        phone: body.phone,
        items: body.items,
        goldWeight: parseFloat(body.goldWeight),
        purity: parseFloat(body.purity),
        status: "pending",
        deadline: body.deadline,
        notes: body.notes,
        organizationId: user.organizationId,
      },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}