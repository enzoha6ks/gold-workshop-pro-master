


// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Plus, Package, Clock, CheckCircle, TrendingUp, Eye, Edit, Truck } from "lucide-react"
// import { CreateOrderDialog } from "@/components/orders/create-order-dialog"
// import { OrderDetailsDialog } from "@/components/orders/order-details-dialog"
// import { UpdateOrderDialog } from "@/components/orders/update-order-dialog"
// import { useAppStore, Order } from "@/lib/store"

// export default function OrdersPage() {
//   const [activeTab, setActiveTab] = useState("active")
//   const [showCreateDialog, setShowCreateDialog] = useState(false)
//   const [showDetailsDialog, setShowDetailsDialog] = useState(false)
//   const [showUpdateDialog, setShowUpdateDialog] = useState(false)
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

//   // Use Zustand store for orders
//   const {
//     orders,
//     addOrder,
//     updateOrder,
//     completeOrder,
//     deliverOrder,
//     getTotalRevenue,
//     getActiveOrders,
//     getCompletedOrders
//   } = useAppStore()

//   // Order actions
//   const handleCreateOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'progress'>) => {
//     const newOrder: Order = {
//       ...orderData,
//       id: `ORD-${Date.now().toString().slice(-4)}`,
//       createdAt: new Date().toISOString(),
//       progress: 0
//     }
//     addOrder(newOrder)
//     setShowCreateDialog(false)
//   }

//   const handleViewDetails = (order: Order) => {
//     setSelectedOrder(order)
//     setShowDetailsDialog(true)
//   }

//   const handleUpdateProgress = (order: Order) => {
//     setSelectedOrder(order)
//     setShowUpdateDialog(true)
//   }

//   // Filter orders based on active tab
//   const filteredOrders = orders.filter(order => {
//     switch (activeTab) {
//       case 'active':
//         return ['pending', 'designing', 'making', 'polishing'].includes(order.status)
//       case 'completed':
//         return ['completed', 'delivered'].includes(order.status)
//       case 'pending':
//         return order.status === 'pending'
//       case 'all':
//         return true
//       default:
//         return true
//     }
//   })

//   // Calculate stats using store functions
//   const totalOrders = orders.length
//   const activeOrders = getActiveOrders().length
//   const completedOrders = getCompletedOrders().length
//   const totalRevenue = getTotalRevenue()

//   // Format KWD currency - FIXED VERSION
//   const formatKWD = (amount: number) => {
//     return `KWD ${amount.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
//   }

//   const formatKWDShort = (amount: number) => {
//     return `KWD ${amount.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
//   }

//   const getStatusColor = (status: Order['status']) => {
//     switch (status) {
//       case 'pending': return 'bg-amber-100 text-amber-800'
//       case 'designing': return 'bg-blue-100 text-blue-800'
//       case 'making': return 'bg-purple-100 text-purple-800'
//       case 'polishing': return 'bg-indigo-100 text-indigo-800'
//       case 'completed': return 'bg-green-100 text-green-800'
//       case 'delivered': return 'bg-emerald-100 text-emerald-800'
//       case 'cancelled': return 'bg-rose-100 text-rose-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getStatusLabel = (status: Order['status']) => {
//     switch (status) {
//       case 'pending': return 'Pending'
//       case 'designing': return 'Designing'
//       case 'making': return 'Making'
//       case 'polishing': return 'Polishing'
//       case 'completed': return 'Completed'
//       case 'delivered': return 'Delivered'
//       case 'cancelled': return 'Cancelled'
//       default: return status
//     }
//   }

//   const getProgressColor = (progress: number) => {
//     if (progress < 30) return 'bg-rose-500'
//     if (progress < 70) return 'bg-amber-500'
//     return 'bg-green-500'
//   }

//   return (
//     <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-x-hidden">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
//       >
//         <div className="w-full sm:w-auto">
//           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 break-words">Orders Management</h1>
//           <p className="text-slate-600 mt-1 text-sm sm:text-base">Track customer orders and production workflow</p>
//         </div>
//         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto mt-2 sm:mt-0">
//           <Button
//             className="gap-2 w-full sm:w-auto"
//             onClick={() => setShowCreateDialog(true)}
//             size="sm"
//           >
//             <Plus className="w-4 h-4" />
//             New Order
//           </Button>
//         </motion.div>
//       </motion.div>

//       {/* Stats - More Compact */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//         {[
//           {
//             title: "Total Orders",
//             value: totalOrders.toString(),
//             icon: Package,
//             color: "text-blue-600",
//             description: "All time"
//           },
//           {
//             title: "Active",
//             value: activeOrders.toString(),
//             icon: Clock,
//             color: "text-amber-600",
//             description: "In production"
//           },
//           {
//             title: "Completed",
//             value: completedOrders.toString(),
//             icon: CheckCircle,
//             color: "text-emerald-600",
//             description: "Delivered"
//           },
//           {
//             title: "Revenue",
//             value: formatKWDShort(totalRevenue),
//             icon: TrendingUp,
//             color: "text-green-600",
//             description: "Total revenue"
//           },
//         ].map((stat, index) => (
//           <motion.div key={index} whileHover={{ scale: 1.02 }} className="w-full">
//             <Card className="w-full h-full shadow-sm">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
//                 <CardTitle className="text-xs font-medium">{stat.title}</CardTitle>
//                 <stat.icon className={`w-4 h-4 ${stat.color}`} />
//               </CardHeader>
//               <CardContent className="p-3 sm:p-4 pt-0">
//                 <div className={`text-lg font-bold ${stat.color} break-words`}>
//                   {stat.value}
//                 </div>
//                 <p className="text-xs text-slate-500">{stat.description}</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//         <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
//           <TabsTrigger value="active" className="text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4 break-words">
//             Active ({activeOrders})
//           </TabsTrigger>
//           <TabsTrigger value="completed" className="text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4 break-words">
//             Completed ({completedOrders})
//           </TabsTrigger>
//           <TabsTrigger value="pending" className="text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4 break-words">
//             Pending
//           </TabsTrigger>
//           <TabsTrigger value="all" className="text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4 break-words">
//             All ({totalOrders})
//           </TabsTrigger>
//         </TabsList>

//         {/* Active Orders Tab */}
//         <TabsContent value="active" className="space-y-4">
//           <Card>
//             <CardHeader className="p-4 sm:p-6 pb-3">
//               <CardTitle className="text-lg sm:text-xl">Active Orders</CardTitle>
//               <CardDescription>Orders currently in production</CardDescription>
//             </CardHeader>
//             <CardContent className="p-4 sm:p-6 pt-0">
//               {filteredOrders.length === 0 ? (
//                 <div className="text-center py-8 sm:py-12">
//                   <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
//                   <h3 className="text-base sm:text-lg font-medium text-gray-900">No active orders</h3>
//                   <p className="text-gray-500 mt-1 text-sm sm:text-base">Create your first order to get started</p>
//                   <Button
//                     onClick={() => setShowCreateDialog(true)}
//                     className="mt-3 sm:mt-4 gap-2"
//                     size="sm"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Create Order
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-3 sm:space-y-4">
//                   {filteredOrders.map((order) => (
//                     <motion.div
//                       key={order.id}
//                       whileHover={{ scale: 1.01 }}
//                       className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-3 sm:gap-4"
//                     >
//                       <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
//                         <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs shrink-0">
//                           {order.id}
//                         </Badge>
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-sm sm:text-base truncate">{order.customer}</p>
//                           <p className="text-xs text-slate-500 truncate">
//                             {order.items} • {order.goldWeight}g {order.purity}K
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
//                         <Badge className={`${getStatusColor(order.status)} text-xs`}>
//                           {getStatusLabel(order.status)}
//                         </Badge>
//                         <div className="flex items-center gap-2 w-full sm:w-auto">
//                           <div className="w-16 sm:w-24 bg-slate-200 rounded-full h-2 flex-1">
//                             <div
//                               className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(order.progress)}`}
//                               style={{ width: `${order.progress}%` }}
//                             />
//                           </div>
//                           <span className="text-xs text-slate-500 w-6 sm:w-8 text-right">{order.progress}%</span>
//                         </div>
//                         <span className="text-xs text-slate-500 hidden sm:block">{order.deadline}</span>
//                         <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleViewDetails(order)}
//                             className="h-8 w-8 p-0"
//                           >
//                             <Eye className="w-3 h-3" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleUpdateProgress(order)}
//                             className="h-8 w-8 p-0"
//                           >
//                             <Edit className="w-3 h-3" />
//                           </Button>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Completed Orders Tab */}
//         <TabsContent value="completed" className="space-y-4">
//           <Card>
//             <CardHeader className="p-4 sm:p-6 pb-3">
//               <CardTitle className="text-lg sm:text-xl">Completed Orders</CardTitle>
//               <CardDescription>Successfully delivered orders</CardDescription>
//             </CardHeader>
//             <CardContent className="p-4 sm:p-6 pt-0">
//               {filteredOrders.length === 0 ? (
//                 <div className="text-center py-8 sm:py-12">
//                   <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
//                   <h3 className="text-base sm:text-lg font-medium text-gray-900">No completed orders</h3>
//                   <p className="text-gray-500 mt-1 text-sm sm:text-base">Completed orders will appear here</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3 sm:space-y-4">
//                   {filteredOrders.map((order) => (
//                     <motion.div
//                       key={order.id}
//                       whileHover={{ scale: 1.01 }}
//                       className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-3 sm:gap-4"
//                     >
//                       <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
//                         <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs shrink-0">
//                           {order.id}
//                         </Badge>
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-sm sm:text-base truncate">{order.customer}</p>
//                           <p className="text-xs text-slate-500 truncate">
//                             {order.items} • {order.goldWeight}g {order.purity}K
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
//                         <Badge className={`${getStatusColor(order.status)} text-xs`}>
//                           {getStatusLabel(order.status)}
//                         </Badge>
//                         <span className="text-xs text-slate-500">
//                           {order.completedAt ? new Date(order.completedAt).toLocaleDateString() : 'N/A'}
//                         </span>
//                         <span className="font-medium text-green-600 text-sm sm:text-base">
//                           {order.revenue ? formatKWD(order.revenue) : 'N/A'}
//                         </span>
//                         <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleViewDetails(order)}
//                             className="h-8 w-8 p-0"
//                           >
//                             <Eye className="w-3 h-3" />
//                           </Button>
//                           {order.status === 'completed' && (
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => deliverOrder(order.id)}
//                               className="h-8 w-8 p-0"
//                             >
//                               <Truck className="w-3 h-3" />
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* All Orders Tab */}
//         <TabsContent value="all" className="space-y-4">
//           <Card>
//             <CardHeader className="p-4 sm:p-6 pb-3">
//               <CardTitle className="text-lg sm:text-xl">All Orders</CardTitle>
//               <CardDescription>Complete order history</CardDescription>
//             </CardHeader>
//             <CardContent className="p-4 sm:p-6 pt-0">
//               {orders.length === 0 ? (
//                 <div className="text-center py-8 sm:py-12">
//                   <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
//                   <h3 className="text-base sm:text-lg font-medium text-gray-900">No orders yet</h3>
//                   <p className="text-gray-500 mt-1 text-sm sm:text-base">Create your first order to get started</p>
//                   <Button
//                     onClick={() => setShowCreateDialog(true)}
//                     className="mt-3 sm:mt-4 gap-2"
//                     size="sm"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Create Order
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-3 sm:space-y-4">
//                   {orders.map((order) => (
//                     <motion.div
//                       key={order.id}
//                       whileHover={{ scale: 1.01 }}
//                       className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-3 sm:gap-4"
//                     >
//                       <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
//                         <Badge
//                           variant="outline"
//                           className={`text-xs shrink-0 ${order.status === 'completed' || order.status === 'delivered'
//                               ? "bg-green-50 text-green-700 border-green-200"
//                               : "bg-blue-50 text-blue-700 border-blue-200"
//                             }`}
//                         >
//                           {order.id}
//                         </Badge>
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-sm sm:text-base truncate">{order.customer}</p>
//                           <p className="text-xs text-slate-500 truncate">
//                             {order.items} • {order.goldWeight}g {order.purity}K
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
//                         <Badge className={`${getStatusColor(order.status)} text-xs`}>
//                           {getStatusLabel(order.status)}
//                         </Badge>
//                         <span className="text-xs text-slate-500">
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </span>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleViewDetails(order)}
//                           className="h-8 px-2 sm:px-3 text-xs"
//                         >
//                           <Eye className="w-3 h-3 mr-1" />
//                           Details
//                         </Button>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Dialogs */}
//       <CreateOrderDialog
//         open={showCreateDialog}
//         onOpenChange={setShowCreateDialog}
//         onCreate={handleCreateOrder}
//       />

//       <OrderDetailsDialog
//         open={showDetailsDialog}
//         onOpenChange={setShowDetailsDialog}
//         order={selectedOrder}
//         onComplete={completeOrder}
//         onDeliver={deliverOrder}
//       />

//       <UpdateOrderDialog
//         order={selectedOrder}
//         onUpdate={updateOrder} // 👈 Pass the store function here
//       />
//     </div>
//   )
// }




"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, Clock, CheckCircle, TrendingUp, Eye, Edit, Truck } from "lucide-react"
import { CreateOrderDialog } from "@/components/orders/create-order-dialog"
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog"
import { UpdateOrderDialog } from "@/components/orders/update-order-dialog"
import { useAppStore, Order } from "@/lib/store"

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Use Zustand store for orders
  const {
    orders,
    addOrder,
    updateOrder,
    completeOrder,
    deliverOrder,
    getTotalRevenue,
    getActiveOrders,
    getCompletedOrders
  } = useAppStore()

  // Order actions
  const handleCreateOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'progress'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      progress: 0
    }
    await addOrder(newOrder)
    setShowCreateDialog(false)
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailsDialog(true)
  }

  const handleUpdateProgress = (order: Order) => {
    setSelectedOrder(order)
    setShowUpdateDialog(true)
  }

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    switch (activeTab) {
      case 'active':
        return ['pending', 'designing', 'making', 'polishing'].includes(order.status)
      case 'completed':
        return ['completed', 'delivered'].includes(order.status)
      case 'pending':
        return order.status === 'pending'
      case 'all':
        return true
      default:
        return true
    }
  })

  // Calculate stats using store functions
  const totalOrders = orders.length
  const activeOrders = getActiveOrders().length
  const completedOrders = getCompletedOrders().length
  const totalRevenue = getTotalRevenue()

  // Format KWD currency - FIXED VERSION
  const formatKWD = (amount: number) => {
    return `KWD ${amount.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }

  const formatKWDShort = (amount: number) => {
    return `KWD ${amount.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800'
      case 'designing': return 'bg-blue-100 text-blue-800'
      case 'making': return 'bg-purple-100 text-purple-800'
      case 'polishing': return 'bg-indigo-100 text-indigo-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-emerald-100 text-emerald-800'
      case 'cancelled': return 'bg-rose-100 text-rose-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-rose-500'
    if (progress < 70) return 'bg-amber-500'
    return 'bg-green-500'
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
      >
        <div className="w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 break-words">Orders Management</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Track customer orders and production workflow</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto mt-2 sm:mt-0">
          <Button
            className="gap-2 w-full sm:w-auto"
            onClick={() => setShowCreateDialog(true)}
            size="sm"
          >
            <Plus className="w-4 h-4" />
            New Order
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats - More Compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            title: "Total Orders",
            value: totalOrders.toString(),
            icon: Package,
            color: "text-blue-600",
            description: "All time"
          },
          {
            title: "Active",
            value: activeOrders.toString(),
            icon: Clock,
            color: "text-amber-600",
            description: "In production"
          },
          {
            title: "Completed",
            value: completedOrders.toString(),
            icon: CheckCircle,
            color: "text-emerald-600",
            description: "Delivered"
          },
          {
            title: "Revenue",
            value: formatKWDShort(totalRevenue),
            icon: TrendingUp,
            color: "text-green-600",
            description: "Total revenue"
          },
        ].map((stat, index) => (
          <motion.div key={index} whileHover={{ scale: 1.02 }} className="w-full">
            <Card className="w-full h-full shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
                <CardTitle className="text-xs font-medium">{stat.title}</CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className={`text-lg font-bold ${stat.color} break-words`}>
                  {stat.value}
                </div>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="active" className="text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4 break-words">
            Active ({activeOrders})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4 break-words">
            Completed ({completedOrders})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4 break-words">
            Pending
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4 break-words">
            All ({totalOrders})
          </TabsTrigger>
        </TabsList>

        {/* Active Orders Tab */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-3">
              <CardTitle className="text-lg sm:text-xl">Active Orders</CardTitle>
              <CardDescription>Orders currently in production</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">No active orders</h3>
                  <p className="text-gray-500 mt-1 text-sm sm:text-base">Create your first order to get started</p>
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="mt-3 sm:mt-4 gap-2"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create Order
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {filteredOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-3 sm:gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs shrink-0">
                          {order.id}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{order.customer}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {order.items} • {order.goldWeight}g {order.purity}K
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                        <Badge className={`${getStatusColor(order.status)} text-xs`}>
                          {getStatusLabel(order.status)}
                        </Badge>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <div className="w-16 sm:w-24 bg-slate-200 rounded-full h-2 flex-1">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(order.progress)}`}
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 w-6 sm:w-8 text-right">{order.progress}%</span>
                        </div>
                        <span className="text-xs text-slate-500 hidden sm:block">{order.deadline}</span>
                        <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateProgress(order)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Orders Tab */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-3">
              <CardTitle className="text-lg sm:text-xl">Completed Orders</CardTitle>
              <CardDescription>Successfully delivered orders</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">No completed orders</h3>
                  <p className="text-gray-500 mt-1 text-sm sm:text-base">Completed orders will appear here</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {filteredOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-3 sm:gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs shrink-0">
                          {order.id}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{order.customer}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {order.items} • {order.goldWeight}g {order.purity}K
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                        <Badge className={`${getStatusColor(order.status)} text-xs`}>
                          {getStatusLabel(order.status)}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {order.completedAt ? new Date(order.completedAt).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="font-medium text-green-600 text-sm sm:text-base">
                          {order.revenue ? formatKWD(order.revenue) : 'N/A'}
                        </span>
                        <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          {order.status === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deliverOrder(order.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Truck className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Orders Tab */}
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-3">
              <CardTitle className="text-lg sm:text-xl">All Orders</CardTitle>
              <CardDescription>Complete order history</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {orders.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">No orders yet</h3>
                  <p className="text-gray-500 mt-1 text-sm sm:text-base">Create your first order to get started</p>
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="mt-3 sm:mt-4 gap-2"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create Order
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-3 sm:gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <Badge
                          variant="outline"
                          className={`text-xs shrink-0 ${order.status === 'completed' || order.status === 'delivered'
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                        >
                          {order.id}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{order.customer}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {order.items} • {order.goldWeight}g {order.purity}K
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                        <Badge className={`${getStatusColor(order.status)} text-xs`}>
                          {getStatusLabel(order.status)}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                          className="h-8 px-2 sm:px-3 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateOrderDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreate={handleCreateOrder}
      />

      <OrderDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        order={selectedOrder}
        onComplete={async (id: string, revenue?: number) => {
          await completeOrder(id, revenue)
          setShowDetailsDialog(false)
        }}
        onDeliver={async (id: string) => {
          await deliverOrder(id)
          setShowDetailsDialog(false)
        }}
      />

      <UpdateOrderDialog
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        order={selectedOrder}
        onUpdate={async (id: string, updates: Partial<Order>) => {
          await updateOrder(id, updates)
          setShowUpdateDialog(false)
        }}
      />
    </div>
  )
}

