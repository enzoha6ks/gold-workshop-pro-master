"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoldTransaction } from "@/lib/gold-calculations"
import { Calendar, Scale, Gem, TrendingDown, Building, FileText, Clock, CheckCircle } from "lucide-react"

interface VendorPerformance {
  totalTransactions: number
  completedTransactions: number
  pendingTransactions: number
  efficiency: number
  totalLoss: number
}

export interface MarketTransaction extends GoldTransaction {
  vendor: string
  status: 'pending' | 'completed'
  performance?: VendorPerformance
  transactions?: MarketTransaction[]
}

interface TransactionDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: MarketTransaction | null
}

export function TransactionDetailsDialog({ open, onOpenChange, transaction }: TransactionDetailsDialogProps) {
  if (!transaction) return null

  const getStatusColor = (status: string, type: string) => {
    if (type === 'send_market') {
      return status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return 'bg-green-100 text-green-800 border-green-200'
  }

  const getTypeLabel = (type: string, status: string) => {
    if (type === 'send_market') {
      return status === 'pending' ? 'Sent to Market (Pending)' : 'Sent to Market (Completed)'
    }
    return 'Received from Market'
  }

  const getStatusIcon = (status: string) => {
    return status === 'pending' ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Transaction Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this market transaction
          </DialogDescription>
        </DialogHeader>

        {transaction && 'performance' in transaction ? (
          /* Vendor Details View */
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-slate-900">{transaction.vendor}</h3>
                <p className="text-sm text-slate-500">Vendor Performance Summary</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Vendor Profile
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Transaction Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Total Transactions:</span>
                    <span className="font-mono font-medium">{transaction.performance.totalTransactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Completed:</span>
                    <span className="font-mono font-medium text-green-600">{transaction.performance.completedTransactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Pending:</span>
                    <span className="font-mono font-medium text-amber-600">{transaction.performance.pendingTransactions}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Efficiency:</span>
                    <span className="font-mono font-medium">{transaction.performance.efficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Total Loss:</span>
                    <span className="font-mono font-medium text-rose-600">{transaction.performance.totalLoss}g</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transaction.transactions?.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-2 border rounded text-sm">
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      <span>{transaction.weight}g • {transaction.type}</span>
                      {transaction.loss && transaction.loss > 0 && (
                        <span className="text-rose-600">{transaction.loss.toFixed(2)}g loss</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Original Transaction Details View */
          <div className="space-y-4">
            {/* Header with Status */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-slate-900">{transaction.vendor}</h3>
                <p className="text-sm text-slate-500">Vendor</p>
              </div>
              <Badge className={getStatusColor(transaction.status, transaction.type)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(transaction.status)}
                  {getTypeLabel(transaction.type, transaction.status)}
                </span>
              </Badge>
            </div>

            {/* Transaction Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Scale className="w-4 h-4" />
                    Weight Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Physical Weight:</span>
                    <span className="font-mono font-medium">{transaction.weight}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Purity:</span>
                    <span className="font-mono font-medium">{transaction.purity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Pure Gold:</span>
                    <span className="font-mono font-medium text-green-600">
                      {transaction.pureGoldContent.toFixed(3)}g
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    Date & Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Date:</span>
                    <span className="font-mono text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Time:</span>
                    <span className="font-mono text-sm">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Status:</span>
                    <span className={`text-sm font-medium ${transaction.status === 'pending' ? 'text-amber-600' : 'text-green-600'
                      }`}>
                      {transaction.status === 'pending' ? 'Pending' : 'Completed'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Loss Information (if applicable) */}
            {transaction.loss && transaction.loss > 0 && (
              <Card className="border-rose-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm text-rose-700">
                    <TrendingDown className="w-4 h-4" />
                    Loss Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                    <span className="text-sm font-medium text-rose-700">Gold Loss:</span>
                    <span className="font-mono font-bold text-rose-700">
                      {transaction.loss.toFixed(3)}g pure gold
                    </span>
                  </div>
                  <p className="text-xs text-rose-600 mt-2">
                    This loss represents the difference in pure gold content between sent and received amounts.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Notes (if available) */}
            {transaction.notes && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700">{transaction.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Transaction ID */}
            <div className="text-center">
              <p className="text-xs text-slate-400">Transaction ID: {transaction.id}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}