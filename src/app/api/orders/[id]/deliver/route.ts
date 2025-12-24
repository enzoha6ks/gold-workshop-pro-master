import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// 👈 Use 'export async function POST' NOT 'export default'
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const user = await verifyAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; // 👈 Await params

    const updatedOrder = await prisma.order.update({
      where: { 
        id: id,
        organizationId: user.organizationId 
      },
      data: {
        status: "delivered",
        // You can add more delivery logic here if needed
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}