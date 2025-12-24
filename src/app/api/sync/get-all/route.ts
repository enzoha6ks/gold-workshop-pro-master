import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await verifyAuth();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = user.organizationId;

  try {
    // Fetch all data in parallel for speed
    const [
      orders,
      transactions,
      workers,
      extraLosses,
      meltingBatches,
      marketTransactions,
      stockRecord
    ] = await Promise.all([
      prisma.order.findMany({ 
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.transaction.findMany({ 
        where: { organizationId: orgId },
        orderBy: { date: 'desc' } 
      }),
      prisma.worker.findMany({ where: { organizationId: orgId } }),
      prisma.extraLoss.findMany({ where: { organizationId: orgId } }),
      prisma.meltingBatch.findMany({ where: { organizationId: orgId } }),
      prisma.marketTransaction.findMany({ where: { organizationId: orgId } }),
      prisma.purityStock.findUnique({ where: { organizationId: orgId } }),
    ]);

    // Map the database names (p995) back to UI names ("995")
    const purityStock = stockRecord ? {
      "995": stockRecord.p995,
      "917": stockRecord.p917,
      "875": stockRecord.p875,
      "750": stockRecord.p750,
      "pure": stockRecord.pure
    } : { "995": 0, "917": 0, "875": 0, "750": 0, "pure": 0 };

    return NextResponse.json({
      orders,
      transactions,
      workers,
      extraLosses,
      meltingBatches,
      marketTransactions,
      purityStock
    });
  } catch (error) {
    return NextResponse.json({ error: "Database fetch failed" }, { status: 500 });
  }
}