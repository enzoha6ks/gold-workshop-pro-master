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
//   Gem,
//   Receipt,
//   Flame
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: Home, badge: null },
//   { name: "Gold Safe", href: "/gold-safe", icon: Database, badge: null },
//   { name: "Workers", href: "/workers", icon: Users, badge: null },
//   { name: "Market", href: "/market", icon: TrendingUp, badge: null },
//   { name: "Orders", href: "/orders", icon: Package, badge: null },  
//   { name: "Melting", href: "/melting", icon: Flame, badge: null },
//   { name: "Reports", href: "/reports", icon: BarChart3, badge: "New" },
//   { name: "Invoices", href: "/Invoice", icon: Receipt, badge: null },
//   { name: "Settings", href: "/settings", icon: Settings, badge: null },
// ]

// export function Sidebar() {
//   const pathname = usePathname()

//   return (
//     <div className="flex h-full flex-col bg-slate-950 dark:bg-slate-900 border-r border-slate-800 dark:border-slate-800 text-slate-200 dark:text-slate-200 w-64">
//       {/* Logo Section - Elegant & Professional */}
//       <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 dark:border-slate-700 bg-slate-900/50 dark:bg-slate-800/50">
//         <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 rounded-xl flex items-center justify-center shadow-lg border border-slate-700 dark:border-slate-600">
//           <Gem className="w-5 h-5 text-slate-300 dark:text-slate-200" />
//         </div>
//         <div>
//           <h1 className="font-semibold text-lg tracking-tight text-white dark:text-white">BARKAT AL KHAIR</h1>
//           <p className="text-xs text-slate-400 dark:text-slate-300">Enterprise Manager</p>
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
//                 "w-full justify-start h-11 px-3 text-slate-400 dark:text-slate-400 hover:text-white dark:hover:text-white hover:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-all duration-200 border border-transparent",
//                 isActive && "bg-blue-600/20 dark:bg-blue-600/30 text-white dark:text-white border-blue-500/30 dark:border-blue-400/30 shadow-sm font-medium"
//               )}
//             >
//               <Link href={item.href}>
//                 <Icon className={cn(
//                   "w-4 h-4 mr-3 transition-colors",
//                   isActive ? "text-blue-400 dark:text-blue-300" : "text-slate-500 dark:text-slate-400"
//                 )} />
//                 <span className="flex-1 text-left text-sm">{item.name}</span>
//                 {item.badge && (
//                   <Badge 
//                     variant="secondary" 
//                     className={cn(
//                       "ml-2 text-xs bg-slate-800 dark:bg-slate-700 text-slate-300 dark:text-slate-200 border-slate-700 dark:border-slate-600",
//                       isActive && "bg-blue-500/20 dark:bg-blue-400/20 text-blue-300 dark:text-blue-200 border-blue-500/30 dark:border-blue-400/30"
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

//       <Separator className="bg-slate-800 dark:bg-slate-700" />

//       <Separator className="bg-slate-800 dark:bg-slate-700" />

//       {/* User Profile - Elegant */}
//       <div className="p-4">
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center border border-slate-700 dark:border-slate-600 shadow-sm">
//             <span className="text-sm font-medium text-slate-300 dark:text-slate-200">AM</span>
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-white dark:text-white truncate">Admin Manager</p>
//             <p className="text-xs text-slate-400 dark:text-slate-300 truncate"></p>
//           </div>
//           <Button
//             asChild
//             variant="ghost"
//             size="icon"
//             className="w-8 h-8 text-slate-400 dark:text-slate-400 hover:text-white dark:hover:text-white hover:bg-slate-800/50 dark:hover:bg-slate-700/50 border border-slate-800 dark:border-slate-700"
//           >
//             <Link href="/settings">
//               <Settings className="w-4 h-4" />
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
  Flame,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, badge: null },
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
  const router = useRouter()
  const [userData, setUserData] = useState({ orgName: "Loading...", userName: "Admin" })

  // Fetch real User and Organization data
  useEffect(() => {
    // 1. Don't fetch if we are on login or signup pages
    const publicPages = ['/login', '/signup', '/'];
    if (publicPages.includes(pathname)) return;

    async function getProfile() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setUserData(data)
        } else if (res.status === 401) {
          // If the token is invalid or expired, kick to login
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }
    getProfile()
  }, [pathname, router]); // Added pathname here so it re-checks when you move pages

  // Logout Function
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) {
        toast.success("Logged out successfully")
        router.push("/login")
        router.refresh()
      }

    } catch (error) {
      toast.error("Logout failed")
    }
  }

  return (
    <div className="flex h-full flex-col bg-slate-950 dark:bg-slate-900 border-r border-slate-800 dark:border-slate-800 text-slate-200 dark:text-slate-200 w-64">

      {/* Logo Section - Dynamic Organization Name */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 dark:border-slate-700 bg-slate-900/50 dark:bg-slate-800/50">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 rounded-xl flex items-center justify-center shadow-lg border border-slate-700 dark:border-slate-600">
          <Gem className="w-5 h-5 text-slate-300 dark:text-slate-200" />
        </div>
        <div className="min-w-0">
          <h1 className="font-semibold text-sm tracking-tight text-white dark:text-white uppercase truncate">
            {userData.orgName}
          </h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-300 uppercase tracking-widest">Enterprise Manager</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
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

      {/* User Profile & Logout - Functional */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center border border-blue-500 shadow-sm">
            <span className="text-xs font-bold text-white">
              {userData.userName.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userData.userName}</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Administrator</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-950/20 group transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3 group-hover:rotate-12 transition-transform" />
          <span className="text-sm">Logout Session</span>
        </Button>
      </div>
    </div>
  )
}