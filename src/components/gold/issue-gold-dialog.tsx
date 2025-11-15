"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoldTransaction, calculatePureGold, calculatePhysicalWeight } from "@/lib/gold-calculations"
import { toast } from "sonner"
import { updatePurityStockOnIssue } from "@/lib/storage"
import { updateWorkerOnIssue } from "@/lib/storage"


interface IssueGoldDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onIssue: (transaction: GoldTransaction) => void
  currentStock?: any
}

export function IssueGoldDialog({ open, onOpenChange, onIssue, currentStock }: IssueGoldDialogProps) {
  const [formData, setFormData] = useState({
    workerName: "",
    weight: "",
    purity: "917" // Default to 22K
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.workerName || !formData.weight) {
      toast.error("Please fill all fields")
      return
    }

    const weight = parseFloat(formData.weight)
    const purity = parseInt(formData.purity)
    const pureGoldContent = calculatePureGold(weight, purity)

    const transaction: GoldTransaction = {
      id: Date.now().toString(),
      type: "issue",
      weight,
      purity,
      pureGoldContent,
      toFrom: formData.workerName,
      date: new Date(),
      loss: 0
    }

    onIssue(transaction)
    updatePurityStockOnIssue(purity, weight) // update purity stock
    updateWorkerOnIssue(formData.workerName, Number(weight)) // <-- ADDED: update worker stats on issue

    toast.success("Gold issued successfully!", {
      description: `${weight}g of ${purity}K (${getPurityPercentage(purity)}% pure) issued to ${formData.workerName}`
    })

    // Reset form
    setFormData({ workerName: "", weight: "", purity: "22" })
    onOpenChange(false)
  }

  const pureGoldContent = formData.weight ?
    calculatePureGold(parseFloat(formData.weight), parseInt(formData.purity)) : 0

  const getPurityPercentage = (purity: number): string => {
    return ((purity / 24) * 100).toFixed(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Issue Gold to Worker</DialogTitle>
          <DialogDescription>
            All weights automatically calculated in 999 pure gold equivalent
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Worker Name */}
          <div className="space-y-2">
            <Label htmlFor="workerName">Worker Name</Label>
            <Input
              id="workerName"
              placeholder="Enter worker name"
              value={formData.workerName}
              onChange={(e) => setFormData(prev => ({ ...prev, workerName: e.target.value }))}
            />
          </div>

          {/* Gold Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Gold Weight (grams)</Label>
            <Input
              id="weight"
              type="number"
              step="0.001"
              placeholder="0.000"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
            />
          </div>

          {/* Purity Selection - Now supports any purity */}
          <div className="space-y-2">
            <Label htmlFor="purity">Gold Purity</Label>
            <Select
              value={formData.purity}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, purity: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select purity" />
              </SelectTrigger>
              <SelectContent>

                <SelectItem value="995">24K (99.5% Pure)</SelectItem>
                <SelectItem value="917">22K (91.7% Pure)</SelectItem>
                <SelectItem value="875">21K (87.5% Pure)</SelectItem>
                <SelectItem value="750">18K (75.0% Pure)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Automatic Calculation Preview */}
          {formData.weight && (
            <div className="p-3 bg-slate-50 rounded-lg border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Physical Weight:</span>
                <span className="font-mono font-medium">{parseFloat(formData.weight).toFixed(3)}g</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Pure Gold (999):</span>
                <span className="font-mono font-medium text-green-600">{pureGoldContent.toFixed(3)}g</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Purity Percentage:</span>
                <span className="font-medium">{getPurityPercentage(parseInt(formData.purity))}%</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Equivalent to {calculatePhysicalWeight(pureGoldContent, 24).toFixed(3)}g of 24K gold
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Issue Gold
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}