// // Core gold business logic
// export interface GoldTransaction {
//   id: string
//   type: 'issue' | 'return' | 'send_market' | 'receive_market'
//   weight: number
//   purity: number
//   pureGoldContent: number
//   toFrom: string
//   date: Date
//   loss?: number
//   notes?: string
// }

// // Add purity stock interface
// export interface PurityStock {
//   '995': number  // 24K
//   '917': number  // 22K  
//   '875': number  // 21K
//   '750': number  // 18K
//   'pure': number // Calculated pure gold
// }

// export interface GoldStock {
//   purityStock: PurityStock
//   totalWeight: number
//   pureGoldWeight: number
//   purityBreakdown: {
//     [purity: string]: number
//   }
// }

// // CORRECT Formula: weight × purity ÷ 999
// export const calculatePureGold = (weight: number, purity: number): number => {
//   return Number(((weight * purity) / 999).toFixed(3));
// }

// export const calculatePhysicalWeight = (pureGoldWeight: number, targetPurity: number): number => {
//   return Number(((pureGoldWeight * 999) / targetPurity).toFixed(3));
// }

// // Calculate loss in pure gold terms
// export const calculateLoss = (
//   sentWeight: number, 
//   sentPurity: number,
//   receivedWeight: number, 
//   receivedPurity: number
// ): number => {
//   const sentPure = (sentWeight * sentPurity) / 999;
//   const receivedPure = (receivedWeight * receivedPurity) / 999;
//   return Math.max(0, Number((sentPure - receivedPure).toFixed(3)));
// }

// // Calculate pure gold from purity stocks
// export const calculatePureFromPurities = (purityStock: PurityStock): number => {
//   return (
//     (purityStock['995'] * 995 / 999) +
//     (purityStock['917'] * 917 / 999) + 
//     (purityStock['875'] * 875 / 999) +
//     (purityStock['750'] * 750 / 999)
//   );
// }

// // Helper to convert purity number to purity key
// export const getPurityKey = (purity: number): keyof PurityStock => {
//   // If already a known purity value, return as string
//   if (purity === 995 || purity === 917 || purity === 875 || purity === 750) {
//     return purity.toString() as keyof PurityStock
//   }
//   // Map karat to purity
//   switch (purity) {
//     case 24: return '995'  // 24K = 995 purity
//     case 22: return '917'  // 22K = 917 purity
//     case 21: return '875'  // 21K = 875 purity
//     case 18: return '750'  // 18K = 750 purity
//     default: return '917'  // Default to 22K/917
//   }
// }

// // Update stock calculations to use purity stocks
// export const calculateStockFromTransactions = (transactions: GoldTransaction[], initialPurityStock?: PurityStock): GoldStock => {
//   // Start with initial purity stock or defaults
//   const defaultStock: PurityStock = {
//     '995': 1000, // 1kg 24K
//     '917': 1500, // 1.5kg 22K
//     '875': 500,  // 500g 21K
//     '750': 200,  // 200g 18K
//     'pure': 0    // Will be calculated
//   }

//   const initialStock = initialPurityStock || defaultStock

//   // Calculate initial pure gold
//   const initialPure = calculatePureFromPurities(initialStock)

//   let purityStock = { ...initialStock, pure: initialPure }
//   let totalWeight = Object.values(initialStock).reduce((sum, weight) => sum + weight, 0) - initialStock.pure

//   // Apply transactions to purity stock
//   transactions.forEach(transaction => {
//     if (transaction.type === 'issue' || transaction.type === 'send_market') {
//       // Deduct from appropriate purity based on transaction purity
//       const purityKey = getPurityKey(transaction.purity)
//       if (purityStock[purityKey] !== undefined) {
//         purityStock[purityKey] = Math.max(0, purityStock[purityKey] - transaction.weight)
//       }
//     } else if (transaction.type === 'return' || transaction.type === 'receive_market') {
//       // Add to appropriate purity based on transaction purity
//       const purityKey = getPurityKey(transaction.purity)
//       purityStock[purityKey] = (purityStock[purityKey] || 0) + transaction.weight
//     }

//     // Recalculate pure gold after each transaction
//     purityStock.pure = calculatePureFromPurities(purityStock)
//   })

//   return {
//     purityStock,
//     totalWeight: Object.values(purityStock).reduce((sum, weight) => sum + weight, 0) - purityStock.pure,
//     pureGoldWeight: purityStock.pure,
//     purityBreakdown: {
//       '24': purityStock['995'],
//       '22': purityStock['917'],
//       '21': purityStock['875'],
//       '18': purityStock['750']
//     }
//   }
// }

// export const getPurityPercentage = (purity: number): string => {
//   return ((purity / 24) * 100).toFixed(1)
// }

// export const getPurityColor = (purity: number): string => {
//   switch (purity) {
//     case 24: return 'bg-blue-100 text-blue-800 border-blue-200'
//     case 22: return 'bg-green-100 text-green-800 border-green-200'
//     case 21: return 'bg-amber-100 text-amber-800 border-amber-200'
//     case 18: return 'bg-purple-100 text-purple-800 border-purple-200'
//     default: return 'bg-gray-100 text-gray-800 border-gray-200'
//   }
// }

// // Add this helper function
// export const createGoldTransaction = (data: Partial<GoldTransaction>): GoldTransaction => {
//   return {
//     id: data.id || Date.now().toString(),
//     type: data.type || 'issue',
//     weight: data.weight || 0,
//     purity: data.purity || 22,
//     pureGoldContent: data.pureGoldContent || 0,
//     toFrom: data.toFrom || '',
//     date: data.date ? new Date(data.date) : new Date(),
//     loss: data.loss || 0,
//     notes: data.notes
//   }
// }


// Core gold business logic
export interface GoldTransaction {
  id: string
  type: 'issue' | 'return' | 'send_market' | 'receive_market'
  weight: number
  purity: number
  pureGoldContent: number
  toFrom: string
  date: Date
  loss?: number
  notes?: string
}

// Add this interface for serialized transactions (for storage)
export interface SerializedGoldTransaction {
  id: string
  type: 'issue' | 'return' | 'send_market' | 'receive_market'
  weight: number
  purity: number
  pureGoldContent: number
  toFrom: string
  date: string // Store as string for persistence
  loss?: number
  notes?: string
}

// Add purity stock interface
export interface PurityStock {
  '995': number  // 24K
  '917': number  // 22K  
  '875': number  // 21K
  '750': number  // 18K
  'pure': number // Calculated pure gold
}

export interface GoldStock {
  purityStock: PurityStock
  totalWeight: number
  pureGoldWeight: number
  purityBreakdown: {
    [purity: string]: number
  }
}

// CORRECT Formula: weight × purity ÷ 999
export const calculatePureGold = (weight: number, purity: number): number => {
  return Number(((weight * purity) / 999).toFixed(3));
}

export const calculatePhysicalWeight = (pureGoldWeight: number, targetPurity: number): number => {
  return Number(((pureGoldWeight * 999) / targetPurity).toFixed(3));
}

// Calculate loss in pure gold terms
export const calculateLoss = (
  sentWeight: number, 
  sentPurity: number,
  receivedWeight: number, 
  receivedPurity: number
): number => {
  const sentPure = (sentWeight * sentPurity) / 999;
  const receivedPure = (receivedWeight * receivedPurity) / 999;
  return Math.max(0, Number((sentPure - receivedPure).toFixed(3)));
}

// Calculate pure gold from purity stocks
export const calculatePureFromPurities = (purityStock: PurityStock): number => {
  return (
    (purityStock['995'] * 995 / 999) +
    (purityStock['917'] * 917 / 999) + 
    (purityStock['875'] * 875 / 999) +
    (purityStock['750'] * 750 / 999)
  );
}

// Helper to convert purity number to purity key
export const getPurityKey = (purity: number): keyof PurityStock => {
  // If already a known purity value, return as string
  if (purity === 995 || purity === 917 || purity === 875 || purity === 750) {
    return purity.toString() as keyof PurityStock
  }
  // Map karat to purity
  switch (purity) {
    case 24: return '995'  // 24K = 995 purity
    case 22: return '917'  // 22K = 917 purity
    case 21: return '875'  // 21K = 875 purity
    case 18: return '750'  // 18K = 750 purity
    default: return '917'  // Default to 22K/917
  }
}

// NEW: Convert serialized transaction to proper GoldTransaction
export const deserializeTransaction = (serialized: SerializedGoldTransaction): GoldTransaction => {
  return {
    ...serialized,
    date: new Date(serialized.date) // Convert string back to Date
  }
}

// NEW: Convert GoldTransaction to serialized for storage
export const serializeTransaction = (transaction: GoldTransaction): SerializedGoldTransaction => {
  return {
    ...transaction,
    date: transaction.date.toISOString() // Convert Date to string for storage
  }
}

// Update stock calculations to use purity stocks
export const calculateStockFromTransactions = (transactions: GoldTransaction[], initialPurityStock?: PurityStock): GoldStock => {
  // Start with initial purity stock or defaults
  const defaultStock: PurityStock = {
    '995': 1000, // 1kg 24K
    '917': 1500, // 1.5kg 22K
    '875': 500,  // 500g 21K
    '750': 200,  // 200g 18K
    'pure': 0    // Will be calculated
  }

  const initialStock = initialPurityStock || defaultStock

  // Calculate initial pure gold
  const initialPure = calculatePureFromPurities(initialStock)

  let purityStock = { ...initialStock, pure: initialPure }
  let totalWeight = Object.values(initialStock).reduce((sum, weight) => sum + weight, 0) - initialStock.pure

  // Apply transactions to purity stock
  transactions.forEach(transaction => {
    if (transaction.type === 'issue' || transaction.type === 'send_market') {
      // Deduct from appropriate purity based on transaction purity
      const purityKey = getPurityKey(transaction.purity)
      if (purityStock[purityKey] !== undefined) {
        purityStock[purityKey] = Math.max(0, purityStock[purityKey] - transaction.weight)
      }
    } else if (transaction.type === 'return' || transaction.type === 'receive_market') {
      // Add to appropriate purity based on transaction purity
      const purityKey = getPurityKey(transaction.purity)
      purityStock[purityKey] = (purityStock[purityKey] || 0) + transaction.weight
    }

    // Recalculate pure gold after each transaction
    purityStock.pure = calculatePureFromPurities(purityStock)
  })

  return {
    purityStock,
    totalWeight: Object.values(purityStock).reduce((sum, weight) => sum + weight, 0) - purityStock.pure,
    pureGoldWeight: purityStock.pure,
    purityBreakdown: {
      '24': purityStock['995'],
      '22': purityStock['917'],
      '21': purityStock['875'],
      '18': purityStock['750']
    }
  }
}

export const getPurityPercentage = (purity: number): string => {
  return ((purity / 24) * 100).toFixed(1)
}

export const getPurityColor = (purity: number): string => {
  switch (purity) {
    case 24: return 'bg-blue-100 text-blue-800 border-blue-200'
    case 22: return 'bg-green-100 text-green-800 border-green-200'
    case 21: return 'bg-amber-100 text-amber-800 border-amber-200'
    case 18: return 'bg-purple-100 text-purple-800 border-purple-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Updated helper function to ensure proper Date objects
export const createGoldTransaction = (data: Partial<GoldTransaction>): GoldTransaction => {
  return {
    id: data.id || Date.now().toString(),
    type: data.type || 'issue',
    weight: data.weight || 0,
    purity: data.purity || 22,
    pureGoldContent: data.pureGoldContent || calculatePureGold(data.weight || 0, data.purity || 22),
    toFrom: data.toFrom || '',
    date: data.date instanceof Date ? data.date : new Date(data.date || Date.now()),
    loss: data.loss || 0,
    notes: data.notes
  }
}

// NEW: Safe date formatter that handles both Date objects and strings
export const formatTransactionDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString()
}