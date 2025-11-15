"use client"

import { GoldTransaction } from "@/lib/gold-calculations"
import { Badge } from "@/components/ui/badge"
import { getPurityColor } from "@/lib/gold-calculations"

interface GoldTransactionsTableProps {
  transactions: GoldTransaction[]
}

export function GoldTransactionsTable({ transactions }: GoldTransactionsTableProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'issue': return 'bg-blue-100 text-blue-800'
      case 'return': return 'bg-green-100 text-green-800' 
      case 'send_market': return 'bg-amber-100 text-amber-800'
      case 'receive_market': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="border rounded-lg">
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 border-b text-sm font-medium text-slate-700">
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">To/From</div>
        <div className="col-span-2">Weight</div>
        <div className="col-span-2">Purity</div>
        <div className="col-span-2">Loss</div>
      </div>
      
      <div className="divide-y">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="grid grid-cols-12 gap-4 px-4 py-3 text-sm items-center">
            <div className="col-span-2 text-slate-600">
             {new Date(transaction.date).toLocaleDateString()}
            </div>
            <div className="col-span-2">
              <Badge variant="secondary" className={getTypeColor(transaction.type)}>
                {transaction.type}
              </Badge>
            </div>
            <div className="col-span-2 font-medium text-slate-900">
              {transaction.toFrom}
            </div>
            <div className="col-span-2 font-mono text-slate-900">
              {transaction.weight}g
            </div>
            <div className="col-span-2">
              <Badge variant="outline" className={getPurityColor(transaction.purity)}>
                {transaction.purity}K
              </Badge>
            </div>
            <div className="col-span-2 font-mono">
              {transaction.loss ? (
                <span className="text-rose-600">-{transaction.loss}g</span>
              ) : (
                <span className="text-slate-400">-</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}