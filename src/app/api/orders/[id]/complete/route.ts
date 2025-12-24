import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 👈 Change to Promise
) {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id } = await params; // 👈 Await the params here
    const { revenue } = body;

    const updatedOrder = await prisma.order.update({
      where: { 
        id: id,
        organizationId: user.organizationId 
      },
      data: {
        status: "completed",
        progress: 100,
        revenue: parseFloat(revenue),
        completedAt: new Date(),
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}