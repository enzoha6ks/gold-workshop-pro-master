"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// In create-order-dialog.tsx, order-details-dialog.tsx, update-order-dialog.tsx
import { Order } from "@/lib/store"
import { toast } from "sonner"

interface CreateOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (order: Omit<Order, 'id' | 'createdAt' | 'progress'>) => void
}

export function CreateOrderDialog({ open, onOpenChange, onCreate }: CreateOrderDialogProps) {
  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    items: "",
    goldWeight: "",
    purity: "22",
    makingCharges: "",
    deadline: "",
    notes: "",
    status: "pending" as Order['status']
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customer || !formData.items || !formData.goldWeight || !formData.deadline) {
      toast.error("Please fill all required fields")
      return
    }

    const orderData = {
      customer: formData.customer,
      phone: formData.phone,
      items: formData.items,
      goldWeight: parseFloat(formData.goldWeight),
      purity: parseInt(formData.purity),
      makingCharges: parseFloat(formData.makingCharges) || 0,
      deadline: formData.deadline,
      status: formData.status,
      notes: formData.notes
    }

    onCreate(orderData)
    toast.success("Order created successfully!")
    
    // Reset form
    setFormData({
      customer: "",
      phone: "",
      items: "",
      goldWeight: "",
      purity: "22",
      makingCharges: "",
      deadline: "",
      notes: "",
      status: "pending"
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Add a new customer order to the production queue
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name *</Label>
              <Input
                id="customer"
                placeholder="Enter customer name"
                value={formData.customer}
                onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="items">Order Items *</Label>
            <Input
              id="items"
              placeholder="e.g., 22K Necklace Set, Wedding Ring"
              value={formData.items}
              onChange={(e) => setFormData(prev => ({ ...prev, items: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goldWeight">Gold Weight (g) *</Label>
              <Input
                id="goldWeight"
                type="number"
                step="0.001"
                placeholder="0.000"
                value={formData.goldWeight}
                onChange={(e) => setFormData(prev => ({ ...prev, goldWeight: e.target.value }))}
              />
            </div>

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
                  <SelectItem value="24">24K (995)</SelectItem>
                  <SelectItem value="22">22K (917)</SelectItem>
                  <SelectItem value="21">21K (875)</SelectItem>
                  <SelectItem value="18">18K (750)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="makingCharges">Making Charges (₹)</Label>
            <Input
              id="makingCharges"
              type="number"
              placeholder="0"
              value={formData.makingCharges}
              onChange={(e) => setFormData(prev => ({ ...prev, makingCharges: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Delivery Deadline *</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Special instructions, design details..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}