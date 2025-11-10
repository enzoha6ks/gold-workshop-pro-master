"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// In create-order-dialog.tsx, order-details-dialog.tsx, update-order-dialog.tsx
import { Order } from "@/lib/store"
import { Calendar, User, Package, IndianRupee, Phone, FileText } from "lucide-react"

// Add this helper function at the top
const formatKWD = (amount: number) => {
  return new Intl.NumberFormat('en-KW', {
    style: 'currency',
    currency: 'KWD',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(amount)
}

interface OrderDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onComplete: (orderId: string, revenue: number) => void
  onDeliver: (orderId: string) => void
}

export function OrderDetailsDialog({ open, onOpenChange, order, onComplete, onDeliver }: OrderDetailsDialogProps) {
  const [revenue, setRevenue] = useState("")

  if (!order) return null

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'designing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'making': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'polishing': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
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

  const handleComplete = () => {
    if (!revenue) {
      alert("Please enter the revenue amount")
      return
    }
    onComplete(order.id, parseFloat(revenue))
    onOpenChange(false)
    setRevenue("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Details - {order.id}
          </DialogTitle>
          <DialogDescription>
            Complete information about this customer order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header with Status */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-slate-900">{order.customer}</h3>
              <p className="text-sm text-slate-500">Customer</p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  Customer Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Name:</span>
                  <span className="font-medium">{order.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Phone:</span>
                  <span className="font-medium">{order.phone || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Created:</span>
                  <span className="font-medium text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Deadline:</span>
                  <span className="font-medium text-sm">{order.deadline}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Specifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4" />
                Order Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Items:</span>
                <span className="font-medium text-right">{order.items}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Gold Weight:</span>
                <span className="font-medium">{order.goldWeight}g {order.purity}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Making Charges:</span>
                <span className="font-medium">₹{order.makingCharges.toLocaleString()}</span>
              </div>
              {order.revenue && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Revenue:</span>
                  <span className="font-medium text-green-600">{formatKWD(order.revenue)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Production Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${order.progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12">{order.progress}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {order.status === 'making' || order.status === 'polishing' ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Complete Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="revenue">Final Revenue (KWD)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    step="0.001"
                    placeholder="Enter final revenue amount"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                  />
                </div>
                <Button onClick={handleComplete} className="w-full">
                  <IndianRupee className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              </CardContent>
            </Card>
          ) : order.status === 'completed' ? (
            <Button onClick={() => onDeliver(order.id)} className="w-full">
              Mark as Delivered
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}