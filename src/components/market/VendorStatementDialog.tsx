// src/components/market/VendorStatementDialog.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/lib/store";
import { calculateVendorStatement, normalizeVendorName } from "@/lib/statement-utils";
import { VendorStatementPDF } from "./VendorStatementPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

interface VendorStatementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorName: string;
}

export function VendorStatementDialog({ open, onOpenChange, vendorName }: VendorStatementDialogProps) {
  const { marketTransactions, orders, cashTransactions } = useAppStore();
  const [statement, setStatement] = useState<any>(null);
  
  useEffect(() => {
    if (open && vendorName) {
      const normalizedVendor = normalizeVendorName(vendorName);
      
      // Filter market transactions for this vendor
      const vendorMarketTxs = marketTransactions.filter(t => 
        normalizeVendorName(t.vendor) === normalizedVendor
      );
      
      // Filter orders for this vendor
      const vendorOrders = orders.filter(o => 
        normalizeVendorName(o.customer) === normalizedVendor
      );
      
      // Filter cash transactions for this vendor
      const vendorCashTxs = cashTransactions.filter(c => 
        normalizeVendorName(c.vendorName) === normalizedVendor
      );
      
      // Calculate statement
      const result = calculateVendorStatement(vendorMarketTxs, vendorOrders, vendorCashTxs);
      setStatement(result);
    }
  }, [open, vendorName, marketTransactions, orders, cashTransactions]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Account Statement - {vendorName}</DialogTitle>
          <DialogDescription>
            Period: {statement?.dateFrom || "---"} to {statement?.dateTo || "---"}
          </DialogDescription>
        </DialogHeader>
        
        {statement && statement.data.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Total Gold Balance</p>
                <p className="text-2xl font-bold">
                  {statement.totalGold.toFixed(3)} g
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    {statement.totalGold > 0 ? "(Vendor owes you)" : statement.totalGold < 0 ? "(You owe vendor)" : "(Settled)"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cash Balance</p>
                <p className="text-2xl font-bold">
                  {statement.totalCash.toFixed(3)} KWD
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    {statement.totalCash > 0 ? "(Vendor owes you)" : statement.totalCash < 0 ? "(You owe vendor)" : "(Settled)"}
                  </span>
                </p>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="text-right w-[100px]">Gold (g)</TableHead>
                  <TableHead className="text-right w-[100px]">Gold Balance</TableHead>
                  <TableHead className="text-right w-[100px]">Cash (KD)</TableHead>
                  <TableHead className="text-right w-[100px]">Cash Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statement.data.map((item: any, index: number) => (
                  <TableRow key={index} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-xs">
                      {item.date.toLocaleDateString('en-GB')}
                    </TableCell>
                    <TableCell className="text-sm">{item.narration}</TableCell>
                    <TableCell className="text-right font-mono">
                      {item.goldDebit > 0 && (
                        <span className="text-red-600">-{item.goldDebit.toFixed(3)}</span>
                      )}
                      {item.goldCredit > 0 && (
                        <span className="text-green-600">+{item.goldCredit.toFixed(3)}</span>
                      )}
                      {item.goldDebit === 0 && item.goldCredit === 0 && '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {item.runningGold.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.cashCredit > 0 && (
                        <span className="text-red-600">+{item.cashCredit.toFixed(3)}</span>
                      )}
                      {item.cashDebit > 0 && (
                        <span className="text-green-600">-{item.cashDebit.toFixed(3)}</span>
                      )}
                      {item.cashDebit === 0 && item.cashCredit === 0 && '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {item.runningKWD?.toFixed(3) ?? item.runningCash?.toFixed(3)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex justify-end mt-4">
              <PDFDownloadLink
                document={
                  <VendorStatementPDF
                    vendorName={vendorName}
                    statement={statement}
                    dateFrom={statement?.dateFrom}
                    dateTo={statement?.dateTo}
                  />
                }
                fileName={`${vendorName}-statement-${new Date().toISOString().split('T')[0]}.pdf`}
              >
                {({ loading }) => (
                  <Button
                    disabled={loading}
                    className="gap-2 bg-slate-800 hover:bg-slate-700"
                  >
                    {loading ? "Generating PDF..." : "Download PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found for {vendorName}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}