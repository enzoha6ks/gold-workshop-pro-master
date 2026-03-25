// src/app/api/orders/route.ts
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // Generate order ID if not provided
    const orderId = body.id || `ORD-${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        id: orderId,
        customer: body.customer,
        phone: body.phone || "",
        items: body.items || "",
        goldWeight: parseFloat(body.goldWeight || 0),
        purity: parseFloat(body.purity || 0),
        makingCharges: parseFloat(body.makingCharges || 0), // ADD THIS - CRITICAL
        status: body.status || "pending",
        progress: body.progress || 0,
        deadline: body.deadline || null,
        notes: body.notes || null,
        organizationId: user.organizationId,
      },
    });

    console.log(`[ORDERS API] Created order ${orderId} with making charges: ${body.makingCharges} KWD`);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("ORDERS_POST_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("ORDERS_GET_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}