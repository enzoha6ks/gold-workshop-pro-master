// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Slider } from "@/components/ui/slider"
// // In create-order-dialog.tsx, order-details-dialog.tsx, update-order-dialog.tsx
// import { Order } from "@/lib/store"

// interface UpdateOrderDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   order: Order | null
//   onUpdate: (orderId: string, updates: Partial<Order>) => void
// }

// export function UpdateOrderDialog({ open, onOpenChange, order, onUpdate }: UpdateOrderDialogProps) {
//   const [updates, setUpdates] = useState({
//     status: order?.status || 'pending',
//     progress: order?.progress || 0
//   })

//   if (!order) return null

//   const handleSubmit = () => {
//     onUpdate(order.id, updates)
//   }

//   const statusOptions = [
//     { value: 'pending', label: 'Pending' },
//     { value: 'designing', label: 'Designing' },
//     { value: 'making', label: 'Making' },
//     { value: 'polishing', label: 'Polishing' }
//   ]

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Update Order Progress</DialogTitle>
//           <DialogDescription>
//             Update the status and progress of order {order.id}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Status Selection */}
//           <div className="space-y-3">
//             <Label>Order Status</Label>
//             <Select 
//               value={updates.status} 
//               onValueChange={(value: Order['status']) => 
//                 setUpdates(prev => ({ ...prev, status: value }))
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 {statusOptions.map(option => (
//                   <SelectItem key={option.value} value={option.value}>
//                     {option.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Progress Slider */}
//           <div className="space-y-4">
//             <div className="flex justify-between">
//               <Label>Production Progress</Label>
//               <span className="text-sm font-medium">{updates.progress}%</span>
//             </div>
//             <Slider
//               value={[updates.progress]}
//               onValueChange={(value) => setUpdates(prev => ({ ...prev, progress: value[0] }))}
//               max={100}
//               step={5}
//               className="w-full"
//             />
//             <div className="flex justify-between text-xs text-slate-500">
//               <span>0%</span>
//               <span>25%</span>
//               <span>50%</span>
//               <span>75%</span>
//               <span>100%</span>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4">
//             <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button className="flex-1" onClick={handleSubmit}>
//               Update Order
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }



"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Order } from "@/lib/store"
import { toast } from "sonner"

interface UpdateOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onUpdate: (orderId: string, updates: Partial<Order>) => void
}

export function UpdateOrderDialog({ open, onOpenChange, order, onUpdate }: UpdateOrderDialogProps) {
  const [updates, setUpdates] = useState({
    status: order?.status || 'pending',
    progress: order?.progress || 0
  })

  if (!order) return null

  const handleSubmit = () => {
    onUpdate(order.id, updates)
    
    // Show success toast using Sonner
    toast.success("Order Updated Successfully", {
      description: `Order ${order.id} has been updated to ${getStatusLabel(updates.status)} with ${updates.progress}% progress.`,
      duration: 3000,
    })
    
    onOpenChange(false)
  }

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'designing': return 'Designing'
      case 'making': return 'Making'
      case 'polishing': return 'Polishing'
      case 'completed': return 'Completed'
      case 'delivered': return 'Delivered'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'designing', label: 'Designing' },
    { value: 'making', label: 'Making' },
    { value: 'polishing', label: 'Polishing' }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md w-full mx-2">
        <DialogHeader className="px-1 sm:px-0">
          <DialogTitle className="text-lg sm:text-xl">Update Order Progress</DialogTitle>
          <DialogDescription className="text-sm">
            Update the status and progress of order <span className="font-mono text-blue-600">{order.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-1 sm:px-0">
          {/* Customer Info */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Customer:</span>
              <span className="text-sm text-slate-900 font-medium truncate ml-2">{order.customer}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-slate-600">Items:</span>
              <span className="text-xs text-slate-700 text-right truncate ml-2">{order.items}</span>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Order Status</Label>
            <Select 
              value={updates.status} 
              onValueChange={(value: Order['status']) => 
                setUpdates(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Progress Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Production Progress</Label>
              <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-md min-w-12 text-center">
                {updates.progress}%
              </span>
            </div>
            <Slider
              value={[updates.progress]}
              onValueChange={(value) => setUpdates(prev => ({ ...prev, progress: value[0] }))}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 px-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Current vs Updated Preview */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-center">
              <span className="text-xs font-medium text-amber-700 block mb-1">Current</span>
              <div className="text-xs text-amber-800">
                <div>{getStatusLabel(order.status)}</div>
                <div className="font-semibold">{order.progress}%</div>
              </div>
            </div>
            <div className="text-center">
              <span className="text-xs font-medium text-green-700 block mb-1">Updated</span>
              <div className="text-xs text-green-800">
                <div>{getStatusLabel(updates.status)}</div>
                <div className="font-semibold">{updates.progress}%</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 order-2 sm:order-1" 
              onClick={() => onOpenChange(false)}
              size="sm"
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 order-1 sm:order-2 gap-2" 
              onClick={handleSubmit}
              size="sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Update Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}