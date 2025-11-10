// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Plus, TrendingUp, TrendingDown, Building, Download, Send, Receipt, Eye } from "lucide-react"
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
//     getMarketLoss,
//     getMonthlyMarketLoss,
//     getVendors,
//     getVendorRemainingBalance // Add this import
//   } = useAppStore()

//   useEffect(() => {
//     setIsClient(true)
//   }, [])

//   if (!isClient) {
//     return <div className="p-6 flex items-center justify-center min-h-screen">Loading...</div>
//   }

//   // REAL DATA CALCULATIONS
//   const marketLoss = getMarketLoss()
//   const monthlyMarketLoss = getMonthlyMarketLoss()
//   const vendors = getVendors()

//   // Calculate monthly sent and received
//   const now = new Date()
//   const monthlySent = marketTransactions
//     .filter(t => t.type === 'send_market' &&
//                 new Date(t.date).getMonth() === now.getMonth() &&
//                 new Date(t.date).getFullYear() === now.getFullYear())
//     .reduce((total, t) => total + t.weight, 0)

//   const monthlyReceived = marketTransactions
//     .filter(t => t.type === 'receive_market' &&
//                 new Date(t.date).getMonth() === now.getMonth() &&
//                 new Date(t.date).getFullYear() === now.getFullYear())
//     .reduce((total, t) => total + t.weight, 0)

//   // FIXED: Get pending transactions (sent but not received)
//   const pendingTransactions = marketTransactions.filter(t =>
//     t.type === 'send_market' && t.status === 'pending' &&
//     !marketTransactions.some(received =>
//       received.type === 'receive_market' && received.vendor === t.vendor && received.date > t.date
//     )
//   )

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
//     return vendors.map(vendor => {
//       const vendorTransactions = marketTransactions.filter(t => t.vendor === vendor)
//       const completedTransactions = vendorTransactions.filter(t => t.type === 'receive_market')
//       const totalWeight = vendorTransactions.reduce((total, t) => total + t.weight, 0)

//       // Calculate remaining balance instead of total loss
//       const remainingBalance = getVendorRemainingBalance(vendor)

//       // Calculate efficiency (100% - loss percentage)
//       const sentPureGold = vendorTransactions
//         .filter(t => t.type === 'send_market')
//         .reduce((total, t) => total + ((t.weight * t.purity) / 999), 0)

//       const receivedPureGold = completedTransactions.reduce((total, t) => total + (t.pureGoldContent || 0), 0)

//       const efficiency = sentPureGold > 0 ? (receivedPureGold / sentPureGold) * 100 : 100

//       return {
//         name: vendor,
//         efficiency: efficiency.toFixed(1),
//         totalTransactions: vendorTransactions.length,
//         remainingBalance: remainingBalance, // This is the remaining balance
//         completedTransactions: completedTransactions.length,
//         pendingTransactions: vendorTransactions.filter(t =>
//           t.type === 'send_market' && t.status === 'pending' &&
//           !marketTransactions.some(received =>
//             received.type === 'receive_market' && received.vendor === vendor && received.date > t.date
//           )
//         ).length
//       }
//     })
//   }

//   const vendorPerformance = getVendorPerformance()

//   return (
//     <div className="p-4 md:p-6 space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
//       >
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Market Transactions</h1>
//           <p className="text-slate-600 mt-1">Track gold sent to and received from market</p>
//         </div>
//         <div className="flex gap-3 w-full sm:w-auto">
//           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
//             <Button
//               onClick={() => setShowReceiveDialog(true)}
//               variant="outline"
//               className="gap-2 w-full"
//               disabled={pendingTransactions.length === 0}
//             >
//               <Receipt className="w-4 h-4" />
//               Receive Gold
//               {pendingTransactions.length > 0 && (
//                 <Badge variant="secondary" className="ml-1 bg-amber-500 text-white">
//                   {pendingTransactions.length}
//                 </Badge>
//               )}
//             </Button>
//           </motion.div>
//           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
//             <Button onClick={() => setShowSendDialog(true)} className="gap-2 w-full">
//               <Send className="w-4 h-4" />
//               Send to Market
//             </Button>
//           </motion.div>
//         </div>
//       </motion.div>

//       {/* Stats - REAL DATA */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//         {[
//           {
//             title: "Sent This Month",
//             value: `${monthlySent.toFixed(1)}g`,
//             icon: TrendingUp,
//             color: "text-blue-600",
//             description: `${marketTransactions.filter(t => t.type === 'send_market' && new Date(t.date).getMonth() === now.getMonth()).length} transactions`
//           },
//           {
//             title: "Received",
//             value: `${monthlyReceived.toFixed(1)}g`,
//             icon: TrendingDown,
//             color: "text-green-600",
//             description: `${marketTransactions.filter(t => t.type === 'receive_market' && new Date(t.date).getMonth() === now.getMonth()).length} receipts`
//           },
//           {
//             title: "Market Loss",
//             value: `${monthlyMarketLoss.toFixed(1)}g`,
//             icon: TrendingDown,
//             color: "text-rose-600",
//             description: "Pure gold loss this month"
//           },
//           {
//             title: "Active Vendors",
//             value: vendors.length.toString(),
//             icon: Building,
//             color: "text-slate-900",
//             description: `${pendingTransactions.length} pending`
//           },
//         ].map((stat, index) => (
//           <motion.div key={index} whileHover={{ scale: 1.02 }}>
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
//                 <stat.icon className={`w-4 h-4 ${stat.color}`} />
//               </CardHeader>
//               <CardContent>
//                 <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
//                 <p className="text-xs text-slate-500">{stat.description}</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Pending Transactions Alert */}
//       {pendingTransactions.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-amber-50 border border-amber-200 rounded-lg p-4"
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="bg-amber-100 p-2 rounded-full">
//                 <Receipt className="w-4 h-4 text-amber-600" />
//               </div>
//               <div>
//                 <h3 className="font-medium text-amber-900">
//                   {pendingTransactions.length} Pending Transaction{pendingTransactions.length > 1 ? 's' : ''}
//                 </h3>
//                 <p className="text-sm text-amber-700">
//                   Gold sent to market waiting to be received
//                 </p>
//               </div>
//             </div>
//             <Button
//               onClick={() => setShowReceiveDialog(true)}
//               variant="outline"
//               size="sm"
//               className="border-amber-300 text-amber-700 hover:bg-amber-100"
//             >
//               Receive Now
//             </Button>
//           </div>
//         </motion.div>
//       )}

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="transactions">Transactions</TabsTrigger>
//           <TabsTrigger value="vendors">Vendors</TabsTrigger>
//           <TabsTrigger value="analytics">Analytics</TabsTrigger>
//         </TabsList>

//         {/* Transactions Tab - REAL DATA */}
//         <TabsContent value="transactions">
//           <Card>
//             <CardHeader>
//               <CardTitle>Market Transactions</CardTitle>
//               <CardDescription>Send and receive gold from market</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {marketTransactions.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900">No market transactions yet</h3>
//                   <p className="text-gray-500 mt-1">Start by sending gold to market vendors</p>
//                   <Button onClick={() => setShowSendDialog(true)} className="mt-4 gap-2">
//                     <Send className="w-4 h-4" />
//                     Send First Transaction
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {marketTransactions.map((transaction) => {
//                     // FIXED: Check if this sent transaction has been received
//                     const isPending = transaction.type === 'send_market' &&
//                                     transaction.status === 'pending' &&
//                                     !marketTransactions.some(received =>
//                                       received.type === 'receive_market' &&
//                                       received.vendor === transaction.vendor &&
//                                       received.date > transaction.date
//                                     )

//                     return (
//                       <motion.div
//                         key={transaction.id}
//                         whileHover={{ scale: 1.01 }}
//                         className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
//                       >
//                         <div className="flex items-center gap-4">
//                           <Badge
//                             variant={
//                               transaction.type === "send_market"
//                                 ? isPending ? "secondary" : "default"
//                                 : "outline"
//                             }
//                             className={
//                               transaction.type === "send_market" && isPending
//                                 ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
//                                 : ""
//                             }
//                           >
//                             {transaction.type === 'send_market'
//                               ? isPending ? 'Sent (Pending)' : 'Sent (Completed)'
//                               : 'Received'
//                             }
//                           </Badge>
//                           <div>
//                             <p className="font-medium">{transaction.vendor}</p>
//                             <p className="text-sm text-slate-500">
//                               {transaction.weight}g • {transaction.purity} purity
//                               {transaction.pureGoldContent && ` • ${transaction.pureGoldContent.toFixed(2)}g pure`}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <span className="text-sm text-slate-500">
//                             {new Date(transaction.date).toLocaleDateString()}
//                           </span>
//                           {transaction.remainingBalance && transaction.remainingBalance > 0 && (
//                             <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
//                               Balance: {transaction.remainingBalance.toFixed(2)}g
//                             </Badge>
//                           )}
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleViewDetails(transaction)}
//                             className="gap-1"
//                           >
//                             <Eye className="w-3 h-3" />
//                             Details
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

//         {/* Vendors Tab - REAL DATA */}
//         <TabsContent value="vendors">
//           <Card>
//             <CardHeader>
//               <CardTitle>Vendor Performance</CardTitle>
//               <CardDescription>Track vendor reliability and remaining balances</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {vendors.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">No vendors yet. Send gold to market to add vendors.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {vendorPerformance.map((vendor, index) => {
//                     const vendorTransactions = marketTransactions.filter(t => t.vendor === vendor.name)
//                     const pendingCount = vendor.pendingTransactions

//                     return (
//                       <motion.div
//                         key={index}
//                         whileHover={{ scale: 1.01 }}
//                         className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
//                       >
//                         <div>
//                           <p className="font-medium">{vendor.name}</p>
//                           <p className="text-sm text-slate-500">
//                             {vendor.totalTransactions} transactions • {vendor.completedTransactions} completed
//                             {pendingCount > 0 && ` • ${pendingCount} pending`}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <Badge
//                             variant="outline"
//                             className={
//                               parseFloat(vendor.efficiency) >= 98
//                                 ? "bg-green-50 text-green-700 border-green-200"
//                                 : parseFloat(vendor.efficiency) >= 95
//                                 ? "bg-amber-50 text-amber-700 border-amber-200"
//                                 : "bg-rose-50 text-rose-700 border-rose-200"
//                             }
//                           >
//                             {vendor.efficiency}% efficiency
//                           </Badge>
//                           {vendor.remainingBalance > 0 && (
//                             <span className="text-sm text-amber-600 font-medium">
//                               {vendor.remainingBalance.toFixed(3)}g balance
//                             </span>
//                           )}
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {
//                               setSelectedTransaction({
//                                 vendor: vendor.name,
//                                 transactions: vendorTransactions,
//                                 performance: vendor
//                               })
//                               setShowDetailsDialog(true)
//                             }}
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
//         <TabsContent value="analytics">
//           <Card>
//             <CardHeader>
//               <CardTitle>Market Analytics</CardTitle>
//               <CardDescription>Performance and balance analysis</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Balance Summary */}
//                 <div className="space-y-4">
//                   <h3 className="font-semibold">Balance Summary</h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
//                       <span className="text-sm text-slate-600">Total Market Loss</span>
//                       <span className="font-mono font-medium text-rose-600">
//                         {marketLoss.toFixed(2)}g
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
//                       <span className="text-sm text-slate-600">Monthly Loss</span>
//                       <span className="font-mono font-medium text-rose-600">
//                         {monthlyMarketLoss.toFixed(2)}g
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
//                       <span className="text-sm text-slate-600">Total Vendor Balances</span>
//                       <span className="font-mono font-medium text-amber-600">
//                         {vendorPerformance.reduce((total, v) => total + v.remainingBalance, 0).toFixed(2)}g
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Vendor Performance */}
//                 <div className="space-y-4">
//                   <h3 className="font-semibold">Top Vendors</h3>
//                   <div className="space-y-3">
//                     {vendorPerformance
//                       .sort((a, b) => parseFloat(b.efficiency) - parseFloat(a.efficiency))
//                       .slice(0, 3)
//                       .map((vendor) => (
//                         <div key={vendor.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
//                           <span className="text-sm font-medium">{vendor.name}</span>
//                           <div className="text-right">
//                             <span className={`text-xs font-medium ${
//                               parseFloat(vendor.efficiency) >= 98 ? 'text-green-600' :
//                               parseFloat(vendor.efficiency) >= 95 ? 'text-amber-600' : 'text-rose-600'
//                             }`}>
//                               {vendor.efficiency}%
//                             </span>
//                             <p className="text-xs text-slate-500">
//                               {vendor.completedTransactions} completed
//                               {vendor.remainingBalance > 0 && ` • ${vendor.remainingBalance.toFixed(2)}g balance`}
//                             </p>
//                           </div>
//                         </div>
//                       ))
//                     }
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
//         pendingTransactions={pendingTransactions}
//       />

//       <TransactionDetailsDialog
//         open={showDetailsDialog}
//         onOpenChange={setShowDetailsDialog}
//         transaction={selectedTransaction}
//       />
//     </div>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Building,
  Download,
  Send,
  Receipt,
  Eye,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { SendMarketDialog } from "@/components/market/send-market-dialog";
import { ReceiveMarketDialog } from "@/components/market/receive-market-dialog";
import { TransactionDetailsDialog } from "@/components/market/transaction-details-dialog";

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [isClient, setIsClient] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const {
    marketTransactions,
    addMarketTransaction,
    getMarketLoss,
    getMonthlyMarketLoss,
    getVendors,
    getVendorRemainingBalance,
  } = useAppStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // REAL DATA CALCULATIONS
  const marketLoss = getMarketLoss();
  const monthlyMarketLoss = getMonthlyMarketLoss();
  const vendors = getVendors();

  // Calculate monthly sent and received
  const now = new Date();
  const monthlySent = marketTransactions
    .filter(
      (t) =>
        t.type === "send_market" &&
        new Date(t.date).getMonth() === now.getMonth() &&
        new Date(t.date).getFullYear() === now.getFullYear()
    )
    .reduce((total, t) => total + t.weight, 0);

  const monthlyReceived = marketTransactions
    .filter(
      (t) =>
        t.type === "receive_market" &&
        new Date(t.date).getMonth() === now.getMonth() &&
        new Date(t.date).getFullYear() === now.getFullYear()
    )
    .reduce((total, t) => total + t.weight, 0);

  // FIXED: Get pending transactions (sent but not received)
  const pendingTransactions = marketTransactions.filter(
    (t) =>
      t.type === "send_market" &&
      t.status === "pending" &&
      !marketTransactions.some(
        (received) =>
          received.type === "receive_market" &&
          received.vendor === t.vendor &&
          received.date > t.date
      )
  );

  // Filter vendors with remaining balance > 0
  const vendorsWithBalance = pendingTransactions.filter((transaction) => {
    const balance = getVendorRemainingBalance(transaction.vendor);
    return balance > 0;
  });

  const handleSendToMarket = (transaction: any) => {
    addMarketTransaction(transaction);
  };

  const handleReceiveFromMarket = (transaction: any) => {
    addMarketTransaction(transaction);
  };

  const handleViewDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowDetailsDialog(true);
  };

  // Calculate vendor performance with remaining balance
  const getVendorPerformance = () => {
    return vendors.map((vendor) => {
      const vendorTransactions = marketTransactions.filter(
        (t) => t.vendor === vendor
      );
      const completedTransactions = vendorTransactions.filter(
        (t) => t.type === "receive_market"
      );
      const totalWeight = vendorTransactions.reduce(
        (total, t) => total + t.weight,
        0
      );

      // Calculate remaining balance instead of total loss
      const remainingBalance = getVendorRemainingBalance(vendor);

      // Calculate efficiency (100% - loss percentage)
      const sentPureGold = vendorTransactions
        .filter((t) => t.type === "send_market")
        .reduce((total, t) => total + (t.weight * t.purity) / 999, 0);

      const receivedPureGold = completedTransactions.reduce(
        (total, t) => total + (t.pureGoldContent || 0),
        0
      );

      const efficiency =
        sentPureGold > 0 ? (receivedPureGold / sentPureGold) * 100 : 100;

      return {
        name: vendor,
        efficiency: efficiency.toFixed(1),
        totalTransactions: vendorTransactions.length,
        remainingBalance: remainingBalance,
        completedTransactions: completedTransactions.length,
        pendingTransactions: vendorTransactions.filter(
          (t) =>
            t.type === "send_market" &&
            t.status === "pending" &&
            !marketTransactions.some(
              (received) =>
                received.type === "receive_market" &&
                received.vendor === vendor &&
                received.date > t.date
            )
        ).length,
      };
    });
  };

  const vendorPerformance = getVendorPerformance();

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Market Transactions
          </h1>
          <p className="text-slate-600 mt-1">
            Track gold sent to and received from market
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 sm:flex-none"
          >
            <Button
              onClick={() => setShowReceiveDialog(true)}
              variant="outline"
              className="gap-2 w-full"
              disabled={vendorsWithBalance.length === 0}
            >
              <Receipt className="w-4 h-4" />
              Receive Gold
              {vendorsWithBalance.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-amber-500 text-white"
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
              className="gap-2 w-full"
            >
              <Send className="w-4 h-4" />
              Send to Market
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
            title: "Remaining Market Balance",
            value: `${vendorPerformance
              .reduce((total, v) => total + v.remainingBalance, 0)
              .toFixed(1)}g`,
            icon: Building,
            color: "text-amber-600",
            description: "Total balance with all vendors",
          },
          {
            title: "Active Vendors",
            value: vendors.length.toString(),
            icon: Building,
            color: "text-slate-900",
            description: `${vendorsWithBalance.length} with balance`,
          },
        ].map((stat, index) => (
          <motion.div key={index} whileHover={{ scale: 1.02 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-slate-500">{stat.description}</p>
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
          className="bg-amber-50 border border-amber-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <Receipt className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900">
                  {vendorsWithBalance.length} Vendor
                  {vendorsWithBalance.length > 1 ? "s" : ""} with Pending
                  Balance
                </h3>
                <p className="text-sm text-amber-700">
                  Gold balance remaining with vendors waiting to be received
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowReceiveDialog(true)}
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
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
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Transactions Tab - REAL DATA */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Market Transactions</CardTitle>
              <CardDescription>
                Send and receive gold from market
              </CardDescription>
            </CardHeader>
            <CardContent>
              {marketTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No market transactions yet
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Start by sending gold to market vendors
                  </p>
                  <Button
                    onClick={() => setShowSendDialog(true)}
                    className="mt-4 gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send First Transaction
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {marketTransactions.map((transaction) => {
                    // FIXED: Check if this sent transaction has been received
                    const isPending =
                      transaction.type === "send_market" &&
                      transaction.status === "pending" &&
                      !marketTransactions.some(
                        (received) =>
                          received.type === "receive_market" &&
                          received.vendor === transaction.vendor &&
                          received.date > transaction.date
                      );

                    return (
                      <motion.div
                        key={transaction.id}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={
                              transaction.type === "send_market"
                                ? isPending
                                  ? "secondary"
                                  : "default"
                                : "outline"
                            }
                            className={
                              transaction.type === "send_market" && isPending
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                : ""
                            }
                          >
                            {transaction.type === "send_market"
                              ? isPending
                                ? "Sent (Pending)"
                                : "Sent (Completed)"
                              : "Received"}
                          </Badge>
                          <div>
                            <p className="font-medium">{transaction.vendor}</p>
                            <p className="text-sm text-slate-500">
                              {transaction.weight}g • {transaction.purity}{" "}
                              purity
                              {transaction.pureGoldContent &&
                                ` • ${transaction.pureGoldContent.toFixed(
                                  2
                                )}g pure`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </span>
                          {transaction.remainingBalance &&
                            transaction.remainingBalance > 0 && (
                              <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 border-amber-200"
                              >
                                Balance:{" "}
                                {transaction.remainingBalance.toFixed(2)}g
                              </Badge>
                            )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(transaction)}
                            className="gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Details
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab - REAL DATA */}
        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance</CardTitle>
              <CardDescription>
                Track vendor reliability and remaining balances
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vendors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No vendors yet. Send gold to market to add vendors.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vendorPerformance.map((vendor, index) => {
                    const vendorTransactions = marketTransactions.filter(
                      (t) => t.vendor === vendor.name
                    );
                    const pendingCount = vendor.pendingTransactions;

                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <p className="text-sm text-slate-500">
                            {vendor.totalTransactions} transactions •{" "}
                            {vendor.completedTransactions} completed
                            {pendingCount > 0 && ` • ${pendingCount} pending`}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant="outline"
                            className={
                              parseFloat(vendor.efficiency) >= 98
                                ? "bg-green-50 text-green-700 border-green-200"
                                : parseFloat(vendor.efficiency) >= 95
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }
                          >
                            {vendor.efficiency}% efficiency
                          </Badge>
                          {vendor.remainingBalance > 0 && (
                            <span className="text-sm text-amber-600 font-medium">
                              {vendor.remainingBalance.toFixed(3)}g balance
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
                              });
                              setShowDetailsDialog(true);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Market Analytics</CardTitle>
              <CardDescription>
                Performance and balance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Balance Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Vendor Balances</h3>
                  <div className="space-y-3">
                    {vendorPerformance
                      .filter((vendor) => vendor.remainingBalance > 0)
                      .sort((a, b) => b.remainingBalance - a.remainingBalance)
                      .map((vendor) => (
                        <div
                          key={vendor.name}
                          className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                        >
                          <span className="text-sm font-medium">
                            {vendor.name}
                          </span>
                          <span className="font-mono font-medium text-amber-600">
                            {vendor.remainingBalance.toFixed(2)}g
                          </span>
                        </div>
                      ))}
                    {vendorPerformance.filter((v) => v.remainingBalance > 0)
                      .length === 0 && (
                      <div className="text-center py-4 text-slate-500 text-sm">
                        No vendor balances
                      </div>
                    )}
                  </div>
                </div>

                {/* Vendor Performance */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Top Vendors</h3>
                  <div className="space-y-3">
                    {vendorPerformance
                      .sort(
                        (a, b) =>
                          parseFloat(b.efficiency) - parseFloat(a.efficiency)
                      )
                      .slice(0, 3)
                      .map((vendor) => (
                        <div
                          key={vendor.name}
                          className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                        >
                          <span className="text-sm font-medium">
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
                                ` • ${vendor.remainingBalance.toFixed(
                                  2
                                )}g balance`}
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
        pendingTransactions={vendorsWithBalance} // Pass filtered vendors
      />

      <TransactionDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        transaction={selectedTransaction}
      />
    </div>
  );
}
