// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { TrendingUp, TrendingDown, Building, Send, Receipt, Eye } from "lucide-react"
// import { useAppStore } from "@/lib/store"
// import { SendMarketDialog } from "@/components/market/send-market-dialog"
// import { ReceiveMarketDialog } from "@/components/market/receive-market-dialog"
// import { TransactionDetailsDialog } from "@/components/market/transaction-details-dialog"

// export default function MarketPage() {
//   const [activeTab, setActiveTab] = useState("transactions")
//   const [isClient, setIsClient] = useState(false)
//   const [showSendDialog, setShowSendDialog] = useState(false)
//   const [showReceiveDialog, setShowReceiveDialog] = useState(false)
//   const [showDetailsDialog, setShowDetailsDialog] = useState(false)
//   const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

//   const {
//     marketTransactions,
//     addMarketTransaction,
//     getVendors,
//     getVendorRemainingBalance,
//   } = useAppStore()

//   useEffect(() => {
//     setIsClient(true)
//   }, [])

//   if (!isClient) {
//     return (
//       <div className="p-4 flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     )
//   }

//   const vendors = getVendors()

//   // Calculate monthly sent and received
//   const now = new Date()
//   const monthlySent = marketTransactions
//     .filter(
//       (t) =>
//         t.type === "send_market" &&
//         new Date(t.date).getMonth() === now.getMonth() &&
//         new Date(t.date).getFullYear() === now.getFullYear()
//     )
//     .reduce((total, t) => total + t.weight, 0)

//   const monthlyReceived = marketTransactions
//     .filter(
//       (t) =>
//         t.type === "receive_market" &&
//         new Date(t.date).getMonth() === now.getMonth() &&
//         new Date(t.date).getFullYear() === now.getFullYear()
//     )
//     .reduce((total, t) => total + t.weight, 0)

//   // Get vendors with remaining balance
//   // Replace the vendorsWithBalance calculation with this:
//   const vendorsWithBalance = vendors
//     .filter(vendor => {
//       const balance = getVendorRemainingBalance(vendor)
//       return balance > 0
//     })
//     .map(vendor => {
//       const vendorTransactions = marketTransactions.filter(
//         t => t.vendor === vendor && t.type === 'send_market'
//       )
//       const latestTransaction = vendorTransactions[0] // Get the latest sent transaction

//       return {
//         vendor,
//         id: latestTransaction?.id || `vendor-${vendor}`,
//         weight: latestTransaction?.weight || 0,
//         purity: latestTransaction?.purity || '917',
//         date: latestTransaction?.date || new Date().toISOString(),
//         balance: getVendorRemainingBalance(vendor) // Add actual balance
//       }
//     })

//   const handleSendToMarket = (transaction: any) => {
//     addMarketTransaction(transaction)
//   }

//   const handleReceiveFromMarket = (transaction: any) => {
//     addMarketTransaction(transaction)
//   }

//   const handleViewDetails = (transaction: any) => {
//     setSelectedTransaction(transaction)
//     setShowDetailsDialog(true)
//   }

//   // Calculate vendor performance with remaining balance
//   const getVendorPerformance = () => {
//     return vendors.map((vendor) => {
//       const vendorTransactions = marketTransactions.filter(
//         (t) => t.vendor === vendor
//       )
//       const completedTransactions = vendorTransactions.filter(
//         (t) => t.type === "receive_market"
//       )

//       // Calculate remaining balance
//       const remainingBalance = getVendorRemainingBalance(vendor)

//       // Calculate efficiency
//       const sentPureGold = vendorTransactions
//         .filter((t) => t.type === "send_market")
//         .reduce((total, t) => total + (t.weight * t.purity) / 999, 0)

//       const receivedPureGold = completedTransactions.reduce(
//         (total, t) => total + (t.pureGoldContent || 0),
//         0
//       )

//       const efficiency =
//         sentPureGold > 0 ? (receivedPureGold / sentPureGold) * 100 : 100

//       return {
//         name: vendor,
//         efficiency: efficiency.toFixed(1),
//         totalTransactions: vendorTransactions.length,
//         remainingBalance: remainingBalance,
//         completedTransactions: completedTransactions.length,
//         pendingTransactions: vendorTransactions.filter(
//           (t) => t.type === "send_market" && getVendorRemainingBalance(vendor) > 0
//         ).length,
//       }
//     })
//   }

//   const vendorPerformance = getVendorPerformance()
//   const totalMarketBalance = vendorPerformance.reduce((total, v) => total + v.remainingBalance, 0)

//   return (
//     <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-x-hidden">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
//       >
//         <div className="w-full sm:w-auto">
//           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 break-words">
//             Market Transactions
//           </h1>
//           <p className="text-sm sm:text-base text-slate-600 mt-1">
//             Track gold sent to and received from market
//           </p>
//         </div>
//         <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="flex-1 sm:flex-none"
//           >
//             <Button
//               onClick={() => setShowReceiveDialog(true)}
//               variant="outline"
//               className="gap-2 w-full h-11 sm:h-10"
//               disabled={vendorsWithBalance.length === 0}
//             >
//               <Receipt className="w-4 h-4" />
//               <span className="hidden xs:inline">Receive Gold</span>
//               <span className="xs:hidden">Receive</span>
//               {vendorsWithBalance.length > 0 && (
//                 <Badge
//                   variant="secondary"
//                   className="ml-1 bg-amber-500 text-white text-xs"
//                 >
//                   {vendorsWithBalance.length}
//                 </Badge>
//               )}
//             </Button>
//           </motion.div>
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="flex-1 sm:flex-none"
//           >
//             <Button
//               onClick={() => setShowSendDialog(true)}
//               className="gap-2 w-full h-11 sm:h-10"
//             >
//               <Send className="w-4 h-4" />
//               <span className="hidden xs:inline">Send to Market</span>
//               <span className="xs:hidden">Send</span>
//             </Button>
//           </motion.div>
//         </div>
//       </motion.div>

//       {/* Stats - Mobile Responsive */}
//       <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
//         {[
//           {
//             title: "Sent This Month",
//             value: `${monthlySent.toFixed(1)}g`,
//             icon: TrendingUp,
//             color: "text-blue-600",
//             description: `${marketTransactions.filter(
//               (t) =>
//                 t.type === "send_market" &&
//                 new Date(t.date).getMonth() === now.getMonth()
//             ).length
//               } transactions`,
//           },
//           {
//             title: "Received",
//             value: `${monthlyReceived.toFixed(1)}g`,
//             icon: TrendingDown,
//             color: "text-green-600",
//             description: `${marketTransactions.filter(
//               (t) =>
//                 t.type === "receive_market" &&
//                 new Date(t.date).getMonth() === now.getMonth()
//             ).length
//               } receipts`,
//           },
//           {
//             title: "Market Balance",
//             value: `${totalMarketBalance.toFixed(1)}g`,
//             icon: Building,
//             color: "text-amber-600",
//             description: "Total with all vendors",
//           },
//           {
//             title: "Active Vendors",
//             value: vendors.length.toString(),
//             icon: Building,
//             color: "text-slate-900",
//             description: `${vendorsWithBalance.length} with balance`,
//           },
//         ].map((stat, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             whileHover={{ scale: 1.02 }}
//             className="w-full"
//           >
//             <Card className="w-full h-full shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
//                 <CardTitle className="text-xs sm:text-sm font-medium">
//                   {stat.title}
//                 </CardTitle>
//                 <stat.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color}`} />
//               </CardHeader>
//               <CardContent className="p-3 sm:p-4 pt-0">
//                 <div className={`text-lg sm:text-xl md:text-2xl font-bold ${stat.color}`}>
//                   {stat.value}
//                 </div>
//                 <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Vendors with Balance Alert */}
//       {vendorsWithBalance.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4"
//         >
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//             <div className="flex items-start sm:items-center gap-3">
//               <div className="bg-amber-100 p-2 rounded-full shrink-0">
//                 <Receipt className="w-4 h-4 text-amber-600" />
//               </div>
//               <div>
//                 <h3 className="font-medium text-amber-900 text-sm sm:text-base">
//                   {vendorsWithBalance.length} Vendor{vendorsWithBalance.length > 1 ? "s" : ""} with Balance
//                 </h3>
//                 <p className="text-xs sm:text-sm text-amber-700 mt-1">
//                   Gold balance remaining with vendors
//                 </p>
//               </div>
//             </div>
//             <Button
//               onClick={() => setShowReceiveDialog(true)}
//               variant="outline"
//               size="sm"
//               className="border-amber-300 text-amber-700 hover:bg-amber-100 w-full sm:w-auto"
//             >
//               Receive Now
//             </Button>
//           </div>
//         </motion.div>
//       )}

//       {/* Tabs */}
//       <Tabs
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className="space-y-4 md:space-y-6"
//       >
//         <TabsList className="grid w-full grid-cols-3 h-10 sm:h-9">
//           <TabsTrigger value="transactions" className="text-xs sm:text-sm">
//             Transactions
//           </TabsTrigger>
//           <TabsTrigger value="vendors" className="text-xs sm:text-sm">
//             Vendors
//           </TabsTrigger>
//           <TabsTrigger value="analytics" className="text-xs sm:text-sm">
//             Analytics
//           </TabsTrigger>
//         </TabsList>

//         {/* Transactions Tab */}
//         <TabsContent value="transactions" className="space-y-4">
//           <Card>
//             <CardHeader className="p-4 sm:p-6 pb-3">
//               <CardTitle className="text-lg sm:text-xl">Market Transactions</CardTitle>
//               <CardDescription className="text-sm">
//                 Send and receive gold from market
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="p-4 sm:p-6 pt-0">
//               {marketTransactions.length === 0 ? (
//                 <div className="text-center py-8 sm:py-12">
//                   <Building className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
//                   <h3 className="text-base sm:text-lg font-medium text-gray-900">
//                     No market transactions yet
//                   </h3>
//                   <p className="text-gray-500 mt-1 text-sm">
//                     Start by sending gold to market vendors
//                   </p>
//                   <Button
//                     onClick={() => setShowSendDialog(true)}
//                     className="mt-3 sm:mt-4 gap-2"
//                     size="sm"
//                   >
//                     <Send className="w-4 h-4" />
//                     Send First Transaction
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-3 sm:space-y-4">
//                   {marketTransactions.map((transaction) => {
//                     const vendorBalance = getVendorRemainingBalance(transaction.vendor)
//                     const hasBalance = vendorBalance > 0 && transaction.type === "send_market"

//                     return (
//                       <motion.div
//                         key={transaction.id}
//                         whileHover={{ scale: 1.01 }}
//                         className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-3 sm:gap-4"
//                       >
//                         <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
//                           <Badge
//                             variant={hasBalance ? "secondary" : "default"}
//                             className={
//                               hasBalance
//                                 ? "bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs"
//                                 : "text-xs"
//                             }
//                           >
//                             {transaction.type === "send_market"
//                               ? hasBalance ? "Sent (Pending)" : "Sent (Completed)"
//                               : "Received"
//                             }
//                           </Badge>
//                           <div className="flex-1 min-w-0">
//                             <p className="font-medium text-sm sm:text-base truncate">
//                               {transaction.vendor}
//                             </p>
//                             <p className="text-xs text-slate-500 truncate">
//                               {transaction.weight}g • {transaction.purity} purity
//                               {transaction.pureGoldContent && ` • ${transaction.pureGoldContent.toFixed(2)}g pure`}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
//                           <span className="text-xs sm:text-sm text-slate-500 shrink-0">
//                             {new Date(transaction.date).toLocaleDateString()}
//                           </span>
//                           {hasBalance && (
//                             <Badge
//                               variant="outline"
//                               className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
//                             >
//                               {vendorBalance.toFixed(2)}g
//                             </Badge>
//                           )}
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleViewDetails(transaction)}
//                             className="gap-1 h-8 w-8 sm:w-auto sm:px-3 sm:h-9"
//                           >
//                             <Eye className="w-3 h-3" />
//                             <span className="hidden sm:inline">Details</span>
//                           </Button>
//                         </div>
//                       </motion.div>
//                     )
//                   })}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Vendors Tab */}
//         <TabsContent value="vendors" className="space-y-4">
//           <Card>
//             <CardHeader className="p-4 sm:p-6 pb-3">
//               <CardTitle className="text-lg sm:text-xl">Vendor Performance</CardTitle>
//               <CardDescription className="text-sm">
//                 Track vendor reliability and remaining balances
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="p-4 sm:p-6 pt-0">
//               {vendors.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500 text-sm">
//                     No vendors yet. Send gold to market to add vendors.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3 sm:space-y-4">
//                   {vendorPerformance.map((vendor, index) => {
//                     const vendorTransactions = marketTransactions.filter(
//                       (t) => t.vendor === vendor.name
//                     )

//                     return (
//                       <motion.div
//                         key={index}
//                         whileHover={{ scale: 1.01 }}
//                         className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-3 sm:gap-4"
//                       >
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-sm sm:text-base truncate">
//                             {vendor.name}
//                           </p>
//                           <p className="text-xs text-slate-500">
//                             {vendor.totalTransactions} transactions • {vendor.completedTransactions} completed
//                             {vendor.pendingTransactions > 0 && ` • ${vendor.pendingTransactions} pending`}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
//                           <Badge
//                             variant="outline"
//                             className={
//                               `text-xs ${parseFloat(vendor.efficiency) >= 98
//                                 ? "bg-green-50 text-green-700 border-green-200"
//                                 : parseFloat(vendor.efficiency) >= 95
//                                   ? "bg-amber-50 text-amber-700 border-amber-200"
//                                   : "bg-rose-50 text-rose-700 border-rose-200"
//                               }`
//                             }
//                           >
//                             {vendor.efficiency}%
//                           </Badge>
//                           {vendor.remainingBalance > 0 && (
//                             <span className="text-xs text-amber-600 font-medium whitespace-nowrap">
//                               {vendor.remainingBalance.toFixed(3)}g
//                             </span>
//                           )}
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {
//                               setSelectedTransaction({
//                                 vendor: vendor.name,
//                                 transactions: vendorTransactions,
//                                 performance: vendor,
//                               })
//                               setShowDetailsDialog(true)
//                             }}
//                             className="h-8 px-2 text-xs"
//                           >
//                             View
//                           </Button>
//                         </div>
//                       </motion.div>
//                     )
//                   })}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Analytics Tab */}
//         <TabsContent value="analytics" className="space-y-4">
//           <Card>
//             <CardHeader className="p-4 sm:p-6 pb-3">
//               <CardTitle className="text-lg sm:text-xl">Market Analytics</CardTitle>
//               <CardDescription className="text-sm">
//                 Performance and balance analysis
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="p-4 sm:p-6 pt-0">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//                 {/* Vendor Balances */}
//                 <div className="space-y-3 sm:space-y-4">
//                   <h3 className="font-semibold text-base sm:text-lg">Vendor Balances</h3>
//                   <div className="space-y-2 sm:space-y-3">
//                     {vendorPerformance
//                       .filter((vendor) => vendor.remainingBalance > 0)
//                       .sort((a, b) => b.remainingBalance - a.remainingBalance)
//                       .map((vendor) => (
//                         <div
//                           key={vendor.name}
//                           className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
//                         >
//                           <span className="text-sm font-medium truncate">
//                             {vendor.name}
//                           </span>
//                           <span className="font-mono font-medium text-amber-600 text-sm sm:text-base">
//                             {vendor.remainingBalance.toFixed(2)}g
//                           </span>
//                         </div>
//                       ))}
//                     {vendorPerformance.filter((v) => v.remainingBalance > 0).length === 0 && (
//                       <div className="text-center py-4 text-slate-500 text-sm">
//                         No vendor balances
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Vendor Performance */}
//                 <div className="space-y-3 sm:space-y-4">
//                   <h3 className="font-semibold text-base sm:text-lg">Top Vendors</h3>
//                   <div className="space-y-2 sm:space-y-3">
//                     {vendorPerformance
//                       .sort((a, b) => parseFloat(b.efficiency) - parseFloat(a.efficiency))
//                       .slice(0, 3)
//                       .map((vendor) => (
//                         <div
//                           key={vendor.name}
//                           className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
//                         >
//                           <span className="text-sm font-medium truncate">
//                             {vendor.name}
//                           </span>
//                           <div className="text-right">
//                             <span
//                               className={`text-xs font-medium ${parseFloat(vendor.efficiency) >= 98
//                                 ? "text-green-600"
//                                 : parseFloat(vendor.efficiency) >= 95
//                                   ? "text-amber-600"
//                                   : "text-rose-600"
//                                 }`}
//                             >
//                               {vendor.efficiency}%
//                             </span>
//                             <p className="text-xs text-slate-500">
//                               {vendor.completedTransactions} completed
//                               {vendor.remainingBalance > 0 &&
//                                 ` • ${vendor.remainingBalance.toFixed(2)}g`}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Dialogs */}
//       <SendMarketDialog
//         open={showSendDialog}
//         onOpenChange={setShowSendDialog}
//         onSend={handleSendToMarket}
//       />

//       <ReceiveMarketDialog
//         open={showReceiveDialog}
//         onOpenChange={setShowReceiveDialog}
//         onReceive={handleReceiveFromMarket}
//         pendingTransactions={vendorsWithBalance}
//       />

//       <TransactionDetailsDialog
//         open={showDetailsDialog}
//         onOpenChange={setShowDetailsDialog}
//         transaction={selectedTransaction}
//       />
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Building, Send, Receipt, Eye } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { SendMarketDialog } from "@/components/market/send-market-dialog"
import { ReceiveMarketDialog } from "@/components/market/receive-market-dialog"
import { TransactionDetailsDialog } from "@/components/market/transaction-details-dialog"

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState("transactions")
  const [isClient, setIsClient] = useState(false)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showReceiveDialog, setShowReceiveDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  const {
    marketTransactions,
    addMarketTransaction,
    getVendors,
    getVendorRemainingBalance,
  } = useAppStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  const vendors = getVendors()

  // Calculate monthly sent and received
  const now = new Date()
  const monthlySent = marketTransactions
    .filter(
      (t) =>
        t.type === "send_market" &&
        new Date(t.date).getMonth() === now.getMonth() &&
        new Date(t.date).getFullYear() === now.getFullYear()
    )
    .reduce((total, t) => total + t.weight, 0)

  const monthlyReceived = marketTransactions
    .filter(
      (t) =>
        t.type === "receive_market" &&
        new Date(t.date).getMonth() === now.getMonth() &&
        new Date(t.date).getFullYear() === now.getFullYear()
    )
    .reduce((total, t) => total + t.weight, 0)

  // Get vendors with remaining balance
  const vendorsWithBalance = Array.from(new Set(
    marketTransactions
      .filter(t => t.type === 'send_market' && getVendorRemainingBalance(t.vendor) > 0)
      .map(t => t.vendor)
  )).map(vendor => {
    const vendorTransactions = marketTransactions.filter(t => t.vendor === vendor && t.type === 'send_market')
    return {
      vendor,
      id: vendorTransactions[0]?.id || `vendor-${vendor}`,
      weight: vendorTransactions.reduce((total, t) => total + t.weight, 0),
      purity: vendorTransactions[0]?.purity || '917',
      date: vendorTransactions[0]?.date || new Date().toISOString()
    }
  })

  const handleSendToMarket = (transaction: any) => {
    addMarketTransaction(transaction)
  }

  const handleReceiveFromMarket = (transaction: any) => {
    addMarketTransaction(transaction)
  }

  const handleViewDetails = (transaction: any) => {
    setSelectedTransaction(transaction)
    setShowDetailsDialog(true)
  }

  // Calculate vendor performance with remaining balance
  const getVendorPerformance = () => {
    return vendors.map((vendor) => {
      const vendorTransactions = marketTransactions.filter(
        (t) => t.vendor === vendor
      )
      const completedTransactions = vendorTransactions.filter(
        (t) => t.type === "receive_market"
      )

      // Calculate remaining balance
      const remainingBalance = getVendorRemainingBalance(vendor)

      // Calculate efficiency
      const sentPureGold = vendorTransactions
        .filter((t) => t.type === "send_market")
        .reduce((total, t) => total + (t.weight * t.purity) / 999, 0)

      const receivedPureGold = completedTransactions.reduce(
        (total, t) => total + (t.pureGoldContent || 0),
        0
      )

      const efficiency =
        sentPureGold > 0 ? (receivedPureGold / sentPureGold) * 100 : 100

      return {
        name: vendor,
        efficiency: efficiency.toFixed(1),
        totalTransactions: vendorTransactions.length,
        remainingBalance: remainingBalance,
        completedTransactions: completedTransactions.length,
        pendingTransactions: vendorTransactions.filter(
          (t) => t.type === "send_market" && getVendorRemainingBalance(vendor) > 0
        ).length,
      }
    })
  }

  const vendorPerformance = getVendorPerformance()
  const totalMarketBalance = vendorPerformance.reduce((total, v) => total + v.remainingBalance, 0)

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
      >
        <div className="w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 break-words">
            Market Transactions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Track gold sent to and received from market
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 sm:flex-none"
          >
            <Button
              onClick={() => setShowReceiveDialog(true)}
              variant="outline"
              className="gap-2 w-full h-11 sm:h-10"
              disabled={vendorsWithBalance.length === 0}
            >
              <Receipt className="w-4 h-4" />
              <span className="hidden xs:inline">Receive Gold</span>
              <span className="xs:hidden">Receive</span>
              {vendorsWithBalance.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-amber-500 text-white text-xs"
                >
                  {vendorsWithBalance.length}
                </Badge>
              )}
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 sm:flex-none"
          >
            <Button
              onClick={() => setShowSendDialog(true)}
              className="gap-2 w-full h-11 sm:h-10"
            >
              <Send className="w-4 h-4" />
              <span className="hidden xs:inline">Send to Market</span>
              <span className="xs:hidden">Send</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats - Mobile Responsive */}
      <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[
          {
            title: "Sent This Month",
            value: `${monthlySent.toFixed(1)}g`,
            icon: TrendingUp,
            color: "text-blue-600",
            description: `${
              marketTransactions.filter(
                (t) =>
                  t.type === "send_market" &&
                  new Date(t.date).getMonth() === now.getMonth()
              ).length
            } transactions`,
          },
          {
            title: "Received",
            value: `${monthlyReceived.toFixed(1)}g`,
            icon: TrendingDown,
            color: "text-green-600",
            description: `${
              marketTransactions.filter(
                (t) =>
                  t.type === "receive_market" &&
                  new Date(t.date).getMonth() === now.getMonth()
              ).length
            } receipts`,
          },
          {
            title: "Market Balance",
            value: `${totalMarketBalance.toFixed(1)}g`,
            icon: Building,
            color: "text-amber-600",
            description: "Total with all vendors",
          },
          {
            title: "Active Vendors",
            value: vendors.length.toString(),
            icon: Building,
            color: "text-slate-900",
            description: `${vendorsWithBalance.length} with balance`,
          },
        ].map((stat, index) => (
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
                <CardTitle className="text-xs sm:text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className={`text-lg sm:text-xl md:text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Vendors with Balance Alert */}
      {vendorsWithBalance.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full shrink-0">
                <Receipt className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900 text-sm sm:text-base">
                  {vendorsWithBalance.length} Vendor{vendorsWithBalance.length > 1 ? "s" : ""} with Balance
                </h3>
                <p className="text-xs sm:text-sm text-amber-700 mt-1">
                  Gold balance remaining with vendors
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowReceiveDialog(true)}
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-700 hover:bg-amber-100 w-full sm:w-auto"
            >
              Receive Now
            </Button>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4 md:space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 h-10 sm:h-9">
          <TabsTrigger value="transactions" className="text-xs sm:text-sm">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="vendors" className="text-xs sm:text-sm">
            Vendors
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-3">
              <CardTitle className="text-lg sm:text-xl">Market Transactions</CardTitle>
              <CardDescription className="text-sm">
                Send and receive gold from market
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {marketTransactions.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Building className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">
                    No market transactions yet
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm">
                    Start by sending gold to market vendors
                  </p>
                  <Button
                    onClick={() => setShowSendDialog(true)}
                    className="mt-3 sm:mt-4 gap-2"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                    Send First Transaction
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {marketTransactions.map((transaction) => {
                    const vendorBalance = getVendorRemainingBalance(transaction.vendor)
                    const hasBalance = vendorBalance > 0 && transaction.type === "send_market"
                    
                    return (
                      <motion.div
                        key={transaction.id}
                        whileHover={{ scale: 1.01 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-3 sm:gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                          <Badge
                            variant={hasBalance ? "secondary" : "default"}
                            className={
                              hasBalance
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs"
                                : "text-xs"
                            }
                          >
                            {transaction.type === "send_market"
                              ? hasBalance ? "Sent (Pending)" : "Sent (Completed)"
                              : "Received"
                            }
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base truncate">
                              {transaction.vendor}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {transaction.weight}g • {transaction.purity} purity
                              {transaction.pureGoldContent && ` • ${transaction.pureGoldContent.toFixed(2)}g pure`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                          <span className="text-xs sm:text-sm text-slate-500 shrink-0">
                            {new Date(transaction.date).toLocaleDateString()}
                          </span>
                          {hasBalance && (
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
                            >
                              {vendorBalance.toFixed(2)}g
                            </Badge>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(transaction)}
                            className="gap-1 h-8 w-8 sm:w-auto sm:px-3 sm:h-9"
                          >
                            <Eye className="w-3 h-3" />
                            <span className="hidden sm:inline">Details</span>
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-3">
              <CardTitle className="text-lg sm:text-xl">Vendor Performance</CardTitle>
              <CardDescription className="text-sm">
                Track vendor reliability and remaining balances
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {vendors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    No vendors yet. Send gold to market to add vendors.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {vendorPerformance.map((vendor, index) => {
                    const vendorTransactions = marketTransactions.filter(
                      (t) => t.vendor === vendor.name
                    )

                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-3 sm:gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {vendor.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {vendor.totalTransactions} transactions • {vendor.completedTransactions} completed
                            {vendor.pendingTransactions > 0 && ` • ${vendor.pendingTransactions} pending`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                          <Badge
                            variant="outline"
                            className={
                              `text-xs ${
                                parseFloat(vendor.efficiency) >= 98
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : parseFloat(vendor.efficiency) >= 95
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`
                            }
                          >
                            {vendor.efficiency}%
                          </Badge>
                          {vendor.remainingBalance > 0 && (
                            <span className="text-xs text-amber-600 font-medium whitespace-nowrap">
                              {vendor.remainingBalance.toFixed(3)}g
                            </span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTransaction({
                                vendor: vendor.name,
                                transactions: vendorTransactions,
                                performance: vendor,
                              })
                              setShowDetailsDialog(true)
                            }}
                            className="h-8 px-2 text-xs"
                          >
                            View
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-3">
              <CardTitle className="text-lg sm:text-xl">Market Analytics</CardTitle>
              <CardDescription className="text-sm">
                Performance and balance analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Vendor Balances */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-base sm:text-lg">Vendor Balances</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {vendorPerformance
                      .filter((vendor) => vendor.remainingBalance > 0)
                      .sort((a, b) => b.remainingBalance - a.remainingBalance)
                      .map((vendor) => (
                        <div
                          key={vendor.name}
                          className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                        >
                          <span className="text-sm font-medium truncate">
                            {vendor.name}
                          </span>
                          <span className="font-mono font-medium text-amber-600 text-sm sm:text-base">
                            {vendor.remainingBalance.toFixed(2)}g
                          </span>
                        </div>
                      ))}
                    {vendorPerformance.filter((v) => v.remainingBalance > 0).length === 0 && (
                      <div className="text-center py-4 text-slate-500 text-sm">
                        No vendor balances
                      </div>
                    )}
                  </div>
                </div>

                {/* Vendor Performance */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-base sm:text-lg">Top Vendors</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {vendorPerformance
                      .sort((a, b) => parseFloat(b.efficiency) - parseFloat(a.efficiency))
                      .slice(0, 3)
                      .map((vendor) => (
                        <div
                          key={vendor.name}
                          className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                        >
                          <span className="text-sm font-medium truncate">
                            {vendor.name}
                          </span>
                          <div className="text-right">
                            <span
                              className={`text-xs font-medium ${
                                parseFloat(vendor.efficiency) >= 98
                                  ? "text-green-600"
                                  : parseFloat(vendor.efficiency) >= 95
                                  ? "text-amber-600"
                                  : "text-rose-600"
                              }`}
                            >
                              {vendor.efficiency}%
                            </span>
                            <p className="text-xs text-slate-500">
                              {vendor.completedTransactions} completed
                              {vendor.remainingBalance > 0 &&
                                ` • ${vendor.remainingBalance.toFixed(2)}g`}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <SendMarketDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        onSend={handleSendToMarket}
      />

      <ReceiveMarketDialog
        open={showReceiveDialog}
        onOpenChange={setShowReceiveDialog}
        onReceive={handleReceiveFromMarket}
        pendingTransactions={vendorsWithBalance}
      />

      <TransactionDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        transaction={selectedTransaction}
      />
    </div>
  )
}