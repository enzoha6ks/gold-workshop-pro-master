


"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, Scale, AlertTriangle, Users, BarChart3 } from "lucide-react"
import { useAppStore } from "@/lib/store"

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false)
  
  // Use Zustand store - no need for manual localStorage
  const { 
    transactions, 
    marketTransactions,
    extraLosses,
    calculateStock,
    getTotalExtraLoss,
    getMonthlyExtraLoss,
    getMarketLoss,
    getMonthlyMarketLoss
  } = useAppStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="p-6 flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Get all data from Zustand store
  const stock = calculateStock()
  const totalExtraLoss = getTotalExtraLoss()
  const monthlyExtraLoss = getMonthlyExtraLoss()
  const totalMarketLoss = getMarketLoss()
  const monthlyMarketLoss = getMonthlyMarketLoss()

  // Calculate stats
  const totalTransactions = transactions.length
  const monthlyTransactions = transactions.filter(t => 
    new Date(t.date).getMonth() === new Date().getMonth()
  ).length

  // Calculate unique workers
  const uniqueWorkers = new Set(transactions.map(t => t.toFrom)).size

  // Calculate recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5)

  // Stats array - FIXED SYNTAX
  const stats = [
    { 
      title: "Total Stock", 
      value: `${stock.totalWeight.toFixed(1)}g`, 
      subtitle: `${stock.pureGoldWeight.toFixed(1)}g pure`,
      icon: Package, 
      color: "text-blue-600"
    },
    { 
      title: "Active Workers", 
      value: uniqueWorkers.toString(), 
      subtitle: `${totalTransactions} transactions`,
      icon: Users, 
      color: "text-green-600"
    },
    { 
      title: "Extra Loss", 
      value: `${totalExtraLoss.toFixed(1)}g`, 
      subtitle: `${monthlyExtraLoss.toFixed(1)}g this month`,
      icon: AlertTriangle, 
      color: "text-rose-600"
    },
    { 
      title: "Market Loss", 
      value: `${totalMarketLoss.toFixed(1)}g`, 
      subtitle: `${monthlyMarketLoss.toFixed(1)}g this month`,
      icon: TrendingDown, 
      color: "text-amber-600"
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Overview of your gold workshop operations</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-500">{stat.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purity Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Gold Stock by Purity</CardTitle>
              <CardDescription>Current inventory breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stock.purityBreakdown).map(([purity, weight]) => (
                  <div key={purity} className="text-center p-4 border rounded-lg bg-slate-50">
                    <div className="text-2xl font-bold text-slate-900">{weight.toFixed(1)}g</div>
                    <div className="text-sm text-slate-500">{purity}K Gold</div>
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
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest gold movements</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Scale className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p>No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{transaction.toFrom}</p>
                        <p className="text-xs text-slate-500">
                          {transaction.weight}g • {transaction.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500">
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

      {/* Loss Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Extra Loss Card */}
        <Card className="border-rose-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
              Extra Loss Details
            </CardTitle>
            <CardDescription>Manual loss entries from workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                <span className="text-sm font-medium text-rose-700">Total Extra Loss</span>
                <span className="font-mono font-bold text-rose-700">
                  {totalExtraLoss.toFixed(2)}g
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                <span className="text-sm font-medium text-rose-700">This Month</span>
                <span className="font-mono font-bold text-rose-700">
                  {monthlyExtraLoss.toFixed(2)}g
                </span>
              </div>
              
              {/* Recent Extra Losses */}
              {extraLosses.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-rose-700 mb-2">Recent Losses</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {extraLosses.slice(0, 5).map((loss) => (
                      <div key={loss.id} className="flex justify-between items-center text-xs p-2 bg-rose-50 rounded">
                        <span className="text-rose-700">{loss.worker}</span>
                        <span className="font-mono text-rose-700">{loss.amount.toFixed(2)}g</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Market Loss Card */}
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <TrendingDown className="w-5 h-5" />
              Market Loss Details
            </CardTitle>
            <CardDescription>Loss from market transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="text-sm font-medium text-amber-700">Total Market Loss</span>
                <span className="font-mono font-bold text-amber-700">
                  {totalMarketLoss.toFixed(2)}g
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="text-sm font-medium text-amber-700">This Month</span>
                <span className="font-mono font-bold text-amber-700">
                  {monthlyMarketLoss.toFixed(2)}g
                </span>
              </div>
              
              {/* Recent Market Transactions */}
              {marketTransactions.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-amber-700 mb-2">Recent Market</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {marketTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center text-xs p-2 bg-amber-50 rounded">
                        <span className="text-amber-700">{transaction.vendor}</span>
                        <span className="font-mono text-amber-700">
                          {transaction.weight}g
                          {transaction.loss && transaction.loss > 0 && ` (${transaction.loss.toFixed(1)}g loss)`}
                        </span>
                      </div>
                    ))}
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