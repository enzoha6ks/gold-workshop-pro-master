"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Scale, Plus, Edit3, Undo2 } from "lucide-react"
import { GoldTransactionsTable } from "@/components/gold/gold-transactions-table"
import { IssueGoldDialog } from "@/components/gold/issue-gold-dialog"
import { ReturnGoldDialog } from "@/components/gold/return-gold-dialog"
import { UpdatePurityStockDialog } from "@/components/gold/update-purity-stock-dialog"
import { useAppStore } from "@/lib/store"
import { calculateStockFromTransactions } from "@/lib/gold-calculations"

export default function GoldSafePage() {
  const {
    transactions,
    purityStock,
    addTransaction,
    setPurityStock,
    isLoading
  } = useAppStore()

  const [showIssueDialog, setShowIssueDialog] = useState(false)
  const [showReturnDialog, setShowReturnDialog] = useState(false)
  const [showUpdateStockDialog, setShowUpdateStockDialog] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Wait for client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-600 rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-600"
          >
            Loading gold safe...
          </motion.p>
        </div>
      </div>
    )
  }

  // Calculate current stock from real transactions
  const currentStock = calculateStockFromTransactions(transactions, purityStock || undefined)

  // Get pending issues (gold issued but not returned)
  const pendingIssues = transactions.filter(t => t.type === 'issue')
    .filter(issue => !transactions.some(t => t.type === 'return' && t.notes?.includes(issue.id)))

  // Calculate total loss from all transactions
  const totalLoss = transactions.reduce((total, transaction) =>
    total + (transaction.loss || 0), 0
  )

  const handleIssue = (transactionData: any) => {
    addTransaction(transactionData)
  }

  const handleReturn = (transactionData: any) => {
    addTransaction(transactionData)
  }

  const handleUpdatePurityStock = async (newPurityStock: any) => {
    // Now this will work because it exists in the store!
    await setPurityStock(newPurityStock)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <motion.h1 
            className="text-2xl sm:text-3xl font-bold text-slate-900"
            whileHover={{ scale: 1.02 }}
          >
            Gold Safe Management
          </motion.h1>
        </div>

        {/* Buttons group */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row w-full sm:w-auto gap-3"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowUpdateStockDialog(true)}
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <Edit3 className="w-4 h-4" />
              Update Stocks
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowReturnDialog(true)}
              variant="outline"
              className="gap-2 w-full sm:w-auto"
              disabled={pendingIssues.length === 0}
            >
              <Undo2 className="w-4 h-4" />
              Return Gold
              {pendingIssues.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-amber-500 text-white">
                  {pendingIssues.length}
                </Badge>
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowIssueDialog(true)}
              className="gap-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Issue Gold
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 4-Card Purity System - REAL DATA */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* 995 Purity Card */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Card className="cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">995 Gold</CardTitle>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">24K</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {currentStock.purityStock['995'].toFixed(2)}g
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>99.5% Pure</span>
                <span>{(currentStock.purityStock['995'] * 0.995).toFixed(1)}g pure</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 917 Purity Card */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Card className="cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">917 Gold</CardTitle>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">22K</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {currentStock.purityStock['917'].toFixed(2)}g
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>91.7% Pure</span>
                <span>{(currentStock.purityStock['917'] * 0.917).toFixed(1)}g pure</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 875 Purity Card */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Card className="cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">875 Gold</CardTitle>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">21K</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {currentStock.purityStock['875'].toFixed(2)}g
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>87.5% Pure</span>
                <span>{(currentStock.purityStock['875'] * 0.875).toFixed(1)}g pure</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pure Gold Card (Auto-calculated) */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pure Gold</CardTitle>
              <Scale className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {currentStock.pureGoldWeight.toFixed(2)}g
              </div>
              <p className="text-xs text-slate-500">
                Auto-calculated 999 purity
              </p>
              <div className="text-xs text-green-600 mt-1 font-medium">
                ↑ From purity stocks
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Pending Issues & Transactions */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Pending Issues */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Returns</CardTitle>
                <CardDescription>Gold issued but not returned</CardDescription>
              </div>
              <Badge variant="secondary">{pendingIssues.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence>
                {pendingIssues.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No pending returns</p>
                    <p className="text-xs text-gray-400">Issue gold to workers first</p>
                  </motion.div>
                ) : (
                  pendingIssues.map((issue, index) => (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 bg-amber-50 rounded-lg border border-amber-200 cursor-pointer"
                      onClick={() => setShowReturnDialog(true)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{issue.toFrom}</p>
                          <p className="text-xs text-amber-700">
                            {issue.weight}g {issue.purity}K
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-xs text-amber-600 mt-1">
                        Issued: {new Date(issue.date).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transactions Table */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Gold Transactions</CardTitle>
              <CardDescription>
                All movements with automatic calculations
                {transactions.length > 0 && (
                  <span className="text-green-600 ml-2">• {transactions.length} records</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {transactions.length === 0 ? (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                  >
                    <Scale className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No transactions yet</h3>
                    <p className="text-gray-500 mt-1">Start by issuing gold to workers or updating your stock</p>
                    <div className="mt-6 flex gap-3 justify-center">
                      <Button onClick={() => setShowIssueDialog(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Issue Gold
                      </Button>
                      <Button variant="outline" onClick={() => setShowUpdateStockDialog(true)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Set Stock
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GoldTransactionsTable transactions={transactions} />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Dialogs */}
      <IssueGoldDialog
        open={showIssueDialog}
        onOpenChange={setShowIssueDialog}
        onIssue={handleIssue}
        currentStock={currentStock}
      />

      <ReturnGoldDialog
        open={showReturnDialog}
        onOpenChange={setShowReturnDialog}
        onReturn={handleReturn}
        pendingIssues={pendingIssues}
      />

      <UpdatePurityStockDialog
        open={showUpdateStockDialog}
        onOpenChange={setShowUpdateStockDialog}
        onUpdate={handleUpdatePurityStock}
        currentStock={currentStock.purityStock}
      />
    </motion.div>
  )
}
