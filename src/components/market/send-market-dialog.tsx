"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculatePureGold } from "@/lib/gold-calculations"
import { toast } from "sonner"

interface SendMarketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSend: (transaction: any) => void
}

export function SendMarketDialog({ open, onOpenChange, onSend }: SendMarketDialogProps) {
  const [formData, setFormData] = useState({
    vendor: "",
    weight: "",
    purity: "917",
    notes: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.vendor || !formData.weight) {
      toast.error("Please fill vendor and weight fields")
      return
    }

    const weight = parseFloat(formData.weight)
    const purity = parseInt(formData.purity)
    
    // REAL CALCULATION: weight × purity ÷ 999
    const pureGoldContent = calculatePureGold(weight, purity)

    const transaction = {
      id: Date.now().toString(),
      type: "send_market" as const,
      vendor: formData.vendor,
      weight,
      purity,
      pureGoldContent,
      date: new Date(),
      notes: formData.notes,
      status: "pending" as const
    }

    onSend(transaction)
    toast.success("Gold sent to market!", {
      description: `${weight}g sent to ${formData.vendor}`
    })
    
    // Reset form
    setFormData({ vendor: "", weight: "", purity: "917", notes: "" })
    onOpenChange(false)
  }

  // REAL-TIME CALCULATION PREVIEW
  const pureGoldContent = formData.weight ? 
    calculatePureGold(parseFloat(formData.weight), parseInt(formData.purity)) : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Gold to Market</DialogTitle>
          <DialogDescription>
            Send gold to vendors for refining or processing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vendor Name */}
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor Name</Label>
            <Input
              id="vendor"
              placeholder="Enter vendor name"
              value={formData.vendor}
              onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
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

          {/* Purity Selection */}
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
                <SelectItem value="995">995 (24K - 99.5%)</SelectItem>
                <SelectItem value="917">917 (22K - 91.7%)</SelectItem>
                <SelectItem value="875">875 (21K - 87.5%)</SelectItem>
                <SelectItem value="750">750 (18K - 75.0%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Purpose: refining, making, etc."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          {/* REAL-TIME CALCULATION PREVIEW */}
          {formData.weight && (
            <div className="p-3 bg-slate-50 rounded-lg border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Physical Weight:</span>
                <span className="font-mono font-medium">{parseFloat(formData.weight).toFixed(3)}g</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Pure Gold Content:</span>
                <span className="font-mono font-medium text-green-600">
                  {pureGoldContent.toFixed(3)}g
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Calculation: {formData.weight} × {formData.purity} ÷ 999 = {pureGoldContent.toFixed(3)}g
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!formData.vendor || !formData.weight}>
              Send to Market
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}