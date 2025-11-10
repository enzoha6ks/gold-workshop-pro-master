// "use client"

// import { useState, useEffect } from "react"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { GoldTransaction, calculatePureGold, calculateLoss } from "@/lib/gold-calculations"
// import { toast } from "sonner"

// interface ReturnGoldDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onReturn: (transaction: GoldTransaction) => void
//   pendingIssues: GoldTransaction[] // Gold that was issued but not returned yet
// }

// export function ReturnGoldDialog({ open, onOpenChange, onReturn, pendingIssues }: ReturnGoldDialogProps) {
//   const [formData, setFormData] = useState({
//     issueId: "",
//     returnedWeight: "",
//     returnedPurity: "917"
//   })

//   const [selectedIssue, setSelectedIssue] = useState<GoldTransaction | null>(null)

//   // Reset form when dialog opens/closes
//   useEffect(() => {
//     if (!open) {
//       setFormData({ issueId: "", returnedWeight: "", returnedPurity: "22" })
//       setSelectedIssue(null)
//     }
//   }, [open])

//   const handleIssueSelect = (issueId: string) => {
//     setFormData(prev => ({ ...prev, issueId }))
//     const issue = pendingIssues.find(i => i.id === issueId)
//     setSelectedIssue(issue || null)
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!selectedIssue || !formData.returnedWeight) {
//       toast.error("Please select an issue and enter returned weight")
//       return
//     }

//     const returnedWeight = parseFloat(formData.returnedWeight)
//     const returnedPurity = parseInt(formData.returnedPurity)

//     // Calculate loss in pure gold terms
//     const loss = calculateLoss(
//       selectedIssue.weight,
//       selectedIssue.purity,
//       returnedWeight,
//       returnedPurity
//     )

//     const returnTransaction: GoldTransaction = {
//       id: Date.now().toString(),
//       type: "return",
//       weight: returnedWeight,
//       purity: returnedPurity,
//       pureGoldContent: calculatePureGold(returnedWeight, returnedPurity),
//       toFrom: selectedIssue.toFrom,
//       date: new Date(),
//       loss: loss,
//       notes: `Return for issue ${selectedIssue.id}`
//     }

//     onReturn(returnTransaction)

//     toast.success(
//       loss > 0 ? "Gold returned with loss recorded" : "Gold returned successfully!",
//       {
//         description: `Returned: ${returnedWeight}g | Loss: ${loss.toFixed(3)}g pure gold`
//       }
//     )

//     onOpenChange(false)
//   }

//   const calculatedLoss = selectedIssue && formData.returnedWeight ?
//     calculateLoss(
//       selectedIssue.weight,
//       selectedIssue.purity,
//       parseFloat(formData.returnedWeight),
//       parseInt(formData.returnedPurity)
//     ) : 0

//   const efficiency = selectedIssue && formData.returnedWeight ?
//     ((parseFloat(formData.returnedWeight) / selectedIssue.weight) * 100).toFixed(1) : 0

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Return Gold from Worker</DialogTitle>
//           <DialogDescription>
//             Record gold return with automatic loss calculation
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Select Issued Gold */}
//           <div className="space-y-2">
//             <Label htmlFor="issueId">Select Issued Gold</Label>
//             <Select value={formData.issueId} onValueChange={handleIssueSelect}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select issued gold to return" />
//               </SelectTrigger>
//               <SelectContent>
//                 {pendingIssues.map((issue) => (
//                   <SelectItem key={issue.id} value={issue.id}>
//                     {issue.toFrom} - {issue.weight}g {issue.purity}K
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {selectedIssue && (
//             <>
//               {/* Original Issue Details */}
//               <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-1">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-blue-700">Originally Issued:</span>
//                   <span className="font-mono font-medium">{selectedIssue.weight}g {selectedIssue.purity}K</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-blue-700">Pure Gold Issued:</span>
//                   <span className="font-mono font-medium">{selectedIssue.pureGoldContent.toFixed(3)}g</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-blue-700">Issued To:</span>
//                   <span className="font-medium">{selectedIssue.toFrom}</span>
//                 </div>
//               </div>

//               {/* Returned Weight */}
//               <div className="space-y-2">
//                 <Label htmlFor="returnedWeight">Returned Weight (grams)</Label>
//                 <Input
//                   id="returnedWeight"
//                   type="number"
//                   step="0.001"
//                   placeholder="0.000"
//                   value={formData.returnedWeight}
//                   onChange={(e) => setFormData(prev => ({ ...prev, returnedWeight: e.target.value }))}
//                 />
//               </div>

//               {/* Returned Purity */}
//               <div className="space-y-2">
//                 <Label htmlFor="returnedPurity">Returned Purity</Label>
//                 <Select
//                   value={formData.returnedPurity}
//                   onValueChange={(value) =>
//                     setFormData(prev => ({ ...prev, returnedPurity: value }))
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select purity" />
//                   </SelectTrigger>
//                   <SelectContent>

//                     <SelectItem value="995">24K (99.5% Pure)</SelectItem>
//                     <SelectItem value="917">22K (91.7% Pure)</SelectItem>
//                     <SelectItem value="875">21K (87.5% Pure)</SelectItem>
//                     <SelectItem value="750">18K (75.0% Pure)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Automatic Calculation Preview */}
//               {formData.returnedWeight && (
//                 <div className="p-3 bg-slate-50 rounded-lg border space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-slate-600">Returned Pure Gold:</span>
//                     <span className="font-mono font-medium text-green-600">
//                       {calculatePureGold(parseFloat(formData.returnedWeight), parseInt(formData.returnedPurity)).toFixed(3)}g
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-slate-600">Material Loss:</span>
//                     <span className="font-mono font-medium text-rose-600">
//                       {calculatedLoss.toFixed(3)}g pure gold
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-slate-600">Efficiency:</span>
//                     <span className={`font-medium ${parseFloat(efficiency) > 98 ? 'text-emerald-600' :
//                         parseFloat(efficiency) > 95 ? 'text-amber-600' : 'text-rose-600'
//                       }`}>
//                       {efficiency}%
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4">
//             <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="flex-1"
//               disabled={!selectedIssue || !formData.returnedWeight}
//             >
//               Record Return
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoldTransaction, calculatePureGold } from "@/lib/gold-calculations"
import { toast } from "sonner"
import { updatePurityStockOnReturn } from "@/lib/storage"
import { updateWorkerOnReturn } from "@/lib/storage"


interface ReturnGoldDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReturn: (transaction: GoldTransaction) => void
  pendingIssues: GoldTransaction[]
}

export function ReturnGoldDialog({ open, onOpenChange, onReturn, pendingIssues }: ReturnGoldDialogProps) {
  const [formData, setFormData] = useState({
    issueId: "",
    returnedWeight: "",
    returnedPurity: "917"
  })

  const [selectedIssue, setSelectedIssue] = useState<GoldTransaction | null>(null)

  useEffect(() => {
    if (!open) {
      setFormData({ issueId: "", returnedWeight: "", returnedPurity: "917" })
      setSelectedIssue(null)
    }
  }, [open])

  const handleIssueSelect = (issueId: string) => {
    setFormData(prev => ({ ...prev, issueId }))
    const issue = pendingIssues.find(i => i.id === issueId)
    setSelectedIssue(issue || null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedIssue || !formData.returnedWeight) {
      toast.error("Please select an issue and enter returned weight")
      return
    }

    const returnedWeight = parseFloat(formData.returnedWeight)
    const issuedWeight = selectedIssue.weight

    // 🟢 NEW LOGIC — Loss in same purity (not pure gold)
    const loss = issuedWeight - returnedWeight
    const efficiency = (returnedWeight / issuedWeight) * 100

    const returnTransaction: GoldTransaction = {
      id: Date.now().toString(),
      type: "return",
      weight: returnedWeight,
      purity: selectedIssue.purity, // same purity as issued
      pureGoldContent: calculatePureGold(returnedWeight, selectedIssue.purity),
      toFrom: selectedIssue.toFrom,
      date: new Date(),
      loss,
      notes: `Return for issue ${selectedIssue.id} (${efficiency.toFixed(1)}% efficiency)`
    }

    onReturn(returnTransaction)

    // Update local purity stock to reflect returned material
    updatePurityStockOnReturn(selectedIssue.purity, returnedWeight)

    // Update worker stats (totalReturned, totalLoss, efficiency)
    updateWorkerOnReturn(selectedIssue.toFrom, Number(returnedWeight), Number(loss))

    toast.success(
      loss > 0 ? "Gold returned with loss recorded" : "Gold returned successfully!",
      {
        description: `Returned: ${returnedWeight}g ${selectedIssue.purity}K | Loss: ${loss.toFixed(3)}g (${efficiency.toFixed(1)}% efficiency)`
      }
    )

    onOpenChange(false)
  }

  const calculatedLoss =
    selectedIssue && formData.returnedWeight
      ? selectedIssue.weight - parseFloat(formData.returnedWeight)
      : 0

  const efficiency =
    selectedIssue && formData.returnedWeight
      ? ((parseFloat(formData.returnedWeight) / selectedIssue.weight) * 100).toFixed(1)
      : "0"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Return Gold from Worker</DialogTitle>
          <DialogDescription>Record gold return with automatic loss calculation</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Issued Gold */}
          <div className="space-y-2">
            <Label htmlFor="issueId">Select Issued Gold</Label>
            <Select value={formData.issueId} onValueChange={handleIssueSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select issued gold to return" />
              </SelectTrigger>
              <SelectContent>
                {pendingIssues.map((issue) => (
                  <SelectItem key={issue.id} value={issue.id}>
                    {issue.toFrom} - {issue.weight}g {issue.purity}K
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedIssue && (
            <>
              {/* Original Issue Details */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Originally Issued:</span>
                  <span className="font-mono font-medium">{selectedIssue.weight}g {selectedIssue.purity}K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Pure Gold Issued:</span>
                  <span className="font-mono font-medium">{selectedIssue.pureGoldContent.toFixed(3)}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Issued To:</span>
                  <span className="font-medium">{selectedIssue.toFrom}</span>
                </div>
              </div>

              {/* Returned Weight */}
              <div className="space-y-2">
                <Label htmlFor="returnedWeight">Returned Weight (grams)</Label>
                <Input
                  id="returnedWeight"
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  value={formData.returnedWeight}
                  onChange={(e) => setFormData(prev => ({ ...prev, returnedWeight: e.target.value }))}
                />
              </div>

              {/* Calculation Preview */}
              {formData.returnedWeight && (
                <div className="p-3 bg-slate-50 rounded-lg border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Material Loss:</span>
                    <span className="font-mono font-medium text-rose-600">
                      {calculatedLoss.toFixed(3)}g {selectedIssue.purity}K
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Efficiency:</span>
                    <span
                      className={`font-medium ${
                        parseFloat(efficiency) > 98
                          ? "text-emerald-600"
                          : parseFloat(efficiency) > 95
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {efficiency}%
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!selectedIssue || !formData.returnedWeight}>
              Record Return
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
