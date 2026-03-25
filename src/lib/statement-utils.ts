// src/lib/statement-utils.ts
export const calculateVendorStatement = (
  marketTransactions: any[] = [], 
  orders: any[] = [], 
  cashPayments: any[] = []
) => {
  const normalizeName = (name: string) => name?.trim().toLowerCase() || "";
  const allTransactions: any[] = [];
  
  // 1. Process market transactions
  (marketTransactions || []).forEach((t) => {
    let narration = t.notes || "";
    let goldDebit = 0;   // Vendor TAKES gold (they owe us)
    let goldCredit = 0;  // Vendor RETURNS gold (reduces what they owe)
    let cashDebit = 0;   // Vendor PAYS cash (reduces what they owe)
    let cashCredit = 0;  // Making charges (increases what they owe)
    
    if (t.type === "send_market") {
      narration = t.notes || `Gold Sent to Vendor - ${t.purity || 'Mixed'}K`;
      goldDebit = Number(t.weight || 0);
    } 
    else if (t.type === "receive_market") {
      const physicalWeight = t.weight;
      const purity = t.purity === "Mixed" ? "Mixed" : `${t.purity}K`;
      const pureGold = t.pureGoldContent;
      narration = t.notes || `Gold Received from Vendor - ${physicalWeight}g @ ${purity} = ${pureGold.toFixed(3)}g pure`;
      goldCredit = pureGold; // Use pure gold for balance calculation
    }
    else if (t.type === "cash" || t.type === "cash_payment") {
      narration = t.notes || `Cash Payment Received - ${t.method || 'Cash'}`;
      cashDebit = Number(t.amount || 0);
    }
    
    allTransactions.push({
      date: new Date(t.date),
      type: t.type,
      narration,
      goldDebit,
      goldCredit,
      cashDebit,
      cashCredit,
      id: t.id,
      vendor: t.vendor
    });
  });

  // 2. Process orders - ONLY cash (making charges)
  (orders || []).forEach((o) => {
    const makingCharges = Number(o.makingCharges || 0);
    if (makingCharges > 0) {
      allTransactions.push({
        date: new Date(o.createdAt || o.date),
        type: "order",
        narration: `Order #${o.id} - Making Charges for ${o.items || 'Jewelry'}`,
        goldDebit: 0,
        goldCredit: 0,
        cashDebit: 0,
        cashCredit: makingCharges, // Increases vendor debt
        id: o.id,
        vendor: o.customer
      });
    }
  });

  // 3. Process cash payments
  (cashPayments || []).forEach((p) => {
    allTransactions.push({
      date: new Date(p.date),
      type: "cash_payment",
      narration: p.notes || `Cash Received - ${p.method || 'Cash'}`,
      goldDebit: 0,
      goldCredit: 0,
      cashDebit: Number(p.amount || 0), // Reduces vendor debt
      cashCredit: 0,
      id: p.id,
      vendor: p.vendorName
    });
  });

  // Sort by date
  allTransactions.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate running balances
  let runningGold = 0;   // Positive = vendor owes us gold
  let runningCash = 0;   // Positive = vendor owes us money

  const statementData = allTransactions.map((item) => {
    // Gold: credit (vendor returns) increases our balance, debit (vendor takes) decreases
    runningGold = runningGold + item.goldCredit - item.goldDebit;
    // Cash: credit (making charges) increases debt, debit (payment) decreases debt
    runningCash = runningCash + item.cashCredit - item.cashDebit;
    
    return {
      ...item,
      runningGold: Number(runningGold.toFixed(3)),
      runningCash: Number(runningCash.toFixed(3))
    };
  });

  return {
    data: statementData,
    dateFrom: statementData.length > 0 ? statementData[0].date.toLocaleDateString('en-GB') : "---",
    dateTo: statementData.length > 0 ? statementData[statementData.length - 1].date.toLocaleDateString('en-GB') : "---",
    totalGold: runningGold,
    totalCash: runningCash
  };
};

// Helper function to normalize vendor names for matching
export const normalizeVendorName = (name: string) => {
  return name?.trim().toLowerCase() || "";
};

// Function to get vendor summary (for the market page cards)
export const getVendorSummary = (
  marketTransactions: any[],
  orders: any[],
  cashPayments: any[]
) => {
  const vendorMap = new Map();
  
  // Process market transactions
  marketTransactions.forEach(t => {
    const vendor = normalizeVendorName(t.vendor);
    if (!vendorMap.has(vendor)) {
      vendorMap.set(vendor, { gold: 0, cash: 0, originalName: t.vendor });
    }
    const current = vendorMap.get(vendor);
    
    if (t.type === "send_market") {
      current.gold -= Number(t.weight || 0);
    } else if (t.type === "receive_market") {
      current.gold += Number(t.weight || 0);
    } else if (t.type === "cash" || t.type === "cash_payment") {
      current.cash -= Number(t.amount || 0);
    }
    
    vendorMap.set(vendor, current);
  });
  
  // Process orders
  orders.forEach(o => {
    const vendor = normalizeVendorName(o.customer);
    if (!vendorMap.has(vendor)) {
      vendorMap.set(vendor, { gold: 0, cash: 0, originalName: o.customer });
    }
    const current = vendorMap.get(vendor);
    current.gold -= Number(o.goldWeight || 0);
    current.cash += Number(o.makingCharges || 0);
    vendorMap.set(vendor, current);
  });
  
  // Process cash payments
  cashPayments.forEach(p => {
    const vendor = normalizeVendorName(p.vendorName);
    if (!vendorMap.has(vendor)) {
      vendorMap.set(vendor, { gold: 0, cash: 0, originalName: p.vendorName });
    }
    const current = vendorMap.get(vendor);
    current.cash -= Number(p.amount || 0);
    vendorMap.set(vendor, current);
  });
  
  return Array.from(vendorMap.entries()).map(([key, value]) => ({
    name: value.originalName || key,
    gold: Number(value.gold.toFixed(3)),
    cash: Number(value.cash.toFixed(3))
  }));
};