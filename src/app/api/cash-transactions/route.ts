// src/app/api/cash-transactions/route.ts
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { vendorName, amount, method, notes } = body;

    if (!vendorName || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    // Validate payment method
    const validMethods = ["KNET", "WAMD", "VIA LINK", "CASH"];
    const paymentMethod = validMethods.includes(method) ? method : "CASH";

    // Create cash transaction
    const transaction = await prisma.cashTransaction.create({
      data: {
        vendorName: vendorName.trim(),
        amount: amountNum,
        method: paymentMethod,
        notes: notes || `${paymentMethod} payment received from ${vendorName}`,
        type: "payment_received",
        organizationId: auth.organizationId,
      },
    });

    console.log(`[CASH API] Saved ${paymentMethod} payment: ${amountNum} KWD from ${vendorName}`);

    // Also create a market transaction for statement tracking
    await prisma.marketTransaction.create({
      data: {
        id: `CASH-${Date.now()}`,
        type: "cash",
        vendor: vendorName.trim(),
        weight: 0,
        purity: null,
        pureGoldContent: 0,
        remainingBalance: null,
        status: "completed",
        notes: `${paymentMethod} payment of ${amountNum} KWD received`,
        organizationId: auth.organizationId,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("[CASH_TRANSACTION_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await prisma.cashTransaction.findMany({
      where: { organizationId: auth.organizationId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("[CASH_TRANSACTION_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}