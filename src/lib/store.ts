import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GoldTransaction, MarketTransaction, PurityStock, calculateStockFromTransactions } from './gold-calculations'



// Define types
interface ExtraLoss {
  id: string
  worker: string
  amount: number
  note: string
  date: string
}

// Add Order interface
export interface Order {
  id: string
  customer: string
  phone: string
  items: string
  goldWeight: number
  purity: number
  makingCharges: number
  status: 'pending' | 'designing' | 'making' | 'polishing' | 'completed' | 'delivered' | 'cancelled'
  deadline: string
  progress: number
  createdAt: string
  completedAt?: string
  notes?: string
  revenue?: number
}

interface AppState {
  // Core state
  transactions: GoldTransaction[]
  marketTransactions: MarketTransaction[]
  extraLosses: ExtraLoss[]
  purityStock: PurityStock
  orders: Order[] // Add orders to store


  
  // Actions
  addTransaction: (transaction: GoldTransaction) => void
  addMarketTransaction: (transaction: MarketTransaction) => void
  addExtraLoss: (loss: ExtraLoss) => void
  setPurityStock: (purityStock: PurityStock) => void
  addOrder: (order: Order) => void // Add order action
  updateOrder: (orderId: string, updates: Partial<Order>) => void // Update order action
  completeOrder: (orderId: string, revenue: number) => void // Complete order action
  deliverOrder: (orderId: string) => void // Deliver order action
  getVendorRemainingBalance: (vendor: string) => number

  // Calculations
  calculateStock: () => ReturnType<typeof calculateStockFromTransactions>
  
  // Market functions
  getMarketLoss: () => number
  getMonthlyMarketLoss: () => number
  getVendors: () => string[]
  
  // Extra loss functions
  getTotalExtraLoss: () => number
  getMonthlyExtraLoss: () => number

  // Order functions
  getTotalRevenue: () => number
  getActiveOrders: () => Order[]
  getCompletedOrders: () => Order[]
  
  // Force updates
  lastUpdate: number
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state - EMPTY
      transactions: [],
      marketTransactions: [],
      extraLosses: [],
      purityStock: {
        '995': 0,
        '917': 0,
        '875': 0,
        '750': 0,
        'pure': 0
      },
      orders: [], // Initialize empty orders array
      lastUpdate: Date.now(),

      // Add regular transaction
      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [transaction, ...state.transactions],
          lastUpdate: Date.now()
        }))
      },

      // Add market transaction
      addMarketTransaction: (transaction) => {
        set((state) => ({
          marketTransactions: [transaction, ...state.marketTransactions],
          lastUpdate: Date.now()
        }))
      },

      // Add extra loss
      addExtraLoss: (loss) => {
        set((state) => ({
          extraLosses: [loss, ...state.extraLosses],
          lastUpdate: Date.now()
        }))
      },

      // Set purity stock
      setPurityStock: (purityStock) => {
        set((state) => ({
          purityStock,
          lastUpdate: Date.now()
        }))
      },

      // Add order
      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
          lastUpdate: Date.now()
        }))
      },

      // Update order
      updateOrder: (orderId, updates) => {
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === orderId ? { ...order, ...updates } : order
          ),
          lastUpdate: Date.now()
        }))
      },

      // Complete order
      completeOrder: (orderId, revenue) => {
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === orderId ? { 
              ...order, 
              status: 'completed',
              progress: 100,
              completedAt: new Date().toISOString(),
              revenue
            } : order
          ),
          lastUpdate: Date.now()
        }))
      },

      // Deliver order
      deliverOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === orderId ? { 
              ...order, 
              status: 'delivered'
            } : order
          ),
          lastUpdate: Date.now()
        }))
      },

      // Calculate stock
      calculateStock: () => {
        const state = get()
        return calculateStockFromTransactions(state.transactions, state.purityStock)
      },

      // MARKET FUNCTIONS

      // Calculate total market loss
      getMarketLoss: () => {
        const state = get()
        return state.marketTransactions
          .filter(t => t.type === 'receive_market' && t.loss)
          .reduce((total, t) => total + (t.loss || 0), 0)
      },

      // Calculate monthly market loss
      getMonthlyMarketLoss: () => {
        const state = get()
        const now = new Date()
        return state.marketTransactions
          .filter(t => 
            t.type === 'receive_market' && 
            t.loss && 
            new Date(t.date).getMonth() === now.getMonth() &&
            new Date(t.date).getFullYear() === now.getFullYear()
          )
          .reduce((total, t) => total + (t.loss || 0), 0)
      },

      // Get unique vendors
      getVendors: () => {
        const state = get()
        const vendors = new Set(state.marketTransactions.map(t => t.vendor))
        return Array.from(vendors)
      },

      // EXTRA LOSS FUNCTIONS

      // Calculate total extra loss
      getTotalExtraLoss: () => {
        const state = get()
        return state.extraLosses.reduce((total, loss) => total + loss.amount, 0)
      },

      // Calculate monthly extra loss
      getMonthlyExtraLoss: () => {
        const state = get()
        const now = new Date()
        return state.extraLosses
          .filter(loss => {
            const lossDate = new Date(loss.date)
            return lossDate.getMonth() === now.getMonth() && 
                   lossDate.getFullYear() === now.getFullYear()
          })
          .reduce((total, loss) => total + loss.amount, 0)
      },

      // ORDER FUNCTIONS

      // Calculate total revenue
      getTotalRevenue: () => {
        const state = get()
        return state.orders
          .filter(order => order.revenue)
          .reduce((total, order) => total + (order.revenue || 0), 0)
      },

      // Get active orders
      getActiveOrders: () => {
        const state = get()
        return state.orders.filter(order => 
          ['pending', 'designing', 'making', 'polishing'].includes(order.status)
        )
      },
      // Add this to your store
getVendorRemainingBalance: (vendor: string) => {
  const sentTransactions = get().marketTransactions
    .filter(t => t.vendor === vendor && t.type === 'send_market')
    .reduce((total, t) => total + ((t.weight * t.purity) / 999), 0)
  
  const receivedTransactions = get().marketTransactions
    .filter(t => t.vendor === vendor && t.type === 'receive_market')
    .reduce((total, t) => total + (t.pureGoldContent || 0), 0)
  
  return sentTransactions - receivedTransactions
},

      // Get completed orders
      getCompletedOrders: () => {
        const state = get()
        return state.orders.filter(order => 
          ['completed', 'delivered'].includes(order.status)
        )
      }
    }),
    {
      name: 'app-storage',
    }
  )
)