// "use client"

// import { useState, useEffect, useRef } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Download, TrendingUp, TrendingDown, Users, Calendar, BarChart3, Package, Building } from "lucide-react"
// import { useAppStore } from "@/lib/store"
// import jsPDF from "jspdf"

// export default function ReportsPage() {
//   const [activeTab, setActiveTab] = useState("overview")
//   const [isClient, setIsClient] = useState(false)
//   const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

//   const { 
//     transactions, 
//     marketTransactions,
//     extraLosses,
//     calculateStock,
//     getTotalExtraLoss,
//     getMonthlyExtraLoss,
//     getMarketLoss,
//     getMonthlyMarketLoss
//   } = useAppStore()

//   useEffect(() => {
//     setIsClient(true)
//   }, [])

//   if (!isClient) {
//     return <div className="p-6 flex items-center justify-center min-h-screen">Loading...</div>
//   }

//   // REAL DATA CALCULATIONS
//   const stock = calculateStock()
//   const totalExtraLoss = getTotalExtraLoss()
//   const monthlyExtraLoss = getMonthlyExtraLoss()
//   const totalMarketLoss = getMarketLoss()
//   const monthlyMarketLoss = getMonthlyMarketLoss()

//   // Calculate worker performance from transactions
//   const getWorkerPerformance = () => {
//     const workerMap = new Map()

//     transactions.forEach(transaction => {
//       if (!workerMap.has(transaction.toFrom)) {
//         workerMap.set(transaction.toFrom, {
//           name: transaction.toFrom,
//           totalIssued: 0,
//           totalReturned: 0,
//           totalLoss: 0,
//           transactions: 0
//         })
//       }

//       const worker = workerMap.get(transaction.toFrom)
//       worker.transactions++

//       if (transaction.type === 'issue') {
//         worker.totalIssued += transaction.weight
//       } else if (transaction.type === 'return') {
//         worker.totalReturned += transaction.weight
//         worker.totalLoss += transaction.loss || 0
//       }
//     })

//     return Array.from(workerMap.values())
//       .filter(worker => worker.totalIssued > 0)
//       .map(worker => {
//         const efficiency = worker.totalIssued > 0 ? 
//           ((worker.totalReturned - worker.totalLoss) / worker.totalIssued) * 100 : 0

//         return {
//           ...worker,
//           efficiency: Math.max(0, efficiency).toFixed(1),
//           goldHandled: worker.totalIssued + worker.totalReturned
//         }
//       })
//       .sort((a, b) => parseFloat(b.efficiency) - parseFloat(a.efficiency))
//       .slice(0, 10)
//   }

//   const workerPerformance = getWorkerPerformance()

//   // Calculate monthly data for charts
//   const getMonthlyData = () => {
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//     const now = new Date()

//     return months.map((month, index) => {
//       const monthTransactions = transactions.filter(t => 
//         new Date(t.date).getMonth() === index && 
//         new Date(t.date).getFullYear() === now.getFullYear()
//       )

//       const monthLoss = monthTransactions.reduce((total, t) => total + (t.loss || 0), 0)
//       const issuedWeight = monthTransactions
//         .filter(t => t.type === 'issue')
//         .reduce((total, t) => total + t.weight, 0)
//       const returnedWeight = monthTransactions
//         .filter(t => t.type === 'return')
//         .reduce((total, t) => total + t.weight, 0)

//       const efficiency = issuedWeight > 0 ? ((returnedWeight - monthLoss) / issuedWeight) * 100 : 100

//       return {
//         month,
//         loss: monthLoss,
//         efficiency: efficiency.toFixed(1),
//         transactions: monthTransactions.length
//       }
//     }).slice(0, 6) // Last 6 months
//   }

//   const monthlyData = getMonthlyData()

//   // Calculate loss breakdown
//   const getLossBreakdown = () => {
//     const workerLoss = transactions
//       .filter(t => t.type === 'return')
//       .reduce((total, t) => total + (t.loss || 0), 0)

//     const marketLoss = getMarketLoss()
//     const extraLoss = getTotalExtraLoss()
//     const totalLoss = workerLoss + marketLoss + extraLoss

//     return [
//       { 
//         category: 'Worker Returns', 
//         loss: workerLoss, 
//         percentage: totalLoss > 0 ? (workerLoss / totalLoss) * 100 : 0 
//       },
//       { 
//         category: 'Market Transactions', 
//         loss: marketLoss, 
//         percentage: totalLoss > 0 ? (marketLoss / totalLoss) * 100 : 0 
//       },
//       { 
//         category: 'Extra Losses', 
//         loss: extraLoss, 
//         percentage: totalLoss > 0 ? (extraLoss / totalLoss) * 100 : 0 
//       },
//     ]
//   }

//   const lossBreakdown = getLossBreakdown()

//   // PDF Export functionality
//   const generatePDF = (type: string) => {
//     setIsGeneratingPDF(true)

//     try {
//       const pdf = new jsPDF()
//       const date = new Date().toLocaleDateString()
//       const pageWidth = pdf.internal.pageSize.getWidth()

//       // Header with styling
//       pdf.setFillColor(15, 23, 42) // slate-900
//       pdf.rect(0, 0, pageWidth, 30, 'F')

//       pdf.setTextColor(255, 255, 255)
//       pdf.setFontSize(20)
//       pdf.setFont('helvetica', 'bold')
//       pdf.text('BARKAT AL KHAIR', pageWidth / 2, 15, { align: 'center' })

//       pdf.setFontSize(12)
//       pdf.setFont('helvetica', 'normal')
//       pdf.text('GOLD WORKSHOP ENTERPRISE', pageWidth / 2, 22, { align: 'center' })

//       // Report title
//       pdf.setTextColor(15, 23, 42)
//       pdf.setFontSize(16)
//       pdf.setFont('helvetica', 'bold')
//       pdf.text('PERFORMANCE REPORT', 20, 45)

//       pdf.setFontSize(10)
//       pdf.setFont('helvetica', 'normal')
//       pdf.setTextColor(100, 116, 139)
//       pdf.text(`Generated: ${date}`, 20, 52)
//       pdf.text(`Report Type: ${type.charAt(0).toUpperCase() + type.slice(1)} Analysis`, 20, 58)

//       let yPosition = 70

//       // Stock Summary Section
//       pdf.setFontSize(14)
//       pdf.setFont('helvetica', 'bold')
//       pdf.setTextColor(15, 23, 42)
//       pdf.text('GOLD STOCK SUMMARY', 20, yPosition)
//       yPosition += 10

//       pdf.setFontSize(10)
//       pdf.setFont('helvetica', 'normal')
//       pdf.setTextColor(71, 85, 105)

//       // Stock table
//       const stockData = [
//         ['Total Physical Stock', `${stock.totalWeight.toFixed(1)}g`],
//         ['Pure Gold Content', `${stock.pureGoldWeight.toFixed(1)}g`],
//         ['24K Gold (995)', `${stock.purityBreakdown['24']?.toFixed(1) || 0}g`],
//         ['22K Gold (917)', `${stock.purityBreakdown['22']?.toFixed(1) || 0}g`],
//         ['21K Gold (875)', `${stock.purityBreakdown['21']?.toFixed(1) || 0}g`],
//         ['18K Gold (750)', `${stock.purityBreakdown['18']?.toFixed(1) || 0}g`]
//       ]

//       stockData.forEach(([label, value], index) => {
//         pdf.text(label, 25, yPosition)
//         pdf.text(value, pageWidth - 25, yPosition, { align: 'right' })
//         yPosition += 6
//       })

//       yPosition += 10

//       // Loss Analysis Section
//       pdf.setFontSize(14)
//       pdf.setFont('helvetica', 'bold')
//       pdf.setTextColor(15, 23, 42)
//       pdf.text('LOSS ANALYSIS', 20, yPosition)
//       yPosition += 10

//       pdf.setFontSize(10)
//       pdf.setFont('helvetica', 'normal')

//       lossBreakdown.forEach((item) => {
//         pdf.setTextColor(71, 85, 105)
//         pdf.text(item.category, 25, yPosition)

//         pdf.setTextColor(225, 29, 72) // rose-600
//         pdf.text(`${item.loss.toFixed(1)}g (${item.percentage.toFixed(1)}%)`, pageWidth - 25, yPosition, { align: 'right' })
//         yPosition += 6
//       })

//       // Total loss
//       yPosition += 3
//       pdf.setDrawColor(226, 232, 240)
//       pdf.line(25, yPosition, pageWidth - 25, yPosition)
//       yPosition += 6

//       pdf.setFont('helvetica', 'bold')
//       pdf.setTextColor(15, 23, 42)
//       pdf.text('TOTAL LOSS', 25, yPosition)
//       const totalLoss = lossBreakdown.reduce((sum, item) => sum + item.loss, 0)
//       pdf.setTextColor(225, 29, 72)
//       pdf.text(`${totalLoss.toFixed(1)}g`, pageWidth - 25, yPosition, { align: 'right' })

//       yPosition += 15

//       // Monthly Loss Trend
//       if (monthlyData.some(month => month.loss > 0)) {
//         pdf.setFontSize(14)
//         pdf.setFont('helvetica', 'bold')
//         pdf.setTextColor(15, 23, 42)
//         pdf.text('MONTHLY LOSS TREND', 20, yPosition)
//         yPosition += 10

//         pdf.setFontSize(8)
//         pdf.setFont('helvetica', 'normal')

//         monthlyData.forEach((month) => {
//           if (yPosition > 250) {
//             pdf.addPage()
//             yPosition = 30
//           }

//           pdf.setTextColor(71, 85, 105)
//           pdf.text(month.month, 25, yPosition)
//           pdf.text(`${month.loss.toFixed(1)}g loss`, 80, yPosition)
//           pdf.text(`${month.efficiency}% efficiency`, pageWidth - 25, yPosition, { align: 'right' })
//           yPosition += 5
//         })

//         yPosition += 10
//       }

//       // Worker Performance Section
//       if (workerPerformance.length > 0) {
//         pdf.setFontSize(14)
//         pdf.setFont('helvetica', 'bold')
//         pdf.setTextColor(15, 23, 42)
//         pdf.text('WORKER PERFORMANCE', 20, yPosition)
//         yPosition += 10

//         pdf.setFontSize(8)
//         pdf.setFont('helvetica', 'normal')

//         workerPerformance.slice(0, 8).forEach((worker, index) => {
//           if (yPosition > 250) {
//             pdf.addPage()
//             yPosition = 30
//           }

//           pdf.setTextColor(71, 85, 105)
//           pdf.text(`${index + 1}. ${worker.name}`, 25, yPosition)

//           // Efficiency with color coding
//           const efficiency = parseFloat(worker.efficiency)
//           if (efficiency >= 98) {
//             pdf.setTextColor(22, 163, 74) // green-600
//           } else if (efficiency >= 95) {
//             pdf.setTextColor(245, 158, 11) // amber-600
//           } else {
//             pdf.setTextColor(225, 29, 72) // rose-600
//           }
//           pdf.text(`${worker.efficiency}%`, pageWidth - 60, yPosition)

//           pdf.setTextColor(225, 29, 72)
//           pdf.text(`${worker.totalLoss.toFixed(1)}g loss`, pageWidth - 25, yPosition, { align: 'right' })

//           yPosition += 5
//         })

//         yPosition += 10
//       }

//       // Transaction Summary
//       pdf.setFontSize(14)
//       pdf.setFont('helvetica', 'bold')
//       pdf.setTextColor(15, 23, 42)
//       pdf.text('TRANSACTION SUMMARY', 20, yPosition)
//       yPosition += 10

//       pdf.setFontSize(10)
//       pdf.setFont('helvetica', 'normal')
//       pdf.setTextColor(71, 85, 105)

//       const summaryData = [
//         ['Total Transactions', transactions.length.toString()],
//         ['Market Transactions', marketTransactions.length.toString()],
//         ['Active Workers', workerPerformance.length.toString()],
//         ['Market Vendors', new Set(marketTransactions.map(t => t.vendor)).size.toString()],
//         ['Extra Loss Entries', extraLosses.length.toString()]
//       ]

//       summaryData.forEach(([label, value]) => {
//         pdf.text(label, 25, yPosition)
//         pdf.text(value, pageWidth - 25, yPosition, { align: 'right' })
//         yPosition += 6
//       })

//       // Footer
//       const footerY = pdf.internal.pageSize.getHeight() - 15
//       pdf.setFontSize(8)
//       pdf.setTextColor(148, 163, 184)
//       pdf.setFont('helvetica', 'italic')
//       pdf.text('Confidential - Barkat Al Khair Gold Workshop Management System', pageWidth / 2, footerY, { align: 'center' })

//       const timestamp = new Date().toISOString().split('T')[0]
//       pdf.save(`gold-workshop-${type}-report-${timestamp}.pdf`)

//     } catch (error) {
//       console.error('Error generating PDF:', error)
//       alert('Error generating PDF. Please try again.')
//     } finally {
//       setIsGeneratingPDF(false)
//     }
//   }

//   return (
//     <div className="p-4 md:p-6 space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
//       >
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Reports & Analytics</h1>
//           <p className="text-slate-600 mt-1">Comprehensive insights into your workshop performance</p>
//         </div>
//         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//           <Button 
//             className="gap-2 w-full sm:w-auto"
//             onClick={() => generatePDF('full')}
//             disabled={isGeneratingPDF}
//           >
//             <Download className="w-4 h-4" />
//             {isGeneratingPDF ? 'Generating PDF...' : 'Export PDF Report'}
//           </Button>
//         </motion.div>
//       </motion.div>

//       {/* Quick Stats - REAL DATA */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.2 }}
//         className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
//       >
//         {[
//           { 
//             title: "Total Stock", 
//             value: `${stock.totalWeight.toFixed(1)}g`, 
//             subtitle: `${stock.pureGoldWeight.toFixed(1)}g pure`,
//             icon: Package, 
//             color: "text-blue-600"
//           },
//           { 
//             title: "Monthly Loss", 
//             value: `${monthlyExtraLoss.toFixed(1)}g`, 
//             subtitle: `${monthlyMarketLoss.toFixed(1)}g market`,
//             icon: TrendingDown, 
//             color: "text-rose-600"
//           },
//           { 
//             title: "Active Workers", 
//             value: workerPerformance.length.toString(), 
//             subtitle: `${transactions.length} transactions`,
//             icon: Users, 
//             color: "text-green-600"
//           },
//           { 
//             title: "Market Vendors", 
//             value: new Set(marketTransactions.map(t => t.vendor)).size.toString(), 
//             subtitle: `${marketTransactions.length} transactions`,
//             icon: Building, 
//             color: "text-amber-600"
//           },
//         ].map((stat, index) => (
//           <motion.div key={index} whileHover={{ scale: 1.02 }}>
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
//                 <stat.icon className={`w-4 h-4 ${stat.color}`} />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-xl md:text-2xl font-bold text-slate-900">{stat.value}</div>
//                 <p className="text-xs text-slate-500">{stat.subtitle}</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Analytics Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//         <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="loss">Loss Analysis</TabsTrigger>
//           <TabsTrigger value="workers">Worker Performance</TabsTrigger>
//           <TabsTrigger value="export">Export</TabsTrigger>
//         </TabsList>

//         {/* Overview Tab */}
//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Monthly Loss Chart */}
//             <motion.div whileHover={{ scale: 1.01 }}>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Monthly Loss Trend</CardTitle>
//                   <CardDescription>Pure gold loss over last 6 months</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {monthlyData.map((month) => (
//                       <div key={month.month} className="flex items-center justify-between">
//                         <span className="font-medium">{month.month}</span>
//                         <div className="flex items-center gap-4">
//                           <Badge variant={month.loss < 8 ? "default" : "destructive"}>
//                             {month.loss.toFixed(1)}g loss
//                           </Badge>
//                           <span className="text-sm text-slate-500">{month.efficiency}% eff.</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* Worker Performance */}
//             <motion.div whileHover={{ scale: 1.01 }}>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Top Performers</CardTitle>
//                   <CardDescription>Worker efficiency ranking</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {workerPerformance.length === 0 ? (
//                     <div className="text-center py-8 text-slate-500">
//                       <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
//                       <p>No worker data yet</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {workerPerformance.map((worker, index) => (
//                         <div key={worker.name} className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <Badge variant="outline">#{index + 1}</Badge>
//                             <span className="font-medium">{worker.name}</span>
//                           </div>
//                           <div className="flex items-center gap-4">
//                             <span className={`text-sm font-bold ${
//                               parseFloat(worker.efficiency) >= 98 ? 'text-emerald-600' : 
//                               parseFloat(worker.efficiency) >= 95 ? 'text-amber-600' : 'text-rose-600'
//                             }`}>
//                               {worker.efficiency}%
//                             </span>
//                             <span className="text-sm text-slate-500">{worker.totalLoss.toFixed(1)}g loss</span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>
//         </TabsContent>

//         {/* Loss Analysis Tab */}
//         <TabsContent value="loss">
//           <Card>
//             <CardHeader>
//               <CardTitle>Detailed Loss Analysis</CardTitle>
//               <CardDescription>Breakdown of material losses</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {lossBreakdown.map((item) => (
//                   <div key={item.category} className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="font-medium">{item.category}</span>
//                       <span>{item.loss.toFixed(1)}g ({item.percentage.toFixed(1)}%)</span>
//                     </div>
//                     <div className="w-full bg-slate-200 rounded-full h-3">
//                       <div 
//                         className="bg-rose-600 h-3 rounded-full transition-all duration-500"
//                         style={{ width: `${item.percentage}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Worker Performance Tab */}
//         <TabsContent value="workers">
//           <Card>
//             <CardHeader>
//               <CardTitle>Worker Performance Details</CardTitle>
//               <CardDescription>Comprehensive worker efficiency and loss analysis</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {workerPerformance.length === 0 ? (
//                 <div className="text-center py-12 text-slate-500">
//                   <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
//                   <p className="text-lg font-medium text-slate-900">No worker data available</p>
//                   <p className="text-slate-600">Worker performance data will appear here when you issue gold to workers.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {workerPerformance.map((worker) => (
//                     <Card key={worker.name} className="p-4">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h3 className="font-semibold text-lg">{worker.name}</h3>
//                           <p className="text-sm text-slate-500">
//                             {worker.transactions} transactions • {worker.goldHandled.toFixed(1)}g handled
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <Badge className={`
//                             ${parseFloat(worker.efficiency) >= 98 ? 'bg-emerald-100 text-emerald-800' : 
//                               parseFloat(worker.efficiency) >= 95 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}
//                           `}>
//                             {worker.efficiency}% Efficiency
//                           </Badge>
//                           <p className="text-sm text-rose-600 mt-1">
//                             Total Loss: {worker.totalLoss.toFixed(2)}g
//                           </p>
//                         </div>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Export Tab */}
//         <TabsContent value="export">
//           <Card>
//             <CardHeader>
//               <CardTitle>Export Reports</CardTitle>
//               <CardDescription>Download comprehensive PDF reports</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {[
//                   { 
//                     title: 'Full Workshop Report', 
//                     type: 'full', 
//                     description: 'Complete data including stock, transactions, losses, and worker performance',
//                     icon: BarChart3
//                   },
//                   { 
//                     title: 'Loss Analysis Report', 
//                     type: 'loss', 
//                     description: 'Detailed breakdown of material losses by category',
//                     icon: TrendingDown
//                   },
//                   { 
//                     title: 'Worker Performance Report', 
//                     type: 'workers', 
//                     description: 'Worker efficiency rankings and performance metrics',
//                     icon: Users
//                   },
//                   { 
//                     title: 'Monthly Summary', 
//                     type: 'monthly', 
//                     description: 'Current month performance and stock summary',
//                     icon: Calendar
//                   },
//                 ].map((report) => (
//                   <motion.div 
//                     key={report.title}
//                     whileHover={{ scale: 1.02 }}
//                     className="flex items-center justify-between p-4 border rounded-lg"
//                   >
//                     <div className="flex items-center gap-4 flex-1">
//                       <report.icon className="w-8 h-8 text-slate-400" />
//                       <div className="flex-1">
//                         <p className="font-medium">{report.title}</p>
//                         <p className="text-sm text-slate-500">{report.description}</p>
//                       </div>
//                     </div>
//                     <Button 
//                       variant="outline" 
//                       size="sm"
//                       onClick={() => generatePDF(report.type)}
//                       disabled={isGeneratingPDF}
//                     >
//                       <Download className="w-4 h-4 mr-2" />
//                       PDF
//                     </Button>
//                   </motion.div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
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
import { Download, TrendingUp, TrendingDown, Users, Calendar, BarChart3, Package, Building, Gem, Flame } from "lucide-react"
import { useAppStore, useMeltingStore } from "@/lib/store"
import jsPDF from "jspdf"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isClient, setIsClient] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const {
    transactions,
    marketTransactions,
    extraLosses,
    orders,
    calculateStock,
    getTotalExtraLoss,
    getMonthlyExtraLoss,
    getMarketLoss,
    getMonthlyMarketLoss,
    getTotalRevenue,
    getActiveOrders,
    getCompletedOrders
  } = useAppStore()

  const { meltingBatches, getTotalMeltingLoss, getTotalMeltingGain } = useMeltingStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="p-6 flex items-center justify-center min-h-screen">Loading...</div>
  }

  // REAL DATA CALCULATIONS
  const stock = calculateStock()
  const totalExtraLoss = getTotalExtraLoss()
  const monthlyExtraLoss = getMonthlyExtraLoss()
  const totalMarketLoss = getMarketLoss()
  const monthlyMarketLoss = getMonthlyMarketLoss()
  const totalRevenue = getTotalRevenue()
  const activeOrders = getActiveOrders()
  const completedOrders = getCompletedOrders()
  const totalMeltingLoss = getTotalMeltingLoss()
  const totalMeltingGain = getTotalMeltingGain()

  // Calculate monthly revenue
  const getMonthlyRevenue = () => {
    const now = new Date()
    return orders
      .filter(order => order.revenue && order.completedAt)
      .filter(order => {
        const completedDate = new Date(order.completedAt!)
        return (
          completedDate.getMonth() === now.getMonth() &&
          completedDate.getFullYear() === now.getFullYear()
        )
      })
      .reduce((total, order) => total + (order.revenue || 0), 0)
  }

  const monthlyRevenue = getMonthlyRevenue()

  // Calculate worker performance
  const getWorkerPerformance = () => {
    const workerMap = new Map()

    transactions.forEach(transaction => {
      if (!workerMap.has(transaction.toFrom)) {
        workerMap.set(transaction.toFrom, {
          name: transaction.toFrom,
          totalIssued: 0,
          totalReturned: 0,
          totalLoss: 0,
          transactions: 0
        })
      }

      const worker = workerMap.get(transaction.toFrom)
      worker.transactions++

      if (transaction.type === 'issue') {
        worker.totalIssued += transaction.weight
      } else if (transaction.type === 'return') {
        worker.totalReturned += transaction.weight
        worker.totalLoss += transaction.loss || 0
      }
    })

    return Array.from(workerMap.values())
      .filter(worker => worker.totalIssued > 0)
      .map(worker => {
        const efficiency = worker.totalIssued > 0 ?
          ((worker.totalReturned - worker.totalLoss) / worker.totalIssued) * 100 : 0

        return {
          ...worker,
          efficiency: Math.max(0, efficiency).toFixed(1),
          goldHandled: worker.totalIssued + worker.totalReturned
        }
      })
      .sort((a, b) => parseFloat(b.efficiency) - parseFloat(a.efficiency))
      .slice(0, 10)
  }

  const workerPerformance = getWorkerPerformance()

  // Calculate monthly data
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()

    return months.map((month, index) => {
      const monthTransactions = transactions.filter(t =>
        new Date(t.date).getMonth() === index &&
        new Date(t.date).getFullYear() === now.getFullYear()
      )

      const monthLoss = monthTransactions.reduce((total, t) => total + (t.loss || 0), 0)
      const issuedWeight = monthTransactions
        .filter(t => t.type === 'issue')
        .reduce((total, t) => total + t.weight, 0)
      const returnedWeight = monthTransactions
        .filter(t => t.type === 'return')
        .reduce((total, t) => total + t.weight, 0)

      const efficiency = issuedWeight > 0 ? ((returnedWeight - monthLoss) / issuedWeight) * 100 : 100

      return {
        month,
        loss: monthLoss,
        efficiency: efficiency.toFixed(1),
        transactions: monthTransactions.length
      }
    }).slice(0, 6)
  }

  const monthlyData = getMonthlyData()

  // Calculate loss breakdown including melting
  const getLossBreakdown = () => {
    const workerLoss = transactions
      .filter(t => t.type === 'return')
      .reduce((total, t) => total + (t.loss || 0), 0)

    const marketLoss = getMarketLoss()
    const extraLoss = getTotalExtraLoss()
    const meltingLoss = getTotalMeltingLoss()
    const totalLoss = workerLoss + marketLoss + extraLoss + meltingLoss

    return [
      {
        category: 'Worker Returns',
        loss: workerLoss,
        percentage: totalLoss > 0 ? (workerLoss / totalLoss) * 100 : 0
      },
      {
        category: 'Market Transactions',
        loss: marketLoss,
        percentage: totalLoss > 0 ? (marketLoss / totalLoss) * 100 : 0
      },
      {
        category: 'Melting Process',
        loss: meltingLoss,
        percentage: totalLoss > 0 ? (meltingLoss / totalLoss) * 100 : 0
      },
      {
        category: 'Extra Losses',
        loss: extraLoss,
        percentage: totalLoss > 0 ? (extraLoss / totalLoss) * 100 : 0
      },
    ]
  }

  const lossBreakdown = getLossBreakdown()

  // Enhanced PDF Export with all sections
  const generatePDF = (type: string) => {
    setIsGeneratingPDF(true)

    try {
      const pdf = new jsPDF()
      const date = new Date().toLocaleDateString()
      const pageWidth = pdf.internal.pageSize.getWidth()
      let yPosition = 30

      // Header with styling
      pdf.setFillColor(15, 23, 42) // slate-900
      pdf.rect(0, 0, pageWidth, 25, 'F')

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.text('BARKAT AL KHAIR GOLD', pageWidth / 2, 12, { align: 'center' })

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text('WORKSHOP MANAGEMENT SYSTEM', pageWidth / 2, 18, { align: 'center' })

      // Report title and date
      pdf.setTextColor(15, 23, 42)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('COMPREHENSIVE WORKSHOP REPORT', 20, yPosition)

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 116, 139)
      pdf.text(`Generated: ${date}`, 20, yPosition + 7)

      yPosition += 20

      // Function to add new page if needed
      const checkNewPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pdf.internal.pageSize.getHeight() - 30) {
          pdf.addPage()
          yPosition = 30
          return true
        }
        return false
      }

      // 1. GOLD STOCK SUMMARY
      checkNewPage(30)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(15, 23, 42)
      pdf.text('1. GOLD STOCK SUMMARY', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(71, 85, 105)

      const stockData = [
        ['Total Physical Stock', `${stock.totalWeight.toFixed(1)}g`],
        ['Pure Gold Content', `${stock.pureGoldWeight.toFixed(1)}g`],
        ['24K Gold (995)', `${stock.purityBreakdown['24']?.toFixed(1) || 0}g`],
        ['22K Gold (917)', `${stock.purityBreakdown['22']?.toFixed(1) || 0}g`],
        ['21K Gold (875)', `${stock.purityBreakdown['21']?.toFixed(1) || 0}g`],
        ['18K Gold (750)', `${stock.purityBreakdown['18']?.toFixed(1) || 0}g`]
      ]

      stockData.forEach(([label, value]) => {
        pdf.text(label, 25, yPosition)
        pdf.text(value, pageWidth - 25, yPosition, { align: 'right' })
        yPosition += 6
      })

      yPosition += 10

      // 2. LOSS ANALYSIS
      checkNewPage(40)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(15, 23, 42)
      pdf.text('2. LOSS ANALYSIS', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')

      lossBreakdown.forEach((item) => {
        pdf.setTextColor(71, 85, 105)
        pdf.text(item.category, 25, yPosition)

        pdf.setTextColor(225, 29, 72)
        pdf.text(`${item.loss.toFixed(1)}g (${item.percentage.toFixed(1)}%)`, pageWidth - 25, yPosition, { align: 'right' })
        yPosition += 6
      })

      // Total loss
      yPosition += 3
      pdf.setDrawColor(226, 232, 240)
      pdf.line(25, yPosition, pageWidth - 25, yPosition)
      yPosition += 6

      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(15, 23, 42)
      pdf.text('TOTAL LOSS', 25, yPosition)
      const totalLoss = lossBreakdown.reduce((sum, item) => sum + item.loss, 0)
      pdf.setTextColor(225, 29, 72)
      pdf.text(`${totalLoss.toFixed(1)}g`, pageWidth - 25, yPosition, { align: 'right' })

      yPosition += 15

      // 3. TRANSACTIONS SUMMARY
      checkNewPage(30)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(15, 23, 42)
      pdf.text('3. TRANSACTIONS SUMMARY', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(71, 85, 105)

      const transactionData = [
        ['Total Transactions', transactions.length.toString()],
        ['Market Transactions', marketTransactions.length.toString()],
        ['Worker Transactions', transactions.filter(t => t.type === 'issue' || t.type === 'return').length.toString()],
        ['Active Workers', workerPerformance.length.toString()],
        ['Market Vendors', new Set(marketTransactions.map(t => t.vendor)).size.toString()],
        ['Extra Loss Entries', extraLosses.length.toString()]
      ]

      transactionData.forEach(([label, value]) => {
        pdf.text(label, 25, yPosition)
        pdf.text(value, pageWidth - 25, yPosition, { align: 'right' })
        yPosition += 6
      })

      yPosition += 10

      // 4. ORDERS SUMMARY
      checkNewPage(30)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(15, 23, 42)
      pdf.text('4. ORDERS MANAGEMENT', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')

      const orderData = [
        ['Total Orders', orders.length.toString()],
        ['Active Orders', activeOrders.length.toString()],
        ['Completed Orders', completedOrders.length.toString()],
        ['Total Revenue', `KWD ${totalRevenue.toFixed(3)}`],
        ['Monthly Revenue', `KWD ${monthlyRevenue.toFixed(3)}`]
      ]

      orderData.forEach(([label, value]) => {
        pdf.text(label, 25, yPosition)
        pdf.text(value, pageWidth - 25, yPosition, { align: 'right' })
        yPosition += 6
      })

      // Recent orders with numbers
      if (orders.length > 0) {
        yPosition += 5
        pdf.setFont('helvetica', 'bold')
        pdf.text('Recent Orders:', 25, yPosition)
        yPosition += 6

        pdf.setFont('helvetica', 'normal')
        orders.slice(0, 5).forEach((order, index) => {
          if (checkNewPage(6)) {
            // If new page was added, re-add the header
            pdf.setFont('helvetica', 'normal')
          }
          const status = order.status.charAt(0).toUpperCase() + order.status.slice(1)
          pdf.text(`${order.id} - ${order.customer} (${status})`, 30, yPosition)
          yPosition += 4
        })
      }

      yPosition += 10

      // 5. MELTING BATCHES
      checkNewPage(40)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(15, 23, 42)
      pdf.text('5. MELTING BATCHES', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')

      const meltingData = [
        ['Total Batches', meltingBatches.length.toString()],
        ['Total Melting Loss', `${totalMeltingLoss.toFixed(1)}g`],
        ['Total Melting Gain', `${totalMeltingGain.toFixed(1)}g`],
        ['Net Weight Change', `${(totalMeltingGain - totalMeltingLoss).toFixed(1)}g`],
        ['Average Efficiency', meltingBatches.length > 0 ?
          `${(meltingBatches.reduce((sum, b) => sum + b.efficiency, 0) / meltingBatches.length).toFixed(1)}%` : '0%']
      ]

      meltingData.forEach(([label, value]) => {
        pdf.text(label, 25, yPosition)
        pdf.text(value, pageWidth - 25, yPosition, { align: 'right' })
        yPosition += 6
      })

      // Recent batches with numbers
      if (meltingBatches.length > 0) {
        yPosition += 5
        pdf.setFont('helvetica', 'bold')
        pdf.text('Recent Batches:', 25, yPosition)
        yPosition += 6

        pdf.setFont('helvetica', 'normal')
        meltingBatches.slice(0, 5).forEach((batch, index) => {
          if (checkNewPage(6)) {
            pdf.setFont('helvetica', 'normal')
          }
          const netChange = batch.weightChange >= 0 ? `+${batch.weightChange}g` : `${batch.weightChange}g`
          pdf.text(`${batch.id} - ${netChange} (${batch.efficiency}% eff.)`, 30, yPosition)
          yPosition += 4
        })
      }

      yPosition += 10

      // 6. WORKER PERFORMANCE
      if (workerPerformance.length > 0) {
        checkNewPage(30)
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(15, 23, 42)
        pdf.text('6. WORKER PERFORMANCE', 20, yPosition)
        yPosition += 10

        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'normal')

        workerPerformance.slice(0, 8).forEach((worker, index) => {
          if (checkNewPage(6)) {
            pdf.setFontSize(8)
            pdf.setFont('helvetica', 'normal')
          }

          pdf.setTextColor(71, 85, 105)
          pdf.text(`${index + 1}. ${worker.name}`, 25, yPosition)

          // Efficiency with color coding
          const efficiency = parseFloat(worker.efficiency)
          if (efficiency >= 98) {
            pdf.setTextColor(22, 163, 74)
          } else if (efficiency >= 95) {
            pdf.setTextColor(245, 158, 11)
          } else {
            pdf.setTextColor(225, 29, 72)
          }
          pdf.text(`${worker.efficiency}%`, pageWidth - 60, yPosition)

          pdf.setTextColor(225, 29, 72)
          pdf.text(`${worker.totalLoss.toFixed(1)}g loss`, pageWidth - 25, yPosition, { align: 'right' })

          yPosition += 5
        })
      }

      // Footer
      const footerY = pdf.internal.pageSize.getHeight() - 15
      pdf.setFontSize(8)
      pdf.setTextColor(148, 163, 184)
      pdf.setFont('helvetica', 'italic')
      pdf.text('Confidential - Barkat Al Khair Gold Workshop Management System', pageWidth / 2, footerY, { align: 'center' })

      // Page number
      const pageCount = pdf.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(148, 163, 184)
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pdf.internal.pageSize.getHeight() - 8, { align: 'center' })
      }

      const timestamp = new Date().toISOString().split('T')[0]
      pdf.save(`gold-workshop-comprehensive-report-${timestamp}.pdf`)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-1">Comprehensive insights into your workshop performance</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="gap-2 w-full sm:w-auto"
            onClick={() => generatePDF('full')}
            disabled={isGeneratingPDF}
          >
            <Download className="w-4 h-4" />
            {isGeneratingPDF ? 'Generating PDF...' : 'Export Full PDF Report'}
          </Button>
        </motion.div>
      </motion.div>

      {/* Quick Stats - REAL DATA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {[
          {
            title: "Total Stock",
            value: `${stock.totalWeight.toFixed(1)}g`,
            subtitle: `${stock.pureGoldWeight.toFixed(1)}g pure`,
            icon: Package,
            color: "text-blue-600"
          },
          {
            title: "Total Revenue",
            value: `KWD ${totalRevenue.toFixed(3)}`,
            subtitle: `KWD ${monthlyRevenue.toFixed(3)} this month`,
            icon: TrendingUp,
            color: "text-green-600"
          },
          {
            title: "Active Orders",
            value: activeOrders.length.toString(),
            subtitle: `${completedOrders.length} completed`,
            icon: Gem,
            color: "text-purple-600"
          },
          {
            title: "Melting Batches",
            value: meltingBatches.length.toString(),
            subtitle: `${totalMeltingLoss.toFixed(1)}g loss`,
            icon: Flame,
            color: "text-orange-600"
          },
        ].map((stat, index) => (
          <motion.div key={index} whileHover={{ scale: 1.02 }}>
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
      </motion.div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="loss">Loss Analysis</TabsTrigger>
          <TabsTrigger value="workers">Worker Performance</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Loss Chart */}
            <motion.div whileHover={{ scale: 1.01 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Loss Trend</CardTitle>
                  <CardDescription>Pure gold loss over last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((month) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center gap-4">
                          <Badge variant={month.loss < 8 ? "default" : "destructive"}>
                            {month.loss.toFixed(1)}g loss
                          </Badge>
                          <span className="text-sm text-slate-500">{month.efficiency}% eff.</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Worker Performance */}
            <motion.div whileHover={{ scale: 1.01 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Worker efficiency ranking</CardDescription>
                </CardHeader>
                <CardContent>
                  {workerPerformance.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                      <p>No worker data yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {workerPerformance.map((worker, index) => (
                        <div key={worker.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <span className="font-medium">{worker.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-sm font-bold ${parseFloat(worker.efficiency) >= 98 ? 'text-emerald-600' :
                                parseFloat(worker.efficiency) >= 95 ? 'text-amber-600' : 'text-rose-600'
                              }`}>
                              {worker.efficiency}%
                            </span>
                            <span className="text-sm text-slate-500">{worker.totalLoss.toFixed(1)}g loss</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Loss Analysis Tab */}
        <TabsContent value="loss">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Loss Analysis</CardTitle>
              <CardDescription>Breakdown of material losses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lossBreakdown.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.category}</span>
                      <span>{item.loss.toFixed(1)}g ({item.percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-rose-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Worker Performance Tab */}
        <TabsContent value="workers">
          <Card>
            <CardHeader>
              <CardTitle>Worker Performance Details</CardTitle>
              <CardDescription>Comprehensive worker efficiency and loss analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {workerPerformance.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium text-slate-900">No worker data available</p>
                  <p className="text-slate-600">Worker performance data will appear here when you issue gold to workers.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workerPerformance.map((worker) => (
                    <Card key={worker.name} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{worker.name}</h3>
                          <p className="text-sm text-slate-500">
                            {worker.transactions} transactions • {worker.goldHandled.toFixed(1)}g handled
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`
                            ${parseFloat(worker.efficiency) >= 98 ? 'bg-emerald-100 text-emerald-800' :
                              parseFloat(worker.efficiency) >= 95 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}
                          `}>
                            {worker.efficiency}% Efficiency
                          </Badge>
                          <p className="text-sm text-rose-600 mt-1">
                            Total Loss: {worker.totalLoss.toFixed(2)}g
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
              <CardDescription>Download comprehensive PDF reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: 'Full Workshop Report',
                    type: 'full',
                    description: 'Complete data including stock, transactions, losses, and worker performance',
                    icon: BarChart3
                  },
                  {
                    title: 'Loss Analysis Report',
                    type: 'loss',
                    description: 'Detailed breakdown of material losses by category',
                    icon: TrendingDown
                  },
                  {
                    title: 'Worker Performance Report',
                    type: 'workers',
                    description: 'Worker efficiency rankings and performance metrics',
                    icon: Users
                  },
                  {
                    title: 'Monthly Summary',
                    type: 'monthly',
                    description: 'Current month performance and stock summary',
                    icon: Calendar
                  },
                ].map((report) => (
                  <motion.div
                    key={report.title}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <report.icon className="w-8 h-8 text-slate-400" />
                      <div className="flex-1">
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-slate-500">{report.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generatePDF(report.type)}
                      disabled={isGeneratingPDF}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}