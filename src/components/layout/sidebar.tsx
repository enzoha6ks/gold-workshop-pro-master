// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { 
//   Home,
//   Package, 
//   Database, 
//   Users, 
//   BarChart3, 
//   Settings,
//   TrendingUp,
//   Gem ,
//   Receipt
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"
// import { Flame } from "lucide-react" // Add this import


// const navigation = [
//   { name: "Dashboard", href: "/", icon: Home, badge: null },
//   { name: "Gold Safe", href: "/gold-safe", icon: Database, badge: null },
//   { name: "Workers", href: "/workers", icon: Users, badge: null },
//   { name: "Market", href: "/market", icon: TrendingUp, badge: null }, // Use TrendingUp for Market  
//   { name: "Orders", href: "/orders", icon: Package, badge: null },  
//   { name: "Melting", href: "/melting", icon: Flame, badge: null },
//   { name: "Reports", href: "/reports", icon: BarChart3, badge: "New" },
//   { name: "Invoices", href: "/Invoice", icon: Receipt, badge: null },
//   { name: "Settings", href: "/settings", icon: Settings, badge: null },
// ]

// export function Sidebar() {
//   const pathname = usePathname()

//   return (
//     <div className="flex h-full flex-col bg-slate-950 border-r border-slate-800 text-slate-200 w-64">
//       {/* Logo Section - Elegant & Professional */}
//       <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 bg-slate-900/50">
//         <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg border border-slate-700">
//           <Gem className="w-5 h-5 text-slate-300" />
//         </div>
//         <div>
//           <h1 className="font-semibold text-lg tracking-tight text-white">BARKAT AL KHAIR</h1>
//           <p className="text-xs text-slate-400">Enterprise Manager</p>
//         </div>
//       </div>

//       {/* Navigation Section - Sophisticated */}
//       <div className="flex-1 px-3 py-6 space-y-1">
//         {navigation.map((item) => {
//           const isActive = pathname === item.href
//           const Icon = item.icon
          
//           return (
//             <Button
//               key={item.name}
//               asChild
//               variant="ghost"
//               className={cn(
//                 "w-full justify-start h-11 px-3 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200 border border-transparent",
//                 isActive && "bg-blue-600/20 text-white border-blue-500/30 shadow-sm font-medium"
//               )}
//             >
//               <Link href={item.href}>
//                 <Icon className={cn(
//                   "w-4 h-4 mr-3 transition-colors",
//                   isActive ? "text-blue-400" : "text-slate-500"
//                 )} />
//                 <span className="flex-1 text-left text-sm">{item.name}</span>
//                 {item.badge && (
//                   <Badge 
//                     variant="secondary" 
//                     className={cn(
//                       "ml-2 text-xs bg-slate-800 text-slate-300 border-slate-700",
//                       isActive && "bg-blue-500/20 text-blue-300 border-blue-500/30"
//                     )}
//                   >
//                     {item.badge}
//                   </Badge>
//                 )}
//               </Link>
//             </Button>
//           )
//         })}
//       </div>

//       <Separator className="bg-slate-800" />

      

//       <Separator className="bg-slate-800" />

//       {/* User Profile - Elegant */}
//       <div className="p-4">
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-sm">
//             <span className="text-sm font-medium text-slate-300">AM</span>
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-white truncate">Admin Manager</p>
//             <p className="text-xs text-slate-400 truncate"></p>
//           </div>
//           <Button
         
//             variant="ghost"
//             size="icon"
//             className="w-8 h-8 text-slate-400 hover:text-white hover:bg-slate-800/50 border border-slate-800"
//           >
//             <Settings  className="w-4 h-4" / >
            
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home,
  Package, 
  Database, 
  Users, 
  BarChart3, 
  Settings,
  TrendingUp,
  Gem,
  Receipt,
  Flame
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, badge: null },
  { name: "Gold Safe", href: "/gold-safe", icon: Database, badge: null },
  { name: "Workers", href: "/workers", icon: Users, badge: null },
  { name: "Market", href: "/market", icon: TrendingUp, badge: null },
  { name: "Orders", href: "/orders", icon: Package, badge: null },  
  { name: "Melting", href: "/melting", icon: Flame, badge: null },
  { name: "Reports", href: "/reports", icon: BarChart3, badge: "New" },
  { name: "Invoices", href: "/Invoice", icon: Receipt, badge: null },
  { name: "Settings", href: "/settings", icon: Settings, badge: null },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-slate-950 dark:bg-slate-900 border-r border-slate-800 dark:border-slate-800 text-slate-200 dark:text-slate-200 w-64">
      {/* Logo Section - Elegant & Professional */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 dark:border-slate-700 bg-slate-900/50 dark:bg-slate-800/50">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 rounded-xl flex items-center justify-center shadow-lg border border-slate-700 dark:border-slate-600">
          <Gem className="w-5 h-5 text-slate-300 dark:text-slate-200" />
        </div>
        <div>
          <h1 className="font-semibold text-lg tracking-tight text-white dark:text-white">BARKAT AL KHAIR</h1>
          <p className="text-xs text-slate-400 dark:text-slate-300">Enterprise Manager</p>
        </div>
      </div>

      {/* Navigation Section - Sophisticated */}
      <div className="flex-1 px-3 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Button
              key={item.name}
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start h-11 px-3 text-slate-400 dark:text-slate-400 hover:text-white dark:hover:text-white hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-all duration-200 border border-transparent",
                isActive && "bg-blue-600/20 dark:bg-blue-600/30 text-white dark:text-white border-blue-500/30 dark:border-blue-400/30 shadow-sm font-medium"
              )}
            >
              <Link href={item.href}>
                <Icon className={cn(
                  "w-4 h-4 mr-3 transition-colors",
                  isActive ? "text-blue-400 dark:text-blue-300" : "text-slate-500 dark:text-slate-400"
                )} />
                <span className="flex-1 text-left text-sm">{item.name}</span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "ml-2 text-xs bg-slate-800 dark:bg-slate-700 text-slate-300 dark:text-slate-200 border-slate-700 dark:border-slate-600",
                      isActive && "bg-blue-500/20 dark:bg-blue-400/20 text-blue-300 dark:text-blue-200 border-blue-500/30 dark:border-blue-400/30"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </Button>
          )
        })}
      </div>

      <Separator className="bg-slate-800 dark:bg-slate-700" />

      <Separator className="bg-slate-800 dark:bg-slate-700" />

      {/* User Profile - Elegant */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center border border-slate-700 dark:border-slate-600 shadow-sm">
            <span className="text-sm font-medium text-slate-300 dark:text-slate-200">AM</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white dark:text-white truncate">Admin Manager</p>
            <p className="text-xs text-slate-400 dark:text-slate-300 truncate"></p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-slate-400 dark:text-slate-400 hover:text-white dark:hover:text-white hover:bg-slate-800/50 dark:hover:bg-slate-700/50 border border-slate-800 dark:border-slate-700"
          >
            <Link href="/settings">
              <Settings className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}