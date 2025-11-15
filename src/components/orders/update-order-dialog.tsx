"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
// In create-order-dialog.tsx, order-details-dialog.tsx, update-order-dialog.tsx
import { Order } from "@/lib/store"

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
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'designing', label: 'Designing' },
    { value: 'making', label: 'Making' },
    { value: 'polishing', label: 'Polishing' }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order Progress</DialogTitle>
          <DialogDescription>
            Update the status and progress of order {order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Selection */}
          <div className="space-y-3">
            <Label>Order Status</Label>
            <Select 
              value={updates.status} 
              onValueChange={(value: Order['status']) => 
                setUpdates(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Progress Slider */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Production Progress</Label>
              <span className="text-sm font-medium">{updates.progress}%</span>
            </div>
            <Slider
              value={[updates.progress]}
              onValueChange={(value) => setUpdates(prev => ({ ...prev, progress: value[0] }))}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              Update Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}