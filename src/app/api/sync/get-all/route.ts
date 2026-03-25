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
    // 1. Fetch all data including the new cashTransactions in parallel
    const [
      orders,
      transactions,
      workers,
      extraLosses,
      meltingBatches,
      marketTransactions,
      stockRecord,
      cashTransactions // <--- Added this
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
      prisma.cashTransaction.findMany({ // <--- Fetch the payments
        where: { organizationId: orgId },
        orderBy: { date: 'desc' }
      }),
    ]);

    // 2. Map the database names (p995) back to UI names ("995")
    const purityStock = stockRecord ? {
      "995": stockRecord.p995,
      "917": stockRecord.p917,
      "875": stockRecord.p875,
      "750": stockRecord.p750,
      "pure": stockRecord.pure
    } : { "995": 0, "917": 0, "875": 0, "750": 0, "pure": 0 };

    // 3. Return everything to the UI
    return NextResponse.json({
      orders,
      transactions,
      workers,
      extraLosses,
      meltingBatches,
      marketTransactions,
      purityStock,
      cashTransactions // <--- Include in the final response
    });
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: "Database fetch failed" }, { status: 500 });
  }
}