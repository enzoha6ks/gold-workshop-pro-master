// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Plus, Flame, TrendingDown, Calculator, History } from "lucide-react"

// export default function MeltingPage() {
//   const [activeTab, setActiveTab] = useState("batches")

//   return (
//     <div className="p-4 md:p-6 space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
//       >
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Melting Process</h1>
//           <p className="text-slate-600 mt-1">Track gold melting batches and purity conversions</p>
//         </div>
//         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//           <Button className="gap-2 w-full sm:w-auto">
//             <Plus className="w-4 h-4" />
//             New Melting Batch
//           </Button>
//         </motion.div>
//       </motion.div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//         {[
//           { title: "Total Batches", value: "24", icon: Flame, color: "text-orange-600" },
//           { title: "Melting Loss", value: "8.5g", icon: TrendingDown, color: "text-rose-600" },
//           { title: "Avg Efficiency", value: "99.2%", icon: Calculator, color: "text-emerald-600" },
//           { title: "This Month", value: "3", icon: History, color: "text-blue-600" },
//         ].map((stat, index) => (
//           <motion.div key={index} whileHover={{ scale: 1.02 }}>
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
//                 <stat.icon className={`w-4 h-4 ${stat.color}`} />
//               </CardHeader>
//               <CardContent>
//                 <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
//                 <p className="text-xs text-slate-500">Pure gold terms</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="batches">Batches</TabsTrigger>
//           <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
//           <TabsTrigger value="calculator">Calculator</TabsTrigger>
//         </TabsList>

//         {/* Batches Tab */}
//         <TabsContent value="batches">
//           <Card>
//             <CardHeader>
//               <CardTitle>Melting Batches</CardTitle>
//               <CardDescription>Recent gold melting operations</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {[
//                   { 
//                     id: "MEL-001", 
//                     input: "500g 917", 
//                     output: "495g 995", 
//                     loss: "5g", 
//                     efficiency: "99.0%",
//                     date: "2024-01-15",
//                     status: "completed"
//                   },
//                   { 
//                     id: "MEL-002", 
//                     input: "300g 875", 
//                     output: "298g 995", 
//                     loss: "2g", 
//                     efficiency: "99.3%",
//                     date: "2024-01-18", 
//                     status: "completed"
//                   },
//                   { 
//                     id: "MEL-003", 
//                     input: "200g 750", 
//                     output: "195g 995", 
//                     loss: "5g", 
//                     efficiency: "97.5%",
//                     date: "2024-01-20",
//                     status: "completed"
//                   },
//                 ].map((batch, index) => (
//                   <motion.div key={index} whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-4 border rounded-lg">
//                     <div className="flex items-center gap-4">
//                       <Badge variant="outline" className="bg-orange-50 text-orange-700">
//                         {batch.id}
//                       </Badge>
//                       <div>
//                         <p className="font-medium">Input: {batch.input} → Output: {batch.output}</p>
//                         <p className="text-sm text-slate-500">{batch.date}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <Badge variant={batch.efficiency >= "99%" ? "default" : "destructive"}>
//                         {batch.efficiency} eff.
//                       </Badge>
//                       <span className="text-sm text-rose-600">Loss: {batch.loss}</span>
//                       <Button variant="outline" size="sm">Details</Button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Efficiency Tab */}
//         <TabsContent value="efficiency">
//           <Card>
//             <CardHeader>
//               <CardTitle>Melting Efficiency</CardTitle>
//               <CardDescription>Performance metrics and trends</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {[
//                   { purity: "995 to 995", avgEfficiency: "99.8%", totalBatches: 12, totalLoss: "2.5g" },
//                   { purity: "917 to 995", avgEfficiency: "99.2%", totalBatches: 8, totalLoss: "4.8g" },
//                   { purity: "875 to 995", avgEfficiency: "98.7%", totalBatches: 3, totalLoss: "1.2g" },
//                   { purity: "750 to 995", avgEfficiency: "97.5%", totalBatches: 1, totalLoss: "5.0g" },
//                 ].map((item, index) => (
//                   <motion.div key={index} whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-4 border rounded-lg">
//                     <div>
//                       <p className="font-medium">{item.purity}</p>
//                       <p className="text-sm text-slate-500">{item.totalBatches} batches</p>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <Badge variant="outline" className="bg-green-50 text-green-700">
//                         {item.avgEfficiency}
//                       </Badge>
//                       <span className="text-sm text-rose-600">{item.totalLoss} loss</span>
//                     </div>
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

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Flame, TrendingDown, Calculator, History, Eye } from "lucide-react"

// Types
interface MeltingBatch {
  id: string
  inputWeight: number
  inputPurity: number
  outputWeight: number
  outputPurity: number
  loss: number
  efficiency: number
  date: string
  status: 'completed' | 'in-progress' | 'planned'
  notes?: string
}

interface EfficiencyStats {
  purity: string
  avgEfficiency: number
  totalBatches: number
  totalLoss: number
}

export default function MeltingPage() {
  const [activeTab, setActiveTab] = useState("batches")
  const [batches, setBatches] = useState<MeltingBatch[]>([
    { 
      id: "MEL-001", 
      inputWeight: 500,
      inputPurity: 917,
      outputWeight: 495,
      outputPurity: 995,
      loss: 5,
      efficiency: 99.0,
      date: "2024-01-15",
      status: "completed"
    },
    { 
      id: "MEL-002", 
      inputWeight: 300,
      inputPurity: 875,
      outputWeight: 298,
      outputPurity: 995,
      loss: 2,
      efficiency: 99.3,
      date: "2024-01-18", 
      status: "completed"
    },
    { 
      id: "MEL-003", 
      inputWeight: 200,
      inputPurity: 750,
      outputWeight: 195,
      outputPurity: 995,
      loss: 5,
      efficiency: 97.5,
      date: "2024-01-20",
      status: "completed"
    },
  ])

  // Calculate statistics
  const totalBatches = batches.length
  const totalLoss = batches.reduce((sum, batch) => sum + batch.loss, 0)
  const avgEfficiency = batches.length > 0 
    ? batches.reduce((sum, batch) => sum + batch.efficiency, 0) / batches.length 
    : 0
  const thisMonthBatches = batches.filter(batch => {
    const batchDate = new Date(batch.date)
    const now = new Date()
    return batchDate.getMonth() === now.getMonth() && batchDate.getFullYear() === now.getFullYear()
  }).length

  // Calculate efficiency statistics by purity conversion
  const efficiencyStats: EfficiencyStats[] = [
    {
      purity: "995 to 995",
      avgEfficiency: 99.8,
      totalBatches: batches.filter(b => b.inputPurity === 995 && b.outputPurity === 995).length,
      totalLoss: batches.filter(b => b.inputPurity === 995 && b.outputPurity === 995)
        .reduce((sum, b) => sum + b.loss, 0)
    },
    {
      purity: "917 to 995",
      avgEfficiency: 99.2,
      totalBatches: batches.filter(b => b.inputPurity === 917 && b.outputPurity === 995).length,
      totalLoss: batches.filter(b => b.inputPurity === 917 && b.outputPurity === 995)
        .reduce((sum, b) => sum + b.loss, 0)
    },
    {
      purity: "875 to 995",
      avgEfficiency: 98.7,
      totalBatches: batches.filter(b => b.inputPurity === 875 && b.outputPurity === 995).length,
      totalLoss: batches.filter(b => b.inputPurity === 875 && b.outputPurity === 995)
        .reduce((sum, b) => sum + b.loss, 0)
    },
    {
      purity: "750 to 995",
      avgEfficiency: 97.5,
      totalBatches: batches.filter(b => b.inputPurity === 750 && b.outputPurity === 995).length,
      totalLoss: batches.filter(b => b.inputPurity === 750 && b.outputPurity === 995)
        .reduce((sum, b) => sum + b.loss, 0)
    },
  ]

  const handleNewBatch = () => {
    const newBatch: MeltingBatch = {
      id: `MEL-${String(batches.length + 1).padStart(3, '0')}`,
      inputWeight: 0,
      inputPurity: 917,
      outputWeight: 0,
      outputPurity: 995,
      loss: 0,
      efficiency: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'planned'
    }
    setBatches([newBatch, ...batches])
  }

  const handleViewDetails = (batchId: string) => {
    // In a real app, this would open a detail view or dialog
    console.log("Viewing details for batch:", batchId)
    // You can implement a dialog or navigate to detail page
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 99) return "bg-green-50 text-green-700 border-green-200"
    if (efficiency >= 98) return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-rose-50 text-rose-700 border-rose-200"
  }

  const getStatusBadge = (status: MeltingBatch['status']) => {
    const variants = {
      completed: { bg: "bg-green-100 text-green-800", label: "Completed" },
      'in-progress': { bg: "bg-blue-100 text-blue-800", label: "In Progress" },
      planned: { bg: "bg-gray-100 text-gray-800", label: "Planned" }
    }
    return variants[status]
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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Melting Process</h1>
          <p className="text-slate-600 mt-1">Track gold melting batches and purity conversions</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="gap-2 w-full sm:w-auto" onClick={handleNewBatch}>
            <Plus className="w-4 h-4" />
            New Melting Batch
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { 
            title: "Total Batches", 
            value: totalBatches.toString(), 
            icon: Flame, 
            color: "text-orange-600",
            description: "All time batches"
          },
          { 
            title: "Melting Loss", 
            value: `${totalLoss.toFixed(1)}g`, 
            icon: TrendingDown, 
            color: "text-rose-600",
            description: "Total gold loss"
          },
          { 
            title: "Avg Efficiency", 
            value: `${avgEfficiency.toFixed(1)}%`, 
            icon: Calculator, 
            color: "text-emerald-600",
            description: "Overall average"
          },
          { 
            title: "This Month", 
            value: thisMonthBatches.toString(), 
            icon: History, 
            color: "text-blue-600",
            description: "Current month"
          },
        ].map((stat, index) => (
          <motion.div key={index} whileHover={{ scale: 1.02 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        {/* Batches Tab */}
        <TabsContent value="batches">
          <Card>
            <CardHeader>
              <CardTitle>Melting Batches</CardTitle>
              <CardDescription>
                Recent gold melting operations • {batches.length} total batches
              </CardDescription>
            </CardHeader>
            <CardContent>
              {batches.length === 0 ? (
                <div className="text-center py-12">
                  <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No melting batches yet</h3>
                  <p className="text-gray-500 mt-1">Start by creating your first melting batch</p>
                  <Button onClick={handleNewBatch} className="mt-4 gap-2">
                    <Plus className="w-4 h-4" />
                    Create First Batch
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {batches.map((batch, index) => {
                    const statusBadge = getStatusBadge(batch.status)
                    return (
                      <motion.div 
                        key={batch.id} 
                        whileHover={{ scale: 1.01 }} 
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-4 flex-1">
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">
                            {batch.id}
                          </Badge>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              <p className="font-medium">
                                Input: {batch.inputWeight}g {batch.inputPurity} → Output: {batch.outputWeight}g {batch.outputPurity}
                              </p>
                              <Badge className={`${statusBadge.bg} text-xs`}>
                                {statusBadge.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{batch.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                          <Badge variant="outline" className={getEfficiencyColor(batch.efficiency)}>
                            {batch.efficiency.toFixed(1)}% eff.
                          </Badge>
                          <span className="text-sm text-rose-600 whitespace-nowrap">Loss: {batch.loss}g</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(batch.id)}
                            className="gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Details
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

        {/* Efficiency Tab */}
        <TabsContent value="efficiency">
          <Card>
            <CardHeader>
              <CardTitle>Melting Efficiency</CardTitle>
              <CardDescription>Performance metrics and trends by purity conversion</CardDescription>
            </CardHeader>
            <CardContent>
              {efficiencyStats.filter(stat => stat.totalBatches > 0).length === 0 ? (
                <div className="text-center py-12">
                  <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No efficiency data</h3>
                  <p className="text-gray-500 mt-1">Complete some melting batches to see efficiency metrics</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {efficiencyStats
                    .filter(stat => stat.totalBatches > 0)
                    .map((item, index) => (
                      <motion.div 
                        key={index} 
                        whileHover={{ scale: 1.01 }} 
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.purity}</p>
                          <p className="text-sm text-slate-500">{item.totalBatches} batch{item.totalBatches !== 1 ? 'es' : ''}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className={getEfficiencyColor(item.avgEfficiency)}>
                            {item.avgEfficiency.toFixed(1)}% avg
                          </Badge>
                          <span className="text-sm text-rose-600 whitespace-nowrap">{item.totalLoss.toFixed(1)}g loss</span>
                        </div>
                      </motion.div>
                    ))
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculator Tab */}
        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Melting Calculator</CardTitle>
              <CardDescription>Calculate expected output and efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                <p className="text-sm text-slate-600">
                  Melting calculator functionality will be implemented here.
                </p>
                <p className="text-xs text-slate-500">
                  Features: Input purity conversion, expected output calculation, efficiency estimation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}