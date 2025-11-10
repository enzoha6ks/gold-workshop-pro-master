"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export function StatsGrid({ goldStock, totalLoss }: { goldStock: any, totalLoss: number }) {
  const [showGoldStock, setShowGoldStock] = useState(false)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Gold Stock Card with Eye Button */}
      <div className="relative">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gold Stock</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowGoldStock(!showGoldStock)}
            >
              {showGoldStock ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showGoldStock ? `${goldStock.pureGoldWeight.toFixed(2)}g` : '•••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              {showGoldStock ? '999 Pure Gold' : 'Click eye to view'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Other cards remain same */}
    </div>
  )
}