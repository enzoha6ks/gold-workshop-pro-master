// import { GoldTransaction, PurityStock } from "./gold-calculations"

// export interface Worker {
//   id: string
//   name: string
//   totalIssued: number
//   totalReturned: number
//   totalLoss: number
//   efficiency: number
// }

// export const STORAGE_KEYS = {
//   TRANSACTIONS: "gold_transactions",
//   PURITY_STOCK: "purity_stock",
//   APP_STORE: "gold_app_store",
//   EXTRA_LOSSES: "extra_losses",
//   WORKERS: "workers"
// }

// // Save transactions to localStorage
// export const saveTransactions = (transactions: GoldTransaction[]): void => {
//   try {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
//     }
//   } catch (error) {
//     console.error('Failed to save transactions:', error)
//   }
// }

// // Load transactions from localStorage - START EMPTY
// export const loadTransactions = (): GoldTransaction[] => {
//   if (typeof window === 'undefined') return [] // <-- important fix!

//   try {
//     const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
//     if (stored) {
//       const transactions = JSON.parse(stored)
//       return transactions.map((t: any) => ({
//         ...t,
//         date: new Date(t.date)
//       }))
//     }
//   } catch (error) {
//     console.error('Failed to load transactions:', error)
//   }

//   return []
// }


// // Save purity stock
// export const savePurityStock = (purityStock: PurityStock): void => {
//   try {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem(STORAGE_KEYS.PURITY_STOCK, JSON.stringify(purityStock))
//     }
//   } catch (error) {
//     console.error('Failed to save purity stock:', error)
//   }
// }

// // Load purity stock - START EMPTY
// export const loadPurityStock = (): PurityStock => {
//   if (typeof window === 'undefined') {
//     return {
//       "995": 0,
//       "917": 0,
//       "875": 0,
//       "750": 0,
//       "pure": 0,
//     }
//   }

//   try {
//     const stored = localStorage.getItem(STORAGE_KEYS.PURITY_STOCK)
//     if (stored) {
//       return JSON.parse(stored)
//     }
//   } catch (error) {
//     console.error('Failed to load purity stock:', error)
//   }

//   return {
//     "995": 0,
//     "917": 0,
//     "875": 0,
//     "750": 0,
//     "pure": 0,
//   }
// }

// // Clear all data (for testing/reset)
// export const clearStorage = (): void => {
//   try {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS)
//       localStorage.removeItem(STORAGE_KEYS.PURITY_STOCK)
//       localStorage.removeItem(STORAGE_KEYS.WORKERS)
//     }
//   } catch (error) {
//     console.error('Failed to clear storage:', error)
//   }
// }

// // Add these helpers to update purity stock on issue/return
// export const updatePurityStockOnIssue = (purity: number | string, weight: number): void => {
//   try {
//     const stock = loadPurityStock() || { '995': 0, '917': 0, '875': 0, '750': 0, 'pure': 0 }
//     const purityKey = purity.toString()
//     const current = Number((stock as any)[purityKey] || 0)
//     (stock as any)[purityKey] = Math.max(0, current - Number(weight))
//     savePurityStock(stock as PurityStock)
//   } catch (error) {
//     console.error('Failed to update purity stock on issue:', error)
//   }
// }

// export const updatePurityStockOnReturn = (purity: number | string, returnedWeight: number): void => {
//   try {
//     const stock = loadPurityStock() || { '995': 0, '917': 0, '875': 0, '750': 0, 'pure': 0 }
//     const purityKey = purity.toString()
//     const current = Number((stock as any)[purityKey] || 0)
//     (stock as any)[purityKey] = current + Number(returnedWeight)
//     savePurityStock(stock as PurityStock)
//   } catch (error) {
//     console.error('Failed to update purity stock on return:', error)
//   }
// }

// // Workers persistence helpers
// export const loadWorkers = (): Worker[] => {
//   try {
//     if (typeof window !== 'undefined') {
//       const stored = localStorage.getItem(STORAGE_KEYS.WORKERS)
//       return stored ? JSON.parse(stored) : []
//     }
//   } catch (err) {
//     console.error('Failed to load workers:', err)
//   }
//   return []
// }

// export const saveWorkers = (workers: Worker[]): void => {
//   try {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers))
//     }
//   } catch (err) {
//     console.error('Failed to save workers:', err)
//   }
// }

// // -------------------------------
// // Update Worker Stats
// // -------------------------------
// export const updateWorkerOnIssue = (workerName: string, amount: number): void => {
//   try {
//     const workers = loadWorkers()
//     const worker = workers.find(w => w.name === workerName)
//     if (worker) {
//       worker.totalIssued = (worker.totalIssued || 0) + Number(amount)
//     } else {
//       workers.push({
//         id: Date.now().toString(),
//         name: workerName,
//         totalIssued: Number(amount),
//         totalReturned: 0,
//         totalLoss: 0,
//         efficiency: 0
//       })
//     }
//     saveWorkers(workers)
//   } catch (err) {
//     console.error('Failed to update worker on issue:', err)
//   }
// }

// export const updateWorkerOnReturn = (workerName: string, returnedWeight: number, loss: number): void => {
//   try {
//     const workers = loadWorkers()
//     const worker = workers.find(w => w.name === workerName)
//     if (worker) {
//       worker.totalReturned = (worker.totalReturned || 0) + Number(returnedWeight)
//       worker.totalLoss = (worker.totalLoss || 0) + Number(loss)
//       const totalIssued = (worker.totalIssued && worker.totalIssued > 0) ? worker.totalIssued : 1
//       const efficiencyValue = (worker.totalReturned / totalIssued) * 100
//       worker.efficiency = Number(efficiencyValue.toFixed(1))
//     }
//     saveWorkers(workers)
//   } catch (err) {
//     console.error('Failed to update worker on return:', err)
//   }
// }




import { GoldTransaction, PurityStock } from "./gold-calculations"

export interface Worker {
  id: string
  name: string
  totalIssued: number
  totalReturned: number
  totalLoss: number
  efficiency: number
}

export const STORAGE_KEYS = {
  TRANSACTIONS: "gold_transactions",
  PURITY_STOCK: "purity_stock",
  APP_STORE: "gold_app_store",
  EXTRA_LOSSES: "extra_losses",
  WORKERS: "workers"
}

// Save transactions to localStorage
export const saveTransactions = (transactions: GoldTransaction[]): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
    }
  } catch (error) {
    console.error('Failed to save transactions:', error)
  }
}

// Load transactions from localStorage - START EMPTY
export const loadTransactions = (): GoldTransaction[] => {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
    if (stored) {
      const transactions = JSON.parse(stored)
      return transactions.map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }))
    }
  } catch (error) {
    console.error('Failed to load transactions:', error)
  }

  return []
}

// Save purity stock
export const savePurityStock = (purityStock: PurityStock): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PURITY_STOCK, JSON.stringify(purityStock))
    }
  } catch (error) {
    console.error('Failed to save purity stock:', error)
  }
}

// Load purity stock - START EMPTY
export const loadPurityStock = (): PurityStock => {
  if (typeof window === 'undefined') {
    return {
      "995": 0,
      "917": 0,
      "875": 0,
      "750": 0,
      "pure": 0,
    }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PURITY_STOCK)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load purity stock:', error)
  }

  return {
    "995": 0,
    "917": 0,
    "875": 0,
    "750": 0,
    "pure": 0,
  }
}

// Clear all data (for testing/reset)
export const clearStorage = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS)
      localStorage.removeItem(STORAGE_KEYS.PURITY_STOCK)
      localStorage.removeItem(STORAGE_KEYS.WORKERS)
    }
  } catch (error) {
    console.error('Failed to clear storage:', error)
  }
}

// FIXED: Update purity stock on issue
export const updatePurityStockOnIssue = (purity: number | string, weight: number): void => {
  try {
    const stock = loadPurityStock()
    const purityKey = purity.toString() as keyof PurityStock
    
    // FIX: Remove the extra parentheses around Number()
    const current = Number(stock[purityKey]) || 0
    stock[purityKey] = Math.max(0, current - Number(weight))
    savePurityStock(stock)
  } catch (error) {
    console.error('Failed to update purity stock on issue:', error)
  }
}

// FIXED: Update purity stock on return
export const updatePurityStockOnReturn = (purity: number | string, returnedWeight: number): void => {
  try {
    const stock = loadPurityStock()
    const purityKey = purity.toString() as keyof PurityStock
    
    // FIX: Remove the extra parentheses around Number()
    const current = Number(stock[purityKey]) || 0
    stock[purityKey] = current + Number(returnedWeight)
    savePurityStock(stock)
  } catch (error) {
    console.error('Failed to update purity stock on return:', error)
  }
}

// Workers persistence helpers
export const loadWorkers = (): Worker[] => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.WORKERS)
      return stored ? JSON.parse(stored) : []
    }
  } catch (err) {
    console.error('Failed to load workers:', err)
  }
  return []
}

export const saveWorkers = (workers: Worker[]): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers))
    }
  } catch (err) {
    console.error('Failed to save workers:', err)
  }
}

// Update Worker Stats
export const updateWorkerOnIssue = (workerName: string, amount: number): void => {
  try {
    const workers = loadWorkers()
    const worker = workers.find(w => w.name === workerName)
    if (worker) {
      worker.totalIssued = (worker.totalIssued || 0) + Number(amount)
    } else {
      workers.push({
        id: Date.now().toString(),
        name: workerName,
        totalIssued: Number(amount),
        totalReturned: 0,
        totalLoss: 0,
        efficiency: 0
      })
    }
    saveWorkers(workers)
  } catch (err) {
    console.error('Failed to update worker on issue:', err)
  }
}

export const updateWorkerOnReturn = (workerName: string, returnedWeight: number, loss: number): void => {
  try {
    const workers = loadWorkers()
    const worker = workers.find(w => w.name === workerName)
    if (worker) {
      worker.totalReturned = (worker.totalReturned || 0) + Number(returnedWeight)
      worker.totalLoss = (worker.totalLoss || 0) + Number(loss)
      const totalIssued = (worker.totalIssued && worker.totalIssued > 0) ? worker.totalIssued : 1
      const efficiencyValue = (worker.totalReturned / totalIssued) * 100
      worker.efficiency = Number(efficiencyValue.toFixed(1))
    }
    saveWorkers(workers)
  } catch (err) {
    console.error('Failed to update worker on return:', err)
  }
}