import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await verifyAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const worker = await prisma.worker.create({
    data: {
      id: `WRK-${Date.now()}`,
      name: body.name,
      organizationId: user.organizationId,
    },
  });
  return NextResponse.json(worker);
}