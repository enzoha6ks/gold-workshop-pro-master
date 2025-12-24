import { create } from "zustand";
import {
  GoldTransaction,
  MarketTransaction,
  PurityStock,
  calculateStockFromTransactions,
  addTransaction,
} from "./gold-calculations";
import { toast } from "sonner";

interface ExtraLoss {
  id: string;
  worker: string;
  amount: number;
  note: string;
  date: string;
}

interface AppState {
  // Data
  transactions: GoldTransaction[];
  marketTransactions: MarketTransaction[];
  addMarketTransaction: (transaction: any) => Promise<void>;
  extraLosses: ExtraLoss[]; 
  purityStock: PurityStock;
  orders: any[];
  meltingBatches: any[];
  workers: any[];
  isLoading: boolean;
  
  addExtraLoss: (lossData: any) => Promise<void>;
  addWorker: (workerData: { name: string }) => Promise<void>; 
  fetchInitialData: () => Promise<void>;
  addOrder: (orderData: any) => Promise<void>;
  updateOrder: (id: string, updates: any) => Promise<void>;
  completeOrder: (id: string, revenue?: number) => Promise<void>;
  deliverOrder: (id: string) => Promise<void>; 

  // Sync
  setInitialData: (data: any) => void;
  setPurityStock: (newStock: PurityStock) => Promise<void>;
  addTransaction: (transaction: any) => Promise<void>; 

  // Dashboard Functions (Must match your dashboard destructuring exactly)
  calculateStock: () => PurityStock;
  getTotalExtraLoss: () => number;
  getMonthlyExtraLoss: () => number;
  getVendors: () => string[];
  getVendorRemainingBalance: (vendor: string) => number;
  getTotalLoss: () => number;
  getMonthlyTotalLoss: () => number;
  getMarketLoss: () => number;
  getMonthlyMarketLoss: () => number;
  getTotalRevenue: () => number;
  getActiveOrders: () => any[];
  getCompletedOrders: () => any[];
  getTotalMeltingLoss: () => number;
  getTotalMeltingGain: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  transactions: [],
  marketTransactions: [],
  extraLosses: [],
  purityStock: { "995": 0, "917": 0, "875": 0, "750": 0, pure: 0 },
  orders: [],
  meltingBatches: [],
  workers: [],
  isLoading: true,

  setInitialData: (data) => set({
  transactions: data.transactions || [],
  marketTransactions: data.marketTransactions || [],
  extraLosses: data.extraLosses || [],
  orders: data.orders || [],
  meltingBatches: data.meltingBatches || [],
  workers: data.workers || [],
  // Check this line below:
  purityStock: data.purityStock || { "995": 0, "917": 0, "875": 0, "750": 0, pure: 0 },
  isLoading: false,
}),

  // Extra loss logic
  addExtraLoss: async (newLoss) => {
    try {
      const response = await fetch('/api/workers/extra-loss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLoss),
      });

      if (!response.ok) throw new Error("Failed to save extra loss");

      const savedLoss = await response.json();
      
      set((state) => ({
        extraLosses: [savedLoss, ...state.extraLosses]
      }));
    } catch (error) {
      console.error("Store Error (addExtraLoss):", error);
    }
  },

  addWorker: async (workerData) => {
    try {
      const response = await fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workerData),
      });
      const savedWorker = await response.json();
      set((state) => ({
        workers: [...(state.workers || []), savedWorker]
      }));
    } catch (error) {
      console.error("Error adding worker:", error);
    }
  },



  setPurityStock: async (newStock: PurityStock) => {
    // 1. Update the local state for instant UI feedback
    set({ purityStock: newStock });

    // 2. Sync to the Database
    try {
      const response = await fetch('/api/gold/purity-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStock),
      });

      if (!response.ok) {
        // Get the actual error message from the API
        const errorData = await response.json().catch(() => ({}));
        console.error("Server Error Details:", errorData);
        throw new Error(errorData.error || `Server Error ${response.status}`);
      }

      console.log("✅ Sync Successful");
    } catch (error: any) {
      console.error("Database sync error:", error.message);
      // This will now show the REAL reason in your browser console
    }
  },

  addTransaction: async (transactionData) => {
    try {
      const response = await fetch('/api/gold/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        console.error("Server Error Detail:", errorDetail); // This helps us debug
        throw new Error("Failed to save transaction");
      }

      const savedTransaction = await response.json();
      
      set((state) => ({
        transactions: [savedTransaction, ...state.transactions]
      }));
      
      console.log("✅ Transaction Saved to DB");
    } catch (error) {
      console.error("Add Transaction Error:", error);
    }
  },

  addMarketTransaction: async (transactionData) => {
    try {
      const response = await fetch('/api/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        console.error("Server Error Detail:", errorDetail);
        throw new Error("Failed to save market transaction");
      }

      const savedTransaction = await response.json();
      
      set((state) => ({
        marketTransactions: [savedTransaction, ...state.marketTransactions]
      }));
    } catch (error) {
      console.error("Error adding market transaction:", error);
    }
  },

  fetchInitialData: async () => {
    try {
      const response = await fetch('/api/sync/get-all');
      if (!response.ok) throw new Error('Sync failed');
      const data = await response.json();

      set({
        orders: data.orders || [],
        transactions: data.transactions || [],
        workers: data.workers || [],
        extraLosses: data.extraLosses || [],
        meltingBatches: data.meltingBatches || [],
        marketTransactions: data.marketTransactions || [],
        purityStock: data.purityStock || { "995": 0, "917": 0, "875": 0, "750": 0, pure: 0 },
      });
    } catch (error) {
      console.error("Store sync error:", error);
    }
  },

  addOrder: async (orderData) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => null);
        console.error('Server Error (addOrder):', detail);
        throw new Error('Failed to save order');
      }

      const newOrder = await response.json();
      set((state) => ({ orders: [newOrder, ...state.orders] }));
    } catch (error) {
      console.error("Error adding order:", error);
    }
  },

  updateOrder: async (id, updates) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update order");

      const updatedOrder = await response.json();

      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
      }));
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order in database");
    }
  },

  completeOrder: async (id, revenue) => {
    try {
      const response = await fetch(`/api/orders/${id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revenue, status: 'completed' }),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => null);
        console.error('Server Error (completeOrder):', detail);
        throw new Error('Failed to complete order');
      }

      const updatedOrder = await response.json();
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
      }));
    } catch (error) {
      console.error("Failed to complete order:", error);
      toast.error("Failed to complete order in database");
    }
  },

  deliverOrder: async (id) => {
    try {
      const response = await fetch(`/api/orders/${id}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'delivered' }),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => null);
        console.error('Server Error (deliverOrder):', detail);
        throw new Error('Failed to deliver order');
      }

      const updatedOrder = await response.json();
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
      }));
    } catch (error) {
      console.error("Failed to deliver order:", error);
      toast.error("Failed to deliver order in database");
    }
  },

  // 1. Live Stock Calculation
  calculateStock: () => {
    const state = get();
    return calculateStockFromTransactions(state.transactions, state.purityStock);
  },

  // 2. Extra Loss Helpers
  getTotalExtraLoss: () => {
    return get().extraLosses.reduce((sum, loss) => sum + (Number(loss.amount) || 0), 0);
  },

  getMonthlyExtraLoss: () => {
    const now = new Date();
    return get().extraLosses
      .filter(loss => {
        const d = new Date(loss.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, loss) => sum + (Number(loss.amount) || 0), 0);
  },

  // 3. Market Helpers
  getVendors: () => {
    const vendors = new Set(get().marketTransactions.map((t) => t.vendor));
    return Array.from(vendors);
  },

  getVendorRemainingBalance: (vendor: string) => {
    const state = get();
    const sent = state.marketTransactions
      .filter((t) => t.vendor === vendor && t.type === "send_market")
      .reduce((total, t) => total + (Number(t.weight) * (Number(t.purity) || 0)) / 999, 0);

    const received = state.marketTransactions
      .filter((t) => t.vendor === vendor && t.type === "receive_market")
      .reduce((total, t) => total + (Number(t.pureGoldContent) || 0), 0);

    return sent - received;
  },

  // 4. Total Loss Calculations (Used in line 49 & 50 of your Dashboard)
  getTotalLoss: () => {
    const state = get();
    const marketLoss = state.marketTransactions
      .filter(t => t.type === "receive_market")
      .reduce((sum, t) => sum + (Number(t.loss) || 0), 0);

    const meltingLoss = state.meltingBatches
      .reduce((sum, b) => sum + (Number(b.weightChange) < 0 ? Math.abs(Number(b.weightChange)) : 0), 0);

    return state.getTotalExtraLoss() + marketLoss + meltingLoss;
  },

  getMonthlyTotalLoss: () => {
    const now = new Date();
    const state = get();

    const marketMonthly = state.marketTransactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === "receive_market" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + (Number(t.loss) || 0), 0);

    const meltingMonthly = state.meltingBatches
      .filter(b => {
        const d = new Date(b.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && Number(b.weightChange) < 0;
      })
      .reduce((sum, b) => sum + Math.abs(Number(b.weightChange)), 0);

    return state.getMonthlyExtraLoss() + marketMonthly + meltingMonthly;
  },

  // Market Loss Helpers
  getMarketLoss: () => {
    return get().marketTransactions?.reduce((sum, t) => sum + (t.loss || 0), 0) || 0;
  },

  getMonthlyMarketLoss: () => {
    const now = new Date();
    return get().marketTransactions
      ?.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + (t.loss || 0), 0) || 0;
  },

  // Revenue and Orders Helpers
  getTotalRevenue: () => {
    return get().orders?.reduce((sum, o) => sum + (o.revenue || 0), 0) || 0;
  },

  getActiveOrders: () => {
    return get().orders?.filter(o => o.status !== 'completed') || [];
  },

  getCompletedOrders: () => {
    return get().orders?.filter(o => o.status === 'completed') || [];
  },

  // Melting Batch Helpers
  getTotalMeltingLoss: () => {
    return get().meltingBatches?.reduce((sum, b) => sum + (b.loss || 0), 0) || 0;
  },

  getTotalMeltingGain: () => {
    // Calculate total weight gains from melting batches
    return get().meltingBatches?.reduce((sum, b) => sum + (Number(b.weightChange) > 0 ? Number(b.weightChange) : 0), 0) || 0;
  }
}));
