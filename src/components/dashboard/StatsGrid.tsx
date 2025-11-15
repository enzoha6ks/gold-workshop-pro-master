"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsGrid({ goldStock, totalLoss }: { goldStock: any, totalLoss: number }) {
  const [showGoldStock, setShowGoldStock] = useState(false)

  return (
    <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {/* Gold Stock Card with Eye Button */}
      <div className="relative w-full">
        <Card className="w-full h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Gold Stock</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-8 sm:w-8"
              onClick={() => setShowGoldStock(!showGoldStock)}
            >
              {showGoldStock ? 
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" /> : 
                <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
              }
            </Button>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">
              {showGoldStock ? `${goldStock.pureGoldWeight.toFixed(2)}g` : '•••••'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {showGoldStock ? '999 Pure Gold' : 'Click eye to view'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}