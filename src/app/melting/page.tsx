"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Flame, TrendingDown, Calculator, History } from "lucide-react"

export default function MeltingPage() {
  const [activeTab, setActiveTab] = useState("batches")

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
          <Button className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            New Melting Batch
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: "Total Batches", value: "24", icon: Flame, color: "text-orange-600" },
          { title: "Melting Loss", value: "8.5g", icon: TrendingDown, color: "text-rose-600" },
          { title: "Avg Efficiency", value: "99.2%", icon: Calculator, color: "text-emerald-600" },
          { title: "This Month", value: "3", icon: History, color: "text-blue-600" },
        ].map((stat, index) => (
          <motion.div key={index} whileHover={{ scale: 1.02 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-slate-500">Pure gold terms</p>
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
              <CardDescription>Recent gold melting operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    id: "MEL-001", 
                    input: "500g 917", 
                    output: "495g 995", 
                    loss: "5g", 
                    efficiency: "99.0%",
                    date: "2024-01-15",
                    status: "completed"
                  },
                  { 
                    id: "MEL-002", 
                    input: "300g 875", 
                    output: "298g 995", 
                    loss: "2g", 
                    efficiency: "99.3%",
                    date: "2024-01-18", 
                    status: "completed"
                  },
                  { 
                    id: "MEL-003", 
                    input: "200g 750", 
                    output: "195g 995", 
                    loss: "5g", 
                    efficiency: "97.5%",
                    date: "2024-01-20",
                    status: "completed"
                  },
                ].map((batch, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        {batch.id}
                      </Badge>
                      <div>
                        <p className="font-medium">Input: {batch.input} → Output: {batch.output}</p>
                        <p className="text-sm text-slate-500">{batch.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={batch.efficiency >= "99%" ? "default" : "destructive"}>
                        {batch.efficiency} eff.
                      </Badge>
                      <span className="text-sm text-rose-600">Loss: {batch.loss}</span>
                      <Button variant="outline" size="sm">Details</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Efficiency Tab */}
        <TabsContent value="efficiency">
          <Card>
            <CardHeader>
              <CardTitle>Melting Efficiency</CardTitle>
              <CardDescription>Performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { purity: "995 to 995", avgEfficiency: "99.8%", totalBatches: 12, totalLoss: "2.5g" },
                  { purity: "917 to 995", avgEfficiency: "99.2%", totalBatches: 8, totalLoss: "4.8g" },
                  { purity: "875 to 995", avgEfficiency: "98.7%", totalBatches: 3, totalLoss: "1.2g" },
                  { purity: "750 to 995", avgEfficiency: "97.5%", totalBatches: 1, totalLoss: "5.0g" },
                ].map((item, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.purity}</p>
                      <p className="text-sm text-slate-500">{item.totalBatches} batches</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {item.avgEfficiency}
                      </Badge>
                      <span className="text-sm text-rose-600">{item.totalLoss} loss</span>
                    </div>
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