"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Flame, TrendingDown, Calculator, History, Trash2, Eye } from "lucide-react"

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
  const [showNewBatchForm, setShowNewBatchForm] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // Local state for batches - starting empty
  const [batches, setBatches] = useState<MeltingBatch[]>([])

  // New batch form state
  const [newBatch, setNewBatch] = useState({
    inputWeight: "",
    inputPurity: "917",
    outputWeight: "",
    outputPurity: "995",
    notes: ""
  })

  // Calculator state
  const [calculatorInput, setCalculatorInput] = useState({
    weight: "",
    fromPurity: "917",
    toPurity: "995"
  })
  const [calculatorResult, setCalculatorResult] = useState<{
    outputWeight: number
    pureGold: number
    loss: number
  } | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calculate statistics
  const totalBatches = isClient ? batches.length : 0
  const totalLoss = isClient ? batches.reduce((sum, batch) => sum + batch.loss, 0) : 0
  const avgEfficiency = isClient && batches.length > 0 
    ? batches.reduce((sum, batch) => sum + batch.efficiency, 0) / batches.length 
    : 0
  const thisMonthBatches = isClient ? batches.filter(batch => {
    const batchDate = new Date(batch.date)
    const now = new Date()
    return batchDate.getMonth() === now.getMonth() && batchDate.getFullYear() === now.getFullYear()
  }).length : 0

  // Calculate efficiency statistics by purity conversion
  const getEfficiencyStats = (): EfficiencyStats[] => {
    if (batches.length === 0) return []
    
    const purityGroups = batches.reduce((groups, batch) => {
      const key = `${batch.inputPurity} to ${batch.outputPurity}`
      if (!groups[key]) {
        groups[key] = {
          batches: [],
          totalLoss: 0
        }
      }
      groups[key].batches.push(batch)
      groups[key].totalLoss += batch.loss
      return groups
    }, {} as Record<string, { batches: MeltingBatch[], totalLoss: number }>)

    return Object.entries(purityGroups).map(([purity, data]) => ({
      purity,
      avgEfficiency: data.batches.reduce((sum, b) => sum + b.efficiency, 0) / data.batches.length,
      totalBatches: data.batches.length,
      totalLoss: data.totalLoss
    }))
  }

  const efficiencyStats = getEfficiencyStats()

  // Handle new batch submission
  const handleAddBatch = () => {
    if (!newBatch.inputWeight || !newBatch.outputWeight) return

    const inputWeight = parseFloat(newBatch.inputWeight)
    const outputWeight = parseFloat(newBatch.outputWeight)
    const inputPurity = parseInt(newBatch.inputPurity)
    const outputPurity = parseInt(newBatch.outputPurity)
    
    if (inputWeight <= 0 || outputWeight <= 0) {
      alert("Please enter valid weights greater than 0")
      return
    }

    const loss = inputWeight - outputWeight
    const efficiency = (outputWeight / inputWeight) * 100

    const batch: MeltingBatch = {
      id: `MEL-${String(batches.length + 1).padStart(3, '0')}`,
      inputWeight,
      inputPurity,
      outputWeight,
      outputPurity,
      loss,
      efficiency: parseFloat(efficiency.toFixed(1)),
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      notes: newBatch.notes || undefined
    }

    setBatches([batch, ...batches])
    setNewBatch({
      inputWeight: "",
      inputPurity: "917",
      outputWeight: "",
      outputPurity: "995",
      notes: ""
    })
    setShowNewBatchForm(false)
  }

  const handleDeleteBatch = (batchId: string) => {
    if (confirm("Are you sure you want to delete this batch?")) {
      setBatches(batches.filter(batch => batch.id !== batchId))
    }
  }

  const handleViewDetails = (batchId: string) => {
    // In a real app, this would open a detail view or dialog
    console.log("Viewing details for batch:", batchId)
    // You can implement a dialog or navigate to detail page
  }

  // Handle calculator calculation
  const calculateMelting = () => {
    const weight = parseFloat(calculatorInput.weight)
    const fromPurity = parseInt(calculatorInput.fromPurity)
    const toPurity = parseInt(calculatorInput.toPurity)

    if (!weight || weight <= 0) {
      alert("Please enter a valid weight greater than 0")
      return
    }

    const pureGold = (weight * fromPurity) / 1000
    const outputWeight = (pureGold * 1000) / toPurity
    const loss = weight - outputWeight

    setCalculatorResult({
      outputWeight: parseFloat(outputWeight.toFixed(3)),
      pureGold: parseFloat(pureGold.toFixed(3)),
      loss: parseFloat(loss.toFixed(3))
    })
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 99) return "bg-green-100 text-green-800"
    if (efficiency >= 97) return "bg-amber-100 text-amber-800"
    return "bg-rose-100 text-rose-800"
  }

  const getLossColor = (loss: number) => {
    if (loss === 0) return "text-gray-600"
    return "text-rose-600"
  }

  const getStatusBadge = (status: MeltingBatch['status']) => {
    const variants = {
      completed: { bg: "bg-green-100 text-green-800", label: "Completed" },
      'in-progress': { bg: "bg-blue-100 text-blue-800", label: "In Progress" },
      planned: { bg: "bg-gray-100 text-gray-800", label: "Planned" }
    }
    return variants[status]
  }

  // Show loading state during SSR
  if (!isClient) {
    return <div className="p-4 flex items-center justify-center min-h-screen">Loading...</div>
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
          <Button 
            className="gap-2 w-full sm:w-auto"
            onClick={() => setShowNewBatchForm(true)}
          >
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
            title: "Total Loss", 
            value: `${totalLoss.toFixed(1)}g`, 
            icon: TrendingDown, 
            color: "text-rose-600",
            description: "Total gold loss"
          },
          { 
            title: "Avg Efficiency", 
            value: batches.length > 0 ? `${avgEfficiency.toFixed(1)}%` : "0%", 
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
                {batches.length > 0 
                  ? `Recent gold melting operations • ${batches.length} total batches • Total Loss: ${totalLoss.toFixed(1)}g`
                  : "Track your gold melting batches and monitor efficiency"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {batches.length === 0 ? (
                <div className="text-center py-12">
                  <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No melting batches yet</h3>
                  <p className="text-gray-500 mt-1">Start by creating your first melting batch to track efficiency and losses</p>
                  <Button 
                    onClick={() => setShowNewBatchForm(true)} 
                    className="mt-4 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Batch
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {batches.map((batch) => {
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
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                              <p className="text-sm text-slate-500">{batch.date}</p>
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${getLossColor(batch.loss)}`}>
                                  Loss: {batch.loss.toFixed(1)}g
                                </span>
                                {batch.loss > 0 && (
                                  <span className="text-xs text-slate-500">
                                    ({((batch.loss / batch.inputWeight) * 100).toFixed(1)}%)
                                  </span>
                                )}
                              </div>
                            </div>
                            {batch.notes && (
                              <p className="text-xs text-slate-500 mt-1">Note: {batch.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                          <Badge className={getEfficiencyColor(batch.efficiency)}>
                            {batch.efficiency.toFixed(1)}% eff.
                          </Badge>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewDetails(batch.id)}
                              className="gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Details
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteBatch(batch.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
              <CardDescription>
                {batches.length > 0 
                  ? "Performance metrics and trends by purity conversion"
                  : "Efficiency metrics will appear here after creating batches"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {batches.length === 0 ? (
                <div className="text-center py-12">
                  <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No efficiency data</h3>
                  <p className="text-gray-500 mt-1">Complete some melting batches to see efficiency metrics and trends</p>
                  <Button 
                    onClick={() => setShowNewBatchForm(true)} 
                    className="mt-4 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Batch
                  </Button>
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
                          <Badge className={getEfficiencyColor(item.avgEfficiency)}>
                            {item.avgEfficiency.toFixed(1)}% avg
                          </Badge>
                          <div className="flex flex-col items-end">
                            <span className={`text-sm font-medium ${getLossColor(item.totalLoss)}`}>
                              {item.totalLoss.toFixed(1)}g loss
                            </span>
                            {item.totalBatches > 0 && (
                              <span className="text-xs text-slate-500">
                                Avg: {(item.totalLoss / item.totalBatches).toFixed(1)}g/batch
                              </span>
                            )}
                          </div>
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
              <CardDescription>Calculate expected output and loss for purity conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="weight">Input Weight (g)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.001"
                      placeholder="Enter weight"
                      value={calculatorInput.weight}
                      onChange={(e) => setCalculatorInput({...calculatorInput, weight: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromPurity">From Purity</Label>
                    <Select value={calculatorInput.fromPurity} onValueChange={(value) => setCalculatorInput({...calculatorInput, fromPurity: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="999">999</SelectItem>
                        <SelectItem value="995">995</SelectItem>
                        <SelectItem value="917">917</SelectItem>
                        <SelectItem value="875">875</SelectItem>
                        <SelectItem value="750">750</SelectItem>
                        <SelectItem value="585">585</SelectItem>
                        <SelectItem value="375">375</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="toPurity">To Purity</Label>
                    <Select value={calculatorInput.toPurity} onValueChange={(value) => setCalculatorInput({...calculatorInput, toPurity: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="999">999</SelectItem>
                        <SelectItem value="995">995</SelectItem>
                        <SelectItem value="917">917</SelectItem>
                        <SelectItem value="875">875</SelectItem>
                        <SelectItem value="750">750</SelectItem>
                        <SelectItem value="585">585</SelectItem>
                        <SelectItem value="375">375</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={calculateMelting} className="w-full">
                  Calculate
                </Button>

                {calculatorResult && (
                  <div className="p-4 border rounded-lg bg-slate-50">
                    <h4 className="font-semibold mb-2">Calculation Results:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Output Weight:</span>
                        <span className="font-medium">{calculatorResult.outputWeight}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pure Gold Content:</span>
                        <span className="font-medium">{calculatorResult.pureGold}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Loss:</span>
                        <span className={`font-medium ${calculatorResult.loss > 0 ? 'text-rose-600' : 'text-gray-600'}`}>
                          {calculatorResult.loss.toFixed(3)}g
                        </span>
                      </div>
                      {calculatorResult.loss > 0 && (
                        <div className="flex justify-between">
                          <span>Loss Percentage:</span>
                          <span className="font-medium text-rose-600">
                            {((calculatorResult.loss / parseFloat(calculatorInput.weight)) * 100).toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Batch Dialog */}
      {showNewBatchForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>New Melting Batch</CardTitle>
              <CardDescription>Add a completed melting batch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inputWeight">Input Weight (g)</Label>
                  <Input
                    id="inputWeight"
                    type="number"
                    step="0.001"
                    placeholder="0.000"
                    value={newBatch.inputWeight}
                    onChange={(e) => setNewBatch({...newBatch, inputWeight: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="inputPurity">Input Purity</Label>
                  <Select value={newBatch.inputPurity} onValueChange={(value) => setNewBatch({...newBatch, inputPurity: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="999">999</SelectItem>
                      <SelectItem value="995">995</SelectItem>
                      <SelectItem value="917">917</SelectItem>
                      <SelectItem value="875">875</SelectItem>
                      <SelectItem value="750">750</SelectItem>
                      <SelectItem value="585">585</SelectItem>
                      <SelectItem value="375">375</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="outputWeight">Output Weight (g)</Label>
                  <Input
                    id="outputWeight"
                    type="number"
                    step="0.001"
                    placeholder="0.000"
                    value={newBatch.outputWeight}
                    onChange={(e) => setNewBatch({...newBatch, outputWeight: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="outputPurity">Output Purity</Label>
                  <Select value={newBatch.outputPurity} onValueChange={(value) => setNewBatch({...newBatch, outputPurity: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="999">999</SelectItem>
                      <SelectItem value="995">995</SelectItem>
                      <SelectItem value="917">917</SelectItem>
                      <SelectItem value="875">875</SelectItem>
                      <SelectItem value="750">750</SelectItem>
                      <SelectItem value="585">585</SelectItem>
                      <SelectItem value="375">375</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Auto-calculated loss preview */}
              {newBatch.inputWeight && newBatch.outputWeight && (
                <div className="p-3 border rounded-lg bg-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Calculated Loss:</span>
                    <span className={`font-bold ${parseFloat(newBatch.inputWeight) > parseFloat(newBatch.outputWeight) ? 'text-rose-600' : 'text-green-600'}`}>
                      {(parseFloat(newBatch.inputWeight) - parseFloat(newBatch.outputWeight)).toFixed(3)}g
                    </span>
                  </div>
                  {parseFloat(newBatch.inputWeight) > 0 && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-slate-500">Efficiency:</span>
                      <span className="text-sm font-medium">
                        {((parseFloat(newBatch.outputWeight) / parseFloat(newBatch.inputWeight)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Any additional notes..."
                  value={newBatch.notes}
                  onChange={(e) => setNewBatch({...newBatch, notes: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddBatch} 
                  className="flex-1" 
                  disabled={!newBatch.inputWeight || !newBatch.outputWeight || parseFloat(newBatch.inputWeight) <= 0 || parseFloat(newBatch.outputWeight) <= 0}
                >
                  Add Batch
                </Button>
                <Button variant="outline" onClick={() => setShowNewBatchForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}