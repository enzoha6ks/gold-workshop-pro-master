// src/components/market/GlobalCashReceive.tsx
"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, CheckCircle2, User, CreditCard, Landmark, Link, Wallet } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export function GlobalCashReceive() {
    const [selectedVendor, setSelectedVendor] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [notes, setNotes] = useState("");
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get data and actions from your store
    const { getVendors, addCashTransaction, addMarketTransaction } = useAppStore();
    
    const vendors = getVendors();

    const getPaymentMethodIcon = (method: string) => {
        switch(method) {
            case "KNET":
                return <CreditCard className="w-4 h-4" />;
            case "WAMD":
                return <Landmark className="w-4 h-4" />;
            case "VIA LINK":
                return <Link className="w-4 h-4" />;
            case "CASH":
                return <Wallet className="w-4 h-4" />;
            default:
                return <Banknote className="w-4 h-4" />;
        }
    };

    const handleSave = async () => {
        if (!selectedVendor) {
            toast.error("Please select a vendor");
            return;
        }
        
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error("Please enter a valid amount (KWD)");
            return;
        }

        setIsSubmitting(true);

        try {
            const amountValue = Number(amount);
            
            // Create cash transaction in database
            await addCashTransaction({
                vendorName: selectedVendor,
                amount: amountValue,
                method: paymentMethod,
                notes: notes || `${paymentMethod} payment received from ${selectedVendor}`,
            });

            // Also create a market transaction for statement tracking
            await addMarketTransaction({
                vendor: selectedVendor,
                type: "cash",
                amount: amountValue,
                method: paymentMethod,
                notes: `${paymentMethod} payment of ${amountValue} KWD received from ${selectedVendor}`,
                date: new Date().toISOString(),
                weight: 0,
                purity: "N/A",
                pureGoldContent: 0,
                status: "completed",
            });

            toast.success(`Successfully recorded ${amountValue.toFixed(3)} KWD ${paymentMethod} payment from ${selectedVendor}`);
            
            // Reset and close
            setSelectedVendor("");
            setAmount("");
            setPaymentMethod("CASH");
            setNotes("");
            setOpen(false);
        } catch (error) {
            console.error("Error recording cash payment:", error);
            toast.error("Failed to record payment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                    <Banknote className="w-4 h-4" />
                    Receive Cash
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-700">
                        <Banknote className="w-5 h-5" />
                        Receive Cash Payment
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-5 py-4">
                    {/* Vendor Selection */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                            <User className="w-3 h-3" /> Select Vendor
                        </Label>
                        <Select onValueChange={setSelectedVendor} value={selectedVendor}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a vendor..." />
                            </SelectTrigger>
                            <SelectContent>
                                {vendors && vendors.length > 0 ? (
                                    vendors.map((vendor: string) => (
                                        <SelectItem key={vendor} value={vendor}>
                                            {vendor}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-gray-500 text-center">
                                        No vendors available
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                        {vendors?.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">
                                No vendors found. Send gold to market first to add vendors.
                            </p>
                        )}
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (Kuwaiti Dinars)</Label>
                        <div className="relative">
                            <Input
                                id="amount"
                                type="number"
                                step="0.001"
                                placeholder="0.000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-12 font-mono text-lg border-emerald-200 focus:ring-emerald-500"
                                disabled={isSubmitting}
                            />
                            <span className="absolute left-3 top-2.5 font-bold text-slate-500 text-sm">
                                KD
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Enter amount with up to 3 decimal places (e.g., 1.250)
                        </p>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                            <Banknote className="w-3 h-3" /> Payment Method
                        </Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select payment method">
                                    <div className="flex items-center gap-2">
                                        {getPaymentMethodIcon(paymentMethod)}
                                        <span>{paymentMethod}</span>
                                    </div>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="KNET">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        <span>KNET - Kuwait Net (Card Payment)</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="WAMD">
                                    <div className="flex items-center gap-2">
                                        <Landmark className="w-4 h-4" />
                                        <span>WAMD - Bank Transfer (WAMD)</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="VIA LINK">
                                    <div className="flex items-center gap-2">
                                        <Link className="w-4 h-4" />
                                        <span>VIA LINK - Payment Link</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="CASH">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-4 h-4" />
                                        <span>CASH - Physical Cash</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500 mt-1">
                            Select the payment method used for this transaction
                        </p>
                    </div>

                    {/* Optional Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Reference / Notes (Optional)</Label>
                        <Input
                            id="notes"
                            placeholder="e.g., Transaction ID, Reference number, etc."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Payment Method Preview */}
                    {paymentMethod && amount && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Payment Summary:</span>
                                <span className="font-medium">
                                    {paymentMethod} • {parseFloat(amount).toFixed(3)} KWD
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                                <span>Vendor:</span>
                                <span>{selectedVendor || "Not selected"}</span>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSave}
                        disabled={isSubmitting || !selectedVendor || !amount}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2 h-11"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {getPaymentMethodIcon(paymentMethod)}
                                Record {paymentMethod} Payment
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}