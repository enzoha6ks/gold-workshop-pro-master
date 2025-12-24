


"use client"

import { MobileNav } from "./mobile-nav"
import { useTheme } from "@/contexts/theme-provider"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 px-6 md:px-8">
      <MobileNav />
      
      {/* Page Title - You can make this dynamic later */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">👩‍💻</h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="text-gray-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
          <span>🏦</span>
          <span className="font-medium"></span>
        </div>
      </div>
    </header>
  )
}