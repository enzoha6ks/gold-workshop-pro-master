// "use client"

// import { GoldTransaction } from "@/lib/gold-calculations"
// import { Badge } from "@/components/ui/badge"
// import { getPurityColor } from "@/lib/gold-calculations"

// interface GoldTransactionsTableProps {
//   transactions: GoldTransaction[]
// }

// export function GoldTransactionsTable({ transactions }: GoldTransactionsTableProps) {
//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case 'issue': return 'bg-blue-100 text-blue-800'
//       case 'return': return 'bg-green-100 text-green-800' 
//       case 'send_market': return 'bg-amber-100 text-amber-800'
//       case 'receive_market': return 'bg-purple-100 text-purple-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   return (
//     <div className="border rounded-lg">
//       <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 border-b text-sm font-medium text-slate-700">
//         <div className="col-span-2">Date</div>
//         <div className="col-span-2">Type</div>
//         <div className="col-span-2">To/From</div>
//         <div className="col-span-2">Weight</div>
//         <div className="col-span-2">Purity</div>
//         <div className="col-span-2">Loss</div>
//       </div>
      
//       <div className="divide-y">
//         {transactions.map((transaction) => (
//           <div key={transaction.id} className="grid grid-cols-12 gap-4 px-4 py-3 text-sm items-center">
//             <div className="col-span-2 text-slate-600">
//              {new Date(transaction.date).toLocaleDateString()}
//             </div>
//             <div className="col-span-2">
//               <Badge variant="secondary" className={getTypeColor(transaction.type)}>
//                 {transaction.type}
//               </Badge>
//             </div>
//             <div className="col-span-2 font-medium text-slate-900">
//               {transaction.toFrom}
//             </div>
//             <div className="col-span-2 font-mono text-slate-900">
//               {transaction.weight}g
//             </div>
//             <div className="col-span-2">
//               <Badge variant="outline" className={getPurityColor(transaction.purity)}>
//                 {transaction.purity}K
//               </Badge>
//             </div>
//             <div className="col-span-2 font-mono">
//               {transaction.loss ? (
//                 <span className="text-rose-600">-{transaction.loss}g</span>
//               ) : (
//                 <span className="text-slate-400">-</span>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }


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
      case 'issue': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'return': return 'bg-green-100 text-green-800 border-green-200'
      case 'send_market': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'receive_market': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'issue': return 'Issue'
      case 'return': return 'Return'
      case 'send_market': return 'Send Market'
      case 'receive_market': return 'Receive Market'
      default: return type
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 border-b text-sm font-medium text-slate-700">
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">To/From</div>
        <div className="col-span-2">Weight</div>
        <div className="col-span-2">Purity</div>
        <div className="col-span-2">Loss</div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden px-4 py-3 bg-slate-50 border-b">
        <h3 className="text-sm font-medium text-slate-700">Gold Transactions</h3>
        <p className="text-xs text-slate-500">{transactions.length} transactions</p>
      </div>
      
      <div className="divide-y">
        {transactions.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="text-gray-300 text-4xl mb-3">⚖️</div>
            <p className="text-gray-500 text-sm">No transactions found</p>
            <p className="text-gray-400 text-xs mt-1">Transactions will appear here</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id}>
              {/* Desktop View */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-sm items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-2 text-slate-600 min-w-0">
                  {new Date(transaction.date).toLocaleDateString()}
                </div>
                <div className="col-span-2">
                  <Badge variant="secondary" className={getTypeColor(transaction.type)}>
                    {getTypeLabel(transaction.type)}
                  </Badge>
                </div>
                <div className="col-span-2 font-medium text-slate-900 truncate min-w-0">
                  {transaction.toFrom}
                </div>
                <div className="col-span-2 font-mono text-slate-900 min-w-0">
                  {transaction.weight}g
                </div>
                <div className="col-span-2">
                  <Badge variant="outline" className={getPurityColor(transaction.purity)}>
                    {transaction.purity}K
                  </Badge>
                </div>
                <div className="col-span-2 font-mono min-w-0">
                  {transaction.loss ? (
                    <span className="text-rose-600 whitespace-nowrap">-{transaction.loss}g</span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={getTypeColor(transaction.type)}>
                      {getTypeLabel(transaction.type)}
                    </Badge>
                    <div className="text-xs text-slate-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  {transaction.loss && (
                    <div className="text-rose-600 text-sm font-medium whitespace-nowrap">
                      -{transaction.loss}g loss
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-slate-600 text-xs font-medium">Person</div>
                    <div className="font-medium text-slate-900 truncate">
                      {transaction.toFrom}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-slate-600 text-xs font-medium">Weight</div>
                    <div className="font-mono text-slate-900 whitespace-nowrap">
                      {transaction.weight}g
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-600 text-xs font-medium">Purity</div>
                    <Badge variant="outline" className={getPurityColor(transaction.purity)}>
                      {transaction.purity}K
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile Summary */}
      {transactions.length > 0 && (
        <div className="md:hidden px-4 py-3 bg-slate-50 border-t">
          <div className="flex justify-between items-center text-xs text-slate-600">
            <span>Showing {transactions.length} transactions</span>
            <span>
              {transactions.filter(t => t.loss).length} with loss
            </span>
          </div>
        </div>
      )}
    </div>
  )
}