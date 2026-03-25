"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, Users, Building, Coins } from "lucide-react"
import { useAppStore } from "@/lib/store"

export default function DashboardPage() {

  const [isClient, setIsClient] = useState(false)

  const {

    transactions,

    marketTransactions,

    extraLosses,

    calculateStock,

    getTotalExtraLoss,

    getMonthlyExtraLoss,

    getVendors,

    getVendorRemainingBalance,

    getTotalLoss,

    getMonthlyTotalLoss

  } = useAppStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="p-4 flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Get all data from Zustand store
  const stock = calculateStock()
  const totalExtraLoss = getTotalExtraLoss()
  const monthlyExtraLoss = getMonthlyExtraLoss()
  const totalAllLoss = getTotalLoss() // This includes melting + market + extra loss
  const monthlyAllLoss = getMonthlyTotalLoss() // Monthly total loss
  const vendors = getVendors()

 let totalMarketGold = 0;
  let totalMarketCash = 0;

  vendors.forEach(vendor => {
    const balance = getVendorRemainingBalance(vendor);
    
    // Check if balance is the new object format { gold, cash }
    if (typeof balance === 'object' && balance !== null) {
      totalMarketGold += (Number(balance.gold) || 0);
      totalMarketCash += (Number(balance.cash) || 0);
    } else {
      // Fallback for old number-only format
      totalMarketGold += (Number(balance) || 0);
    }
  });

  // Calculate stats
  const totalTransactions = transactions.length
  const monthlyTransactions = transactions.filter(t =>
    new Date(t.date).getMonth() === new Date().getMonth()
  ).length

  // Calculate unique workers
  const uniqueWorkers = new Set(transactions.map(t => t.toFrom)).size

  // Calculate recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5)

  // Stats array - UPDATED with total loss
 const stats = [
    {
      title: "Total Stock",
      value: `${stock.totalWeight.toFixed(1)}g`,
      subtitle: `${stock.pureGoldWeight.toFixed(1)}g pure`,
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Market Gold", // Renamed for clarity
      value: `${totalMarketGold.toFixed(1)}g`,
      subtitle: `${vendors.length} vendors`,
      icon: Building,
      color: "text-amber-600"
    },
    {
      title: "Total Loss",
      value: `${totalAllLoss.toFixed(1)}g`,
      subtitle: `${monthlyAllLoss.toFixed(1)}g this month`,
      icon: AlertTriangle,
      color: "text-rose-600"
    },
    {
      title: "Market Cash", // Added a new card for the KWD balance
      value: `${totalMarketCash.toFixed(2)} KD`,
      subtitle: "Pending making charges",
      icon: Coins,
      color: "text-emerald-600"
    },
  ]

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-slate-600">Overview of your gold workshop operations</p>
      </motion.div>

      {/* Stats Grid - Mobile Responsive */}
      <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="w-full"
          >
            <Card className="w-full h-full shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
                <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid - Mobile Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Purity Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-3">
              <CardTitle className="text-lg sm:text-xl">Gold Stock by Purity</CardTitle>
              <CardDescription className="text-sm">Current inventory breakdown</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {Object.entries(stock.purityBreakdown).map(([purity, weight]) => (
                  <div key={purity} className="text-center p-3 sm:p-4 border rounded-lg bg-slate-50">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">{weight.toFixed(1)}g</div>
                    <div className="text-xs sm:text-sm text-slate-500">{purity}K Gold</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {purity === '24' ? '995' : purity === '22' ? '917' : purity === '21' ? '875' : '750'} purity
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-3">
              <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
              <CardDescription className="text-sm">Latest gold movements</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-slate-500">
                  <Package className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-slate-300" />
                  <p className="text-sm">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-60 overflow-y-auto">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg text-sm">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{transaction.toFrom}</p>
                        <p className="text-xs text-slate-500 truncate">
                          {transaction.weight}g • {transaction.type}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <span className="text-xs text-slate-500 block">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                        {transaction.loss && transaction.loss > 0 && (
                          <div className="text-xs text-rose-600">
                            {transaction.loss.toFixed(1)}g loss
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Loss & Balance Breakdown - Mobile Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
      >
        {/* Loss Card - UPDATED to show total loss breakdown */}
        <Card className="border-rose-200">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-rose-700 text-base sm:text-lg">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              Total Loss Breakdown
            </CardTitle>
            <CardDescription className="text-sm">Combined loss from all sources</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                <span className="text-sm font-medium text-rose-700">Total All Loss</span>
                <span className="font-mono font-bold text-rose-700 text-sm sm:text-base">
                  {totalAllLoss.toFixed(2)}g
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                <span className="text-sm font-medium text-rose-700">This Month Total</span>
                <span className="font-mono font-bold text-rose-700 text-sm sm:text-base">
                  {monthlyAllLoss.toFixed(2)}g
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-orange-700">Worker Loss Only</span>
                <span className="font-mono font-bold text-orange-700 text-sm sm:text-base">
                  {totalExtraLoss.toFixed(2)}g
                </span>
              </div>

              {/* Recent Losses */}
              {extraLosses.length > 0 && (
                <div className="mt-3 sm:mt-4">
                  <h4 className="text-sm font-medium text-rose-700 mb-2">Recent Worker Losses</h4>
                  <div className="space-y-2 max-h-24 sm:max-h-32 overflow-y-auto">
                    {extraLosses.slice(0, 5).map((loss) => (
                      <div key={loss.id} className="flex justify-between items-center text-xs p-2 bg-rose-50 rounded">
                        <span className="text-rose-700 truncate flex-1">{loss.worker}</span>
                        <span className="font-mono text-rose-700 shrink-0 ml-2">{loss.amount.toFixed(2)}g</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

{/* Market Balance Card */}
<Card className="border-amber-200">
  <CardHeader className="pb-3 p-4 sm:p-6">
    <CardTitle className="flex items-center gap-2 text-amber-700 text-base sm:text-lg">
      <Building className="w-4 h-4 sm:w-5 sm:h-5" />
      Market Balance Details
    </CardTitle>
    <CardDescription className="text-sm">Gold and Cash with market vendors</CardDescription>
  </CardHeader>
  <CardContent className="p-4 sm:p-6 pt-0">
    <div className="space-y-3 sm:space-y-4">
      <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
        <span className="text-sm font-medium text-amber-700">Total Gold Balance</span>
        <span className="font-mono font-bold text-amber-700 text-sm sm:text-base">
          {totalMarketGold.toFixed(2)}g {/* Fixed: Changed from totalMarketBalance */}
        </span>
      </div>
      <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
        <span className="text-sm font-medium text-emerald-700">Total Cash (KWD)</span>
        <span className="font-mono font-bold text-emerald-700 text-sm sm:text-base">
          {totalMarketCash.toFixed(3)} KD
        </span>
      </div>

      {/* Vendor Balances */}
      {vendors.length > 0 && (
        <div className="mt-3 sm:mt-4">
          <h4 className="text-sm font-medium text-amber-700 mb-2">Detailed Vendor List</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {vendors.map((vendor) => {
              const balance = getVendorRemainingBalance(vendor);
              // Extract values safely
              const g = typeof balance === 'object' ? balance.gold : balance;
              const c = typeof balance === 'object' ? balance.cash : 0;

              return (g !== 0 || c !== 0) ? (
                <div key={vendor} className="p-2 bg-slate-50 border rounded text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-slate-700">{vendor}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Gold: <span className="font-mono font-semibold">{g.toFixed(2)}g</span></span>
                    <span>Cash: <span className="font-mono font-semibold text-emerald-700">{c.toFixed(3)} KD</span></span>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  </CardContent>
</Card>
      </motion.div>
    </div>
  )
}