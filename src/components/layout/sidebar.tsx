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
  Gem // <-- Add this
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Flame } from "lucide-react" // Add this import


const navigation = [
  { name: "Dashboard", href: "/", icon: Home, badge: null },
  { name: "Gold Safe", href: "/gold-safe", icon: Database, badge: "00 kg" },
  { name: "Workers", href: "/workers", icon: Users, badge: "14" },
  { name: "Market", href: "/market", icon: TrendingUp, badge: null }, // Use TrendingUp for Market  
  { name: "Orders", href: "/orders", icon: Package, badge: "23" },  
  { name: "Melting", href: "/melting", icon: Flame, badge: null },
  { name: "Reports", href: "/reports", icon: BarChart3, badge: "New" },
  { name: "Settings", href: "/settings", icon: Settings, badge: null },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-slate-950 border-r border-slate-800 text-slate-200 w-64">
      {/* Logo Section - Elegant & Professional */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 bg-slate-900/50">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg border border-slate-700">
          <Gem className="w-5 h-5 text-slate-300" />
        </div>
        <div>
          <h1 className="font-semibold text-lg tracking-tight text-white">BARKAT AL KHAIR</h1>
          <p className="text-xs text-slate-400">Enterprise Manager</p>
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
                "w-full justify-start h-11 px-3 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200 border border-transparent",
                isActive && "bg-blue-600/20 text-white border-blue-500/30 shadow-sm font-medium"
              )}
            >
              <Link href={item.href}>
                <Icon className={cn(
                  "w-4 h-4 mr-3 transition-colors",
                  isActive ? "text-blue-400" : "text-slate-500"
                )} />
                <span className="flex-1 text-left text-sm">{item.name}</span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "ml-2 text-xs bg-slate-800 text-slate-300 border-slate-700",
                      isActive && "bg-blue-500/20 text-blue-300 border-blue-500/30"
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

      <Separator className="bg-slate-800" />

      {/* Quick Stats - Professional */}
      <div className="p-4 space-y-3 bg-slate-900/30 m-3 rounded-lg border border-slate-800">
        <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
          Today's Summary
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Gold Issued</span>
            <span className="text-emerald-400 font-medium">450g</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Material Loss</span>
            <span className="text-rose-400 font-medium">8.2g</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Efficiency</span>
            <span className="text-blue-400 font-medium">98.2%</span>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-800" />

      {/* User Profile - Elegant */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-sm">
            <span className="text-sm font-medium text-slate-300">AM</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin Manager</p>
            <p className="text-xs text-slate-400 truncate"></p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-slate-400 hover:text-white hover:bg-slate-800/50 border border-slate-800"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}