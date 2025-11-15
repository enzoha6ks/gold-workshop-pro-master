
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Scale, AlertTriangle, Plus, Minus, Package } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface ReceiveMarketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReceive: (transaction: any) => void
  pendingTransactions: any[]
}

export function ReceiveMarketDialog({ 
  open, 
  onOpenChange, 
  onReceive, 
  pendingTransactions 
}: ReceiveMarketDialogProps) {
  const [selectedVendor, setSelectedVendor] = useState("")
  const [purities, setPurities] = useState<Array<{ purity: string; weight: string }>>([{ purity: "", weight: "" }])
  const [remainingBalance, setRemainingBalance] = useState("")
  const [notes, setNotes] = useState("")
  
  const { getVendorRemainingBalance } = useAppStore()

  // FIXED: Filter vendors with ACTUAL remaining balance > 0.001 (to account for floating point)
  const vendorsWithBalance = pendingTransactions.filter(transaction => {
    const balance = getVendorRemainingBalance(transaction.vendor)
    return balance > 0.001 // Small threshold to account for floating point precision
  })

  // Get selected pending transaction
  const selectedTransaction = vendorsWithBalance.find(t => t.vendor === selectedVendor)

  // Calculate vendor's current remaining balance
  const vendorCurrentBalance = selectedVendor ? getVendorRemainingBalance(selectedVendor) : 0

  // Calculate total received weight from all purities
  const totalReceivedWeight = purities.reduce((total, item) => {
    return total + (parseFloat(item.weight) || 0)
  }, 0)

  // Calculate actual pure gold received from all purities (weight * purity / 999)
  const actualPureGold = purities.reduce((total, item) => {
    const weight = parseFloat(item.weight) || 0
    const purity = parseFloat(item.purity) || 0
    return total + (weight * purity) / 999
  }, 0)

  // Calculate new remaining balance after this receipt
  const newRemainingBalance = vendorCurrentBalance - actualPureGold

  // Auto-update remaining balance
  useEffect(() => {
    if (actualPureGold > 0) {
      setRemainingBalance(newRemainingBalance > 0 ? newRemainingBalance.toFixed(3) : "0")
    } else {
      setRemainingBalance(vendorCurrentBalance > 0 ? vendorCurrentBalance.toFixed(3) : "0")
    }
  }, [actualPureGold, vendorCurrentBalance, newRemainingBalance])

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedVendor("")
      setPurities([{ purity: "", weight: "" }])
      setRemainingBalance("")
      setNotes("")
    }
  }, [open])

  // Reset purities when vendor changes
  useEffect(() => {
    if (selectedVendor) {
      setPurities([{ purity: "", weight: "" }])
      setRemainingBalance(vendorCurrentBalance > 0 ? vendorCurrentBalance.toFixed(3) : "0")
    }
  }, [selectedVendor, vendorCurrentBalance])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedVendor || !selectedTransaction) return

    const transaction = {
      id: `REC-${Date.now()}`,
      type: "receive_market",
      vendor: selectedVendor,
      date: new Date().toISOString(),
      weight: totalReceivedWeight,
      purity: "Mixed",
      pureGoldContent: actualPureGold, // This is CRITICAL - store the calculated pure gold
      remainingBalance: parseFloat(remainingBalance) || 0,
      notes,
      // Store complete transaction history
      originalTransaction: {
        id: selectedTransaction.id,
        weight: selectedTransaction.weight,
        purity: selectedTransaction.purity,
        date: selectedTransaction.date,
        pureGoldSent: (selectedTransaction.weight * selectedTransaction.purity) / 999
      },
      // Store all received purities in detail
      receivedPurities: purities.filter(p => p.purity && p.weight).map(p => ({
        purity: parseFloat(p.purity),
        weight: parseFloat(p.weight),
        pureGold: (parseFloat(p.weight) * parseFloat(p.purity)) / 999
      })),
      status: "completed",
      vendorCurrentBalance: vendorCurrentBalance,
      newBalance: newRemainingBalance
    }

    console.log(`[RECEIVE] Receiving ${actualPureGold.toFixed(3)}g pure gold from ${selectedVendor}`)
    console.log(`[RECEIVE] Vendor balance before: ${vendorCurrentBalance.toFixed(3)}g, after: ${newRemainingBalance.toFixed(3)}g`)

    onReceive(transaction)
    onOpenChange(false)
  }

  const addPurityField = () => {
    setPurities([...purities, { purity: "", weight: "" }])
  }

  const removePurityField = (index: number) => {
    if (purities.length > 1) {
      setPurities(purities.filter((_, i) => i !== index))
    }
  }

  const updatePurityField = (index: number, field: 'purity' | 'weight', value: string) => {
    const updatedPurities = [...purities]
    updatedPurities[index][field] = value
    setPurities(updatedPurities)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calculator className="w-5 h-5" />
            Receive Gold from Market
          </DialogTitle>
          <DialogDescription>
            Record gold received from vendors with multiple purity types
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Vendor Selection - Only show vendors with balance */}
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="vendor" className="text-sm sm:text-base">Select Vendor *</Label>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={
                  vendorsWithBalance.length === 0 
                    ? "No vendors with pending balance" 
                    : "Choose vendor with pending balance"
                } />
              </SelectTrigger>
              <SelectContent>
                {vendorsWithBalance.length === 0 ? (
                  <SelectItem value="no-vendors" disabled>
                    No vendors with pending balance
                  </SelectItem>
                ) : (
                  vendorsWithBalance.map((transaction) => {
                    const balance = getVendorRemainingBalance(transaction.vendor)
                    return (
                      <SelectItem key={transaction.id} value={transaction.vendor}>
                        <div className="flex flex-col">
                          <span className="font-medium">{transaction.vendor}</span>
                          <span className="text-xs text-slate-500">
                            {transaction.weight}g sent ({transaction.purity} purity)
                          </span>
                          <span className="text-xs text-amber-600 font-medium">
                            Balance: {balance.toFixed(3)}g pure gold
                          </span>
                        </div>
                      </SelectItem>
                    )
                  })
                )}
              </SelectContent>
            </Select>
            {vendorsWithBalance.length === 0 && (
              <p className="text-xs text-amber-600">
                All vendors have zero remaining balance. No pending receipts needed.
              </p>
            )}
          </div>

          {/* Vendor Balance Summary */}
          {selectedVendor && (
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader className="pb-3 p-4 sm:p-6">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Vendor Balance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <span className="text-slate-600 text-xs sm:text-sm">Current Balance:</span>
                    <p className="font-medium text-amber-600 text-sm sm:text-base">
                      {vendorCurrentBalance.toFixed(3)}g pure gold
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 text-xs sm:text-sm">After This Receipt:</span>
                    <p className={`font-medium text-sm sm:text-base ${
                      newRemainingBalance > 0 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {newRemainingBalance.toFixed(3)}g pure gold
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Original Sent Details */}
          {selectedTransaction && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3 p-4 sm:p-6">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Original Sent Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <span className="text-slate-600 text-xs sm:text-sm">Weight Sent:</span>
                    <p className="font-medium text-sm sm:text-base">{selectedTransaction.weight}g</p>
                  </div>
                  <div>
                    <span className="text-slate-600 text-xs sm:text-sm">Purity:</span>
                    <p className="font-medium text-sm sm:text-base">{selectedTransaction.purity}</p>
                  </div>
                  <div>
                    <span className="text-slate-600 text-xs sm:text-sm">Pure Gold Content:</span>
                    <p className="font-medium text-green-600 text-sm sm:text-base">
                      {((selectedTransaction.weight * selectedTransaction.purity) / 999).toFixed(3)}g
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 text-xs sm:text-sm">Sent Date:</span>
                    <p className="font-medium text-sm sm:text-base">
                      {new Date(selectedTransaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Received Gold - Multiple Purities */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm sm:text-base">Received Gold Details *</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addPurityField}
                className="gap-1"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Add Purity</span>
              </Button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto p-1">
              {purities.map((purity, index) => (
                <div key={index} className="flex flex-col xs:flex-row gap-2 sm:gap-3 items-start p-3 border rounded-lg bg-slate-50">
                  <div className="flex-1 w-full">
                    <Label htmlFor={`purity-${index}`} className="text-xs sm:text-sm">Purity</Label>
                    <Input
                      id={`purity-${index}`}
                      type="number"
                      step="0.1"
                      placeholder="e.g., 999, 950, 916"
                      value={purity.purity}
                      onChange={(e) => updatePurityField(index, 'purity', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <Label htmlFor={`weight-${index}`} className="text-xs sm:text-sm">Weight (g)</Label>
                    <Input
                      id={`weight-${index}`}
                      type="number"
                      step="0.001"
                      placeholder="Weight in grams"
                      value={purity.weight}
                      onChange={(e) => updatePurityField(index, 'weight', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  {purities.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePurityField(index)}
                      className="mt-6 xs:mt-7 gap-1 w-full xs:w-auto"
                    >
                      <Minus className="w-3 h-3" />
                      <span>Remove</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Balance Summary */}
          {(totalReceivedWeight > 0 || actualPureGold > 0) && (
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="pb-3 p-4 sm:p-6">
                <CardTitle className="text-sm">Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6 space-y-2 sm:space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm">Total Received Weight:</span>
                  <span className="font-medium text-sm sm:text-base">{totalReceivedWeight.toFixed(3)}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm">Actual Pure Gold Received:</span>
                  <span className="font-medium text-green-600 text-sm sm:text-base">{actualPureGold.toFixed(3)}g</span>
                </div>
                {selectedTransaction && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm">Expected Pure Gold:</span>
                      <span className="font-medium text-sm sm:text-base">
                        {((selectedTransaction.weight * selectedTransaction.purity) / 999).toFixed(3)}g
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2 sm:pt-3">
                      <span className="flex items-center gap-1 text-xs sm:text-sm">
                        <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                        New Remaining Balance:
                      </span>
                      <span className={`font-medium text-sm sm:text-base ${
                        newRemainingBalance > 0 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {newRemainingBalance.toFixed(3)}g
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Remaining Balance Input */}
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="remainingBalance" className="text-sm sm:text-base">Remaining Balance (g) *</Label>
            <Input
              id="remainingBalance"
              type="number"
              step="0.001"
              placeholder="Calculated automatically"
              value={remainingBalance}
              onChange={(e) => setRemainingBalance(e.target.value)}
              required
              className="text-sm sm:text-base"
            />
            <p className="text-xs text-slate-500">
              Pure gold balance remaining with vendor after this receipt
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="notes" className="text-sm sm:text-base">Notes</Label>
            <Input
              id="notes"
              placeholder="Any additional notes about this receipt..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-sm sm:text-base"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-end pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full xs:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedVendor || !remainingBalance || purities.some(p => !p.purity || !p.weight) || vendorsWithBalance.length === 0}
              className="w-full xs:w-auto"
            >
              Confirm Receipt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
