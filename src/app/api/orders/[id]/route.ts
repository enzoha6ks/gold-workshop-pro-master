import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Update type to Promise
) {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id } = await params; // 2. Await the params object

    const updatedOrder = await prisma.order.update({
      where: { 
        id,
        organizationId: user.organizationId 
      },
      data: {
        status: body.status,
        progress: body.progress ? parseInt(body.progress) : undefined,
        notes: body.notes,
        // Add other fields you want to allow updating
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Order Patch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}