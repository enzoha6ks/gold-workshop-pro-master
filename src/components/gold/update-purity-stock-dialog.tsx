"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PurityStock, calculatePureFromPurities } from "@/lib/gold-calculations"
import { toast } from "sonner"

interface UpdatePurityStockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (purityStock: PurityStock) => void
  currentStock?: PurityStock
}

export function UpdatePurityStockDialog({ open, onOpenChange, onUpdate, currentStock }: UpdatePurityStockDialogProps) {
  const [formData, setFormData] = useState({
    '995': "0",
    '917': "0", 
    '875': "0",
    '750': "0"
  })

  // Initialize form with current stock when dialog opens
  useEffect(() => {
    if (open && currentStock) {
      setFormData({
        '995': currentStock['995'].toString(),
        '917': currentStock['917'].toString(),
        '875': currentStock['875'].toString(),
        '750': currentStock['750'].toString()
      })
    }
  }, [open, currentStock])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newPurityStock: PurityStock = {
      '995': parseFloat(formData['995']) || 0,
      '917': parseFloat(formData['917']) || 0,
      '875': parseFloat(formData['875']) || 0,
      '750': parseFloat(formData['750']) || 0,
      'pure': 0 // Will be calculated
    }

    // Calculate pure gold
    newPurityStock.pure = calculatePureFromPurities(newPurityStock)

    onUpdate(newPurityStock)
    
    toast.success("Purity stocks updated!", {
      description: `Pure gold: ${newPurityStock.pure.toFixed(2)}g`
    })
    
    onOpenChange(false)
  }

  // Calculate preview
  const previewPureGold = calculatePureFromPurities({
    '995': parseFloat(formData['995']) || 0,
    '917': parseFloat(formData['917']) || 0,
    '875': parseFloat(formData['875']) || 0,
    '750': parseFloat(formData['750']) || 0,
    'pure': 0
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Purity Stocks</DialogTitle>
          <DialogDescription>
            Set your current gold stock by purity. Pure gold will be calculated automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 995 Purity (24K) */}
          <div className="space-y-2">
            <Label htmlFor="995" className="flex items-center gap-2">
              <span className="w-12 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">995</span>
              <span>24K Gold (99.5% Pure)</span>
            </Label>
            <Input
              id="995"
              type="number"
              step="0.001"
              placeholder="0.000"
              value={formData['995']}
              onChange={(e) => setFormData(prev => ({ ...prev, '995': e.target.value }))}
            />
          </div>

          {/* 917 Purity (22K) */}
          <div className="space-y-2">
            <Label htmlFor="917" className="flex items-center gap-2">
              <span className="w-12 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">917</span>
              <span>22K Gold (91.7% Pure)</span>
            </Label>
            <Input
              id="917"
              type="number"
              step="0.001"
              placeholder="0.000"
              value={formData['917']}
              onChange={(e) => setFormData(prev => ({ ...prev, '917': e.target.value }))}
            />
          </div>

          {/* 875 Purity (21K) */}
          <div className="space-y-2">
            <Label htmlFor="875" className="flex items-center gap-2">
              <span className="w-12 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">875</span>
              <span>21K Gold (87.5% Pure)</span>
            </Label>
            <Input
              id="875"
              type="number"
              step="0.001"
              placeholder="0.000"
              value={formData['875']}
              onChange={(e) => setFormData(prev => ({ ...prev, '875': e.target.value }))}
            />
          </div>

          {/* 750 Purity (18K) */}
          <div className="space-y-2">
            <Label htmlFor="750" className="flex items-center gap-2">
              <span className="w-12 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">750</span>
              <span>18K Gold (75.0% Pure)</span>
            </Label>
            <Input
              id="750"
              type="number"
              step="0.001"
              placeholder="0.000"
              value={formData['750']}
              onChange={(e) => setFormData(prev => ({ ...prev, '750': e.target.value }))}
            />
          </div>

          {/* Automatic Calculation Preview */}
          <div className="p-3 bg-slate-50 rounded-lg border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Physical Gold:</span>
              <span className="font-mono font-medium">
                {(
                  (parseFloat(formData['995']) || 0) +
                  (parseFloat(formData['917']) || 0) +
                  (parseFloat(formData['875']) || 0) +
                  (parseFloat(formData['750']) || 0)
                ).toFixed(2)}g
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Calculated Pure Gold:</span>
              <span className="font-mono font-medium text-green-600">
                {previewPureGold.toFixed(2)}g
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Stocks
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}