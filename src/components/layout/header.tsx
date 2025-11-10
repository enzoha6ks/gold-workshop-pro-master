"use client"

import { MobileNav } from "./mobile-nav"

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-white px-6 md:px-8">
      <MobileNav />
      
      {/* Page Title - You can make this dynamic later */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
          <span>🏦</span>
          <span className="font-medium"></span>
        </div>
      </div>
    </header>
  )
}