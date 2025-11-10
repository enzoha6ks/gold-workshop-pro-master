"use client"

import { useState, useEffect } from "react"
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
    setPurityStock
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
          <div className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading gold safe...</p>
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

  const handleUpdatePurityStock = (newPurityStock: any) => {
    setPurityStock(newPurityStock)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Gold Safe Management
          </h1>
        </div>

        {/* Buttons group */}
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
          <Button
            onClick={() => setShowUpdateStockDialog(true)}
            variant="outline"
            className="gap-2 w-full sm:w-auto"
          >
            <Edit3 className="w-4 h-4" />
            Update Stocks
          </Button>

          <Button
            onClick={() => setShowReturnDialog(true)}
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            disabled={pendingIssues.length === 0}
          >
            <Undo2 className="w-4 h-4" />
            Return Gold
          </Button>

          <Button
            onClick={() => setShowIssueDialog(true)}
            className="gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Issue Gold
          </Button>
        </div>
      </div>


      {/* 4-Card Purity System - REAL DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 995 Purity Card */}
        <Card>
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

        {/* 917 Purity Card */}
        <Card>
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

        {/* 875 Purity Card */}
        <Card>
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

        {/* Pure Gold Card (Auto-calculated) */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
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
      </div>

      {/* Pending Issues & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Pending Issues */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Returns</CardTitle>
              <CardDescription>Gold issued but not returned</CardDescription>
            </div>
            <Badge variant="secondary">{pendingIssues.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingIssues.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No pending returns</p>
                <p className="text-xs text-gray-400">Issue gold to workers first</p>
              </div>
            ) : (
              pendingIssues.map((issue) => (
                <div key={issue.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
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
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="lg:col-span-3">
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
            {transactions.length === 0 ? (
              <div className="text-center py-12">
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
              </div>
            ) : (
              <GoldTransactionsTable transactions={transactions} />
            )}
          </CardContent>
        </Card>
      </div>

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
    </div>
  )
}