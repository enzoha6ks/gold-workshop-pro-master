"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Download,
  Printer,
  Save,
  Copy,
  FileText,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

// Types
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  weight: number;
  purity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  status: "draft" | "sent" | "paid" | "overdue";
}

export default function InvoicePage() {
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Sample invoice data
  const [invoice, setInvoice] = useState<Invoice>({
    id: "INV-001",
    invoiceNumber: "INV-2024-001",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    customerName: "John Doe",
    customerAddress: "123 Gold Street, Jewelry District\nMumbai, Maharashtra 400001",
    customerPhone: "+91 98765 43210",
    items: [
      {
        id: "1",
        description: "22K Gold Bracelet",
        quantity: 1,
        weight: 15.5,
        purity: 916,
        rate: 5500,
        amount: 85250,
      },
      {
        id: "2",
        description: "24K Gold Chain",
        quantity: 1,
        weight: 8.2,
        purity: 999,
        rate: 5800,
        amount: 47560,
      },
    ],
    subtotal: 132810,
    taxRate: 3,
    taxAmount: 3984.3,
    total: 136794.3,
    notes: "Thank you for your business!",
    status: "draft",
  });

  // Handle field changes
  const handleInputChange = (field: string, value: string | number) => {
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle item changes
  const handleItemChange = (itemId: string, field: string, value: string | number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
              amount: field === "quantity" || field === "weight" || field === "rate" 
                ? calculateItemAmount({ ...item, [field]: value })
                : item.amount,
            }
          : item
      ),
    }));
  };

  // Calculate item amount
  const calculateItemAmount = (item: InvoiceItem) => {
    return item.quantity * item.weight * item.rate;
  };

  // Add new item
  const addNewItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      weight: 0,
      purity: 916,
      rate: 5500,
      amount: 0,
    };
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Remove item
  const removeItem = (itemId: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  // Recalculate totals
  const recalculateTotals = () => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * invoice.taxRate) / 100;
    const total = subtotal + taxAmount;

    setInvoice((prev) => ({
      ...prev,
      subtotal,
      taxAmount,
      total,
    }));
  };

  // Save invoice
  const handleSaveInvoice = () => {
    recalculateTotals();
    toast.success("Invoice saved successfully!");
  };

  // Duplicate invoice
  const handleDuplicateInvoice = () => {
    const newInvoice = {
      ...invoice,
      id: `INV-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoice.items.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      status: "draft" as const,
    };
    setInvoice(newInvoice);
    toast.success("Invoice duplicated!");
  };

  // Print/PDF function
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice-${invoice.invoiceNumber}`,
  });

  // Generate PDF
  const handleGeneratePDF = () => {
    handlePrint();
    toast.success("PDF generated successfully!");
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-600 mt-1">Create and manage customer invoices</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleDuplicateInvoice} className="gap-2">
            <Copy className="w-4 h-4" />
            Duplicate
          </Button>
          <Button onClick={handleSaveInvoice} className="gap-2">
            <Save className="w-4 h-4" />
            Save Invoice
          </Button>
          <Button onClick={handleGeneratePDF} className="gap-2 bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Header */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>Basic invoice information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoice.invoiceNumber}
                    onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={invoice.status}
                    onValueChange={(value: "draft" | "sent" | "paid" | "overdue") =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Invoice Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={invoice.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Bill to details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={invoice.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="customerAddress">Address</Label>
                <Input
                  id="customerAddress"
                  value={invoice.customerAddress}
                  onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                  className="min-h-[80px]"
                  placeholder="Enter address..."
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={invoice.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Invoice Items</CardTitle>
                <CardDescription>Products and services</CardDescription>
              </div>
              <Button onClick={addNewItem} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg"
                  >
                    <div className="col-span-4">
                      <Label htmlFor={`item-desc-${item.id}`}>Description</Label>
                      <Input
                        id={`item-desc-${item.id}`}
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(item.id, "description", e.target.value)
                        }
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor={`item-qty-${item.id}`}>Qty</Label>
                      <Input
                        id={`item-qty-${item.id}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(item.id, "quantity", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor={`item-weight-${item.id}`}>Weight (g)</Label>
                      <Input
                        id={`item-weight-${item.id}`}
                        type="number"
                        step="0.001"
                        value={item.weight}
                        onChange={(e) =>
                          handleItemChange(item.id, "weight", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor={`item-purity-${item.id}`}>Purity</Label>
                      <Input
                        id={`item-purity-${item.id}`}
                        type="number"
                        value={item.purity}
                        onChange={(e) =>
                          handleItemChange(item.id, "purity", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`item-rate-${item.id}`}>Rate (₹/g)</Label>
                      <Input
                        id={`item-rate-${item.id}`}
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(item.id, "rate", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Amount (₹)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.amount.toLocaleString()}
                          readOnly
                          className="font-medium"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-rose-600 hover:text-rose-700"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Additional information</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={invoice.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="min-h-[80px]"
                placeholder="Thank you for your business!"
              />
            </CardContent>
          </Card>
        </div>

        {/* Invoice Preview & Totals */}
        <div className="space-y-6">
          {/* Invoice Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview</CardTitle>
              <CardDescription>Real-time preview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-slate-50">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg">GOLD PRO MANUFACTURING</h3>
                  <p className="text-sm text-slate-600">Invoice #{invoice.invoiceNumber}</p>
                </div>
                <div className="text-xs space-y-1">
                  <p>
                    <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge
                      variant={
                        invoice.status === "paid"
                          ? "default"
                          : invoice.status === "overdue"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {invoice.status.toUpperCase()}
                    </Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Totals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">₹{invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({invoice.taxRate}%):</span>
                <span className="font-medium">₹{invoice.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-lg">₹{invoice.total.toLocaleString()}</span>
              </div>
              <div className="pt-4">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={invoice.taxRate}
                  onChange={(e) => handleInputChange("taxRate", parseFloat(e.target.value) || 0)}
                />
              </div>
              <Button onClick={recalculateTotals} className="w-full mt-2">
                Recalculate Totals
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                New Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <User className="w-4 h-4" />
                Add Customer
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Reminder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Printable Invoice */}
      <div className="hidden">
        <div ref={invoiceRef} className="p-8 bg-white">
          {/* Printable invoice content */}
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">GOLD PRO</h1>
                <p className="text-gray-600">Gold Manufacturing & Jewelry</p>
                <p className="text-gray-600">123 Business Street, Mumbai</p>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                <p className="text-gray-600">#{invoice.invoiceNumber}</p>
                <p className="text-gray-600">
                  Date: {new Date(invoice.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Due: {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                <p className="text-gray-600">{invoice.customerName}</p>
                <p className="text-gray-600 whitespace-pre-line">{invoice.customerAddress}</p>
                <p className="text-gray-600">{invoice.customerPhone}</p>
              </div>
              <div className="text-right">
                <Badge
                  className={
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : invoice.status === "overdue"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {invoice.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Qty</th>
                  <th className="text-right py-2">Weight</th>
                  <th className="text-right py-2">Purity</th>
                  <th className="text-right py-2">Rate</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-3">{item.description}</td>
                    <td className="text-right py-3">{item.quantity}</td>
                    <td className="text-right py-3">{item.weight}g</td>
                    <td className="text-right py-3">{item.purity}</td>
                    <td className="text-right py-3">₹{item.rate.toLocaleString()}</td>
                    <td className="text-right py-3">₹{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>₹{invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>₹{invoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-300 font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{invoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-8 pt-8 border-t border-gray-300">
                <h4 className="font-semibold mb-2">Notes:</h4>
                <p className="text-gray-600">{invoice.notes}</p>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-300 text-center text-gray-500">
              <p>Thank you for your business!</p>
              <p>GOLD PRO - Trusted Gold Manufacturing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}