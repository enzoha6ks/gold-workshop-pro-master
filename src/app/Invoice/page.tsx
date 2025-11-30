



// "use client";

// import { useState, useRef } from "react";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Plus,
//   Download,
//   Save,
//   Copy,
//   FileText,
//   Calendar,
//   User,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";
// import { toast } from "sonner";

// // Types
// interface InvoiceItem {
//   id: string;
//   description: string;
//   quantity: number;
//   weight: number;
//   purity: number;
//   rate: number;
//   amount: number;
// }

// interface Invoice {
//   id: string;
//   invoiceNumber: string;
//   date: string;
//   dueDate: string;
//   customerName: string;
//   customerAddress: string;
//   customerPhone: string;
//   items: InvoiceItem[];
//   subtotal: number;
//   total: number;
//   notes: string;
//   status: "draft" | "sent" | "paid" | "overdue" | "issued" | "received";
// }

// export default function InvoicePage() {
//   const invoiceRef = useRef(null);
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);

//   // Empty invoice data - no dummy data
//   const [invoice, setInvoice] = useState<Invoice>({
//     id: "INV-001",
//     invoiceNumber: "INV-2024-001",
//     date: new Date().toISOString().split("T")[0],
//     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//       .toISOString()
//       .split("T")[0],
//     customerName: "",
//     customerAddress: "",
//     customerPhone: "",
//     items: [
//       {
//         id: "1",
//         description: "",
//         quantity: 1,
//         weight: 0,
//         purity: 916,
//         rate: 0,
//         amount: 0,
//       },
//     ],
//     subtotal: 0,
//     total: 0,
//     notes: "",
//     status: "draft",
//   });

//   // Format date consistently to avoid hydration issues
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     });
//   };

//   // Handle field changes
//   const handleInputChange = (field: string, value: string | number) => {
//     setInvoice((prev) => ({ ...prev, [field]: value }));
//   };

//   // Handle item changes
//   const handleItemChange = (
//     itemId: string,
//     field: string,
//     value: string | number
//   ) => {
//     setInvoice((prev) => ({
//       ...prev,
//       items: prev.items.map((item) => {
//         if (item.id === itemId) {
//           const updatedItem = { ...item, [field]: value };
//           // Recalculate amount if quantity, weight, or rate changes
//           if (field === "quantity" || field === "weight" || field === "rate") {
//             updatedItem.amount = updatedItem.quantity * updatedItem.weight * updatedItem.rate;
//           }
//           return updatedItem;
//         }
//         return item;
//       }),
//     }));
//   };

//   // Add new item
//   const addNewItem = () => {
//     const newItem: InvoiceItem = {
//       id: Date.now().toString(),
//       description: "",
//       quantity: 1,
//       weight: 0,
//       purity: 916,
//       rate: 0,
//       amount: 0,
//     };
//     setInvoice((prev) => ({
//       ...prev,
//       items: [...prev.items, newItem],
//     }));
//   };

//   // Remove item
//   const removeItem = (itemId: string) => {
//     if (invoice.items.length > 1) {
//       setInvoice((prev) => ({
//         ...prev,
//         items: prev.items.filter((item) => item.id !== itemId),
//       }));
//     } else {
//       toast.error("Invoice must have at least one item");
//     }
//   };

//   // Recalculate totals
//   const recalculateTotals = () => {
//     const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
//     const total = subtotal;

//     setInvoice((prev) => ({
//       ...prev,
//       subtotal,
//       total,
//     }));
//     toast.success("Totals recalculated!");
//   };

//   // Save invoice
//   const handleSaveInvoice = () => {
//     recalculateTotals();

//     // Validate required fields
//     if (!invoice.customerName.trim()) {
//       toast.error("Please enter customer name");
//       return;
//     }
//     if (invoice.items.some((item) => !item.description.trim())) {
//       toast.error("Please fill all item descriptions");
//       return;
//     }
//     toast.success("Invoice saved successfully!");
//   };

//   // Duplicate invoice
//   const handleDuplicateInvoice = () => {
//     const newInvoice = {
//       ...invoice,
//       id: `INV-${Date.now()}`,
//       invoiceNumber: `INV-${new Date().getFullYear()}-${String(
//         invoice.items.length + 1
//       ).padStart(3, "0")}`,
//       date: new Date().toISOString().split("T")[0],
//       status: "draft" as const,
//     };
//     setInvoice(newInvoice);
//     toast.success("Invoice duplicated!");
//   };

//   // Professional PDF Download function
//   const handleDownloadPDF = () => {
//     if (!invoice.customerName.trim()) {
//       toast.error("Please enter customer name before downloading PDF");
//       return;
//     }

//     if (invoice.items.some((item) => !item.description.trim())) {
//       toast.error("Please fill all item descriptions before downloading PDF");
//       return;
//     }

//     // Generate table rows
//     const tableRowsHTML = invoice.items
//       .map(
//         (item) => `
//       <tr>
//         <td class="item-desc">${item.description}</td>
//         <td class="text-center">${item.quantity}</td>
//         <td class="text-right">${item.weight.toFixed(3)}g</td>
//         <td class="text-right">${item.purity}‰</td>
//         <td class="text-right">${item.rate.toLocaleString("en-US", {
//           minimumFractionDigits: 2,
//         })}</td>
//         <td class="text-right amount">${item.amount.toLocaleString("en-US", {
//           minimumFractionDigits: 3,
//         })}</td>
//       </tr>
//     `
//       )
//       .join("");

//     // Calculate tax (example: 5% VAT)
//     const taxRate = 0.05;
//     const subtotal = invoice.total;
//     const taxAmount = subtotal * taxRate;
//     const grandTotal = subtotal + taxAmount;

//     const printWindow = window.open("", "_blank");
//     if (!printWindow) {
//       toast.error("Please allow popups to generate PDF");
//       return;
//     }

//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Invoice-${invoice.invoiceNumber}</title>
//         <meta charset="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <style>
//           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }
          
//           body {
//             font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//             background: #ffffff;
//             color: #1a1a1a;
//             line-height: 1.4;
//             font-size: 10pt;
//             -webkit-font-smoothing: antialiased;
//             -moz-osx-font-smoothing: grayscale;
//           }
            
//             .invoice-container {
//               max-width: 210mm;
//               margin: 0 auto;
//               padding: 20mm;
//               min-height: 297mm;
//               position: relative;
//             }
            
//             /* Header Section */
//             .header {
//               display: grid;
//               grid-template-columns: 1fr auto;
//               gap: 30px;
//               margin-bottom: 30px;
//               padding-bottom: 20px;
//               border-bottom: 2px solid #e5e7eb;
//             }
            
//             .company-brand {
//               display: flex;
//               align-items: center;
//               gap: 15px;
//             }
            
//             .logo-placeholder {
//               width: 60px;
//               height: 60px;
//               background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
//               border-radius: 8px;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               color: white;
//               font-weight: 900;
//               font-size: 18px;
//             }
            
//             .company-info h1 {
//               font-size: 24px;
//               font-weight: 900;
//               color: #1a1a1a;
//               margin-bottom: 4px;
//               letter-spacing: -0.5px;
//             }
            
//             .company-info .tagline {
//               font-size: 10px;
//               font-weight: 600;
//               color: #6b7280;
//               text-transform: uppercase;
//               letter-spacing: 1px;
//               margin-bottom: 8px;
//             }
            
//             .company-info .contact {
//               font-size: 9px;
//               color: #4b5563;
//               font-weight: 500;
//             }
            
//             .invoice-meta {
//               text-align: right;
//             }
            
//             .invoice-title {
//               font-size: 32px;
//               font-weight: 900;
//               color: #1a1a1a;
//               margin-bottom: 15px;
//               text-transform: uppercase;
//               letter-spacing: 2px;
//             }
            
//             .meta-box {
//               background: #f9fafb;
//               border: 1px solid #e5e7eb;
//               border-radius: 6px;
//               padding: 12px;
//               min-width: 200px;
//             }
            
//             .meta-row {
//               display: flex;
//               justify-content: space-between;
//               margin-bottom: 6px;
//               font-size: 9px;
//             }
            
//             .meta-row:last-child {
//               margin-bottom: 0;
//             }
            
//             .meta-label {
//               font-weight: 600;
//               color: #6b7280;
//             }
            
//             .meta-value {
//               font-weight: 700;
//               color: #1a1a1a;
//             }
            
//             .status-badge {
//               display: inline-block;
//               padding: 4px 10px;
//               border-radius: 20px;
//               font-size: 8px;
//               font-weight: 800;
//               text-transform: uppercase;
//               letter-spacing: 0.5px;
//               margin-left: 8px;
//             }
            
//             .status-draft { background: #e5e7eb; color: #374151; }
//             .status-sent { background: #dbeafe; color: #1e40af; }
//             .status-paid { background: #d1fae5; color: #065f46; }
//             .status-overdue { background: #fee2e2; color: #991b1b; }
//             .status-issued { background: #fed7aa; color: #92400e; }
//             .status-received { background: #cffafe; color: #0e7490; }
            
//             /* Customer Section */
//             .customer-section {
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 25px;
//               margin-bottom: 30px;
//             }
            
//             .customer-box {
//               background: #f9fafb;
//               border: 1px solid #e5e7eb;
//               border-radius: 6px;
//               padding: 15px;
//             }
            
//             .customer-box h3 {
//               font-size: 11px;
//               font-weight: 800;
//               color: #1a1a1a;
//               margin-bottom: 10px;
//               text-transform: uppercase;
//               letter-spacing: 1px;
//             }
            
//             .customer-details p {
//               font-size: 10px;
//               margin-bottom: 4px;
//               color: #4b5563;
//             }
            
//             .customer-details strong {
//               color: #1a1a1a;
//               font-weight: 600;
//             }
            
//             /* Items Table */
//             .items-section {
//               margin-bottom: 25px;
//             }
            
//             .section-header {
//               font-size: 12px;
//               font-weight: 800;
//               color: #1a1a1a;
//               margin-bottom: 12px;
//               text-transform: uppercase;
//               letter-spacing: 1px;
//             }
            
//             table {
//               width: 100%;
//               border-collapse: separate;
//               border-spacing: 0;
//               margin-bottom: 20px;
//             }
            
//             thead {
//               background: #1a1a1a;
//             }
            
//             th {
//               padding: 10px 8px;
//               text-align: left;
//               font-size: 8px;
//               font-weight: 800;
//               color: #ffffff;
//               text-transform: uppercase;
//               letter-spacing: 0.5px;
//               border-bottom: 2px solid #d97706;
//             }
            
//             th.text-center { text-align: center; }
//             th.text-right { text-align: right; }
            
//             td {
//               padding: 10px 8px;
//               border-bottom: 1px solid #e5e7eb;
//               font-size: 9px;
//               color: #1a1a1a;
//               font-weight: 500;
//             }
            
//             td.text-center { text-align: center; }
//             td.text-right { text-align: right; }
            
//             .item-desc {
//               font-weight: 600;
//             }
            
//             .amount {
//               font-weight: 700;
//               color: #1a1a1a;
//             }
            
//             /* Totals Section */
//             .totals-section {
//               display: flex;
//               justify-content: flex-end;
//               margin-bottom: 25px;
//             }
            
//             .totals-box {
//               width: 280px;
//               background: #f9fafb;
//               border: 1px solid #e5e7eb;
//               border-radius: 6px;
//               padding: 15px;
//             }
            
//             .total-row {
//               display: flex;
//               justify-content: space-between;
//               margin-bottom: 8px;
//               font-size: 10px;
//             }
            
//             .total-row:last-child {
//               margin-bottom: 0;
//             }
            
//             .total-label {
//               font-weight: 600;
//               color: #6b7280;
//             }
            
//             .total-value {
//               font-weight: 700;
//               color: #1a1a1a;
//             }
            
//             .total-row.grand-total {
//               border-top: 2px solid #d97706;
//               padding-top: 10px;
//               margin-top: 10px;
//             }
            
//             .grand-total .total-label,
//             .grand-total .total-value {
//               font-size: 12px;
//               font-weight: 900;
//               color: #1a1a1a;
//             }
            
//             .currency {
//               color: #d97706;
//               font-weight: 800;
//               margin-left: 2px;
//             }
            
//             /* Notes Section */
//             .notes-section {
//               background: #fffbeb;
//               border: 1px solid #f59e0b;
//               border-radius: 6px;
//               padding: 12px;
//               margin-bottom: 25px;
//             }
            
//             .notes-section h4 {
//               font-size: 10px;
//               font-weight: 800;
//               color: #92400e;
//               margin-bottom: 6px;
//               text-transform: uppercase;
//               letter-spacing: 0.5px;
//             }
            
//             .notes-section p {
//               font-size: 9px;
//               color: #78350f;
//               font-weight: 500;
//             }
            
//             /* Footer */
//             .footer {
//               text-align: center;
//               padding-top: 20px;
//               border-top: 2px solid #e5e7eb;
//             }
            
//             .footer p {
//               font-size: 8px;
//               color: #6b7280;
//               margin-bottom: 4px;
//               font-weight: 500;
//             }
            
//             .footer p:first-child {
//               font-weight: 700;
//               color: #4b5563;
//               margin-bottom: 6px;
//             }
            
//             /* Payment Terms */
//             .payment-terms {
//               background: #f3f4f6;
//               border: 1px solid #d1d5db;
//               border-radius: 6px;
//               padding: 12px;
//               margin-bottom: 20px;
//             }
            
//             .payment-terms h4 {
//               font-size: 10px;
//               font-weight: 800;
//               color: #1a1a1a;
//               margin-bottom: 6px;
//               text-transform: uppercase;
//               letter-spacing: 0.5px;
//             }
            
//             .payment-terms p {
//               font-size: 8px;
//               color: #4b5563;
//               font-weight: 500;
//             }
            
//             /* Print Styles */
//             @media print {
//               body {
//                 background: white !important;
//               }
              
//               .invoice-container {
//                 padding: 15mm !important;
//                 box-shadow: none !important;
//               }
              
//               .no-print {
//                 display: none !important;
//               }
//             }
            
//             /* Responsive for small screens */
//             @media (max-width: 640px) {
//               .invoice-container {
//                 padding: 15px;
//               }
              
//               .header {
//                 grid-template-columns: 1fr;
//                 gap: 20px;
//               }
              
//               .invoice-meta {
//                 text-align: left;
//               }
              
//               .customer-section {
//                 grid-template-columns: 1fr;
//                 gap: 15px;
//               }
              
//               .totals-section {
//                 justify-content: stretch;
//               }
              
//               .totals-box {
//                 width: 100%;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="invoice-container">
//             <!-- Header -->
//             <div class="header">
//               <div class="company-brand">
//                 <div class="logo-placeholder">BK</div>
//                 <div class="company-info">
//                   <h1>BARKAT AL-KHAIR</h1>
//                   <p class="tagline">Premium Gold & Jewelry Trading</p>
//                   <p class="contact">KUWAIT CITY, SHARQ • TEL: 90947886, 99273356</p>
//                 </div>
//               </div>
//               <div class="invoice-meta">
//                 <h2 class="invoice-title">Invoice</h2>
//                 <div class="meta-box">
//                   <div class="meta-row">
//                     <span class="meta-label">Number:</span>
//                     <span class="meta-value">${invoice.invoiceNumber}</span>
//                   </div>
//                   <div class="meta-row">
//                     <span class="meta-label">Date:</span>
//                     <span class="meta-value">${formatDate(invoice.date)}</span>
//                   </div>
//                   <div class="meta-row">
//                     <span class="meta-label">Due Date:</span>
//                     <span class="meta-value">${formatDate(invoice.dueDate)}</span>
//                   </div>
//                   <div class="meta-row">
//                     <span class="meta-label">Status:</span>
//                     <span class="meta-value">
//                       ${invoice.status.toUpperCase()}
//                       <span class="status-badge status-${invoice.status}">${invoice.status}</span>
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <!-- Customer Section -->
//             <div class="customer-section">
//               <div class="customer-box">
//                 <h3>Bill To</h3>
//                 <div class="customer-details">
//                   <p><strong>${invoice.customerName || "Customer Name"}</strong></p>
//                   <p>${invoice.customerAddress || "Customer Address"}</p>
//                   <p>${invoice.customerPhone || "Phone Number"}</p>
//                 </div>
//               </div>
//               <div class="customer-box">
//                 <h3>From</h3>
//                 <div class="customer-details">
//                   <p><strong>BARKAT AL-KHAIR</strong></p>
//                   <p>KUWAIT CITY, SHARQ</p>
//                   <p>TEL: 90947886, 99273356</p>
//                   <p>CR: 1234567890</p>
//                 </div>
//               </div>
//             </div>

//             <!-- Items Section -->
//             <div class="items-section">
//               <h3 class="section-header">Invoice Items</h3>
//               <table>
//                 <thead>
//                   <tr>
//                     <th style="width: 35%">Description</th>
//                     <th class="text-center" style="width: 8%">Qty</th>
//                     <th class="text-right" style="width: 12%">Weight</th>
//                     <th class="text-right" style="width: 10%">Purity</th>
//                     <th class="text-right" style="width: 15%">Rate (KWD)</th>
//                     <th class="text-right" style="width: 20%">Amount (KWD)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${tableRowsHTML}
//                 </tbody>
//               </table>
//             </div>
          
//             <!-- Payment Terms -->
//             <div class="payment-terms">
//               <h4>Payment Terms</h4>
//               <p>Payment is due within 7 days from invoice date. Late payments may incur a 2% monthly fee. All prices are in Kuwaiti Dinars (KWD).</p>
//             </div>

//             <!-- Totals -->
//             <div class="totals-section">
//               <div class="totals-box">
//                 <div class="total-row">
//                   <span class="total-label">Subtotal</span>
//                   <span class="total-value">${subtotal.toLocaleString("en-US", { minimumFractionDigits: 3 })}<span class="currency">KWD</span></span>
//                 </div>
               
//                 <div class="total-row grand-total">
//                   <span class="total-label">Total Amount</span>
//                   <span class="total-value">${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 3 })}<span class="currency">KWD</span></span>
//                 </div>
//               </div>
//             </div>

//             <!-- Notes -->
//             ${invoice.notes ? `
//               <div class="notes-section">
//                 <h4>Notes</h4>
//                 <p>${invoice.notes}</p>
//               </div>
//             ` : ""}

//             <!-- Footer -->
//             <div class="footer">
//               <p>Thank you for your business with Barkat Al-Khair</p>
//               <p>This is a computer-generated invoice and does not require a signature</p>
//               <p>For inquiries, please contact us at 90947886, 99273356</p>
//             </div>
//           </div>

//           <script>
//             window.onload = function() {
//               setTimeout(function() {
//                 window.print();
//               }, 300);
              
//               window.onafterprint = function() {
//                 setTimeout(function() {
//                   window.close();
//                 }, 100);
//               };
//             };
//           </script>
//         </body>
//         </html>
//       `;

//     printWindow.document.write(htmlContent);
//     printWindow.document.close();
//     toast.success("PDF download initiated! Check your print dialog.");
//   };

//   return (
//     <div className="space-y-6 p-4 md:p-6">
//       {/* Header - Mobile Optimized */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col gap-4"
//       >
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold dark:text-slate-100">
//             Invoices
//           </h1>
//           <p className="text-sm text-slate-600 dark:text-slate-400">
//             Create and manage customer invoices
//           </p>
//         </div>

//         {/* Action Buttons - Stack on mobile */}
//         <div className="flex flex-col sm:flex-row gap-2 w-full">
//           <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
//             <Button
//               variant="outline"
//               onClick={handleDuplicateInvoice}
//               className="gap-2 flex-1 sm:flex-none"
//               size="sm"
//             >
//               <Copy className="w-3 h-3 md:w-4 md:h-4" />
//               <span className="hidden sm:inline">Duplicate</span>
//               <span className="sm:hidden">Copy</span>
//             </Button>
//             <Button
//               onClick={handleSaveInvoice}
//               className="gap-2 flex-1 sm:flex-none"
//               size="sm"
//             >
//               <Save className="w-3 h-3 md:w-4 md:h-4" />
//               Save
//             </Button>
//             <Button
//               onClick={handleDownloadPDF}
//               className="gap-2 flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
//               size="sm"
//             >
//               <Download className="w-3 h-3 md:w-4 md:h-4" />
//               <span className="hidden sm:inline">Download PDF</span>
//               <span className="sm:hidden">PDF</span>
//             </Button>
//           </div>
//         </div>
//       </motion.div>

//       <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
//         {/* Invoice Editor - Full width on mobile */}
//         <div className="lg:col-span-2 space-y-4 md:space-y-6">
//           {/* Invoice Header */}
//           <Card className="dark:bg-slate-900 dark:border-slate-800">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg md:text-xl dark:text-slate-100">
//                 Invoice Details
//               </CardTitle>
//               <CardDescription className="dark:text-slate-400">
//                 Basic invoice information
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div className="space-y-2">
//                   <Label htmlFor="invoiceNumber" className="text-sm">
//                     Invoice Number
//                   </Label>
//                   <Input
//                     id="invoiceNumber"
//                     value={invoice.invoiceNumber}
//                     onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
//                     className="text-sm"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="status" className="text-sm">
//                     Status
//                   </Label>
//                   <Select
//                     value={invoice.status}
//                     onValueChange={(
//                       value:
//                         | "draft"
//                         | "sent"
//                         | "paid"
//                         | "overdue"
//                         | "issued"
//                         | "received"
//                     ) => handleInputChange("status", value)}
//                   >
//                     <SelectTrigger className="text-sm">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="draft">Draft</SelectItem>
//                       <SelectItem value="issued">Issued</SelectItem>
//                       <SelectItem value="sent">Sent</SelectItem>
//                       <SelectItem value="received">Received</SelectItem>
//                       <SelectItem value="paid">Paid</SelectItem>
//                       <SelectItem value="overdue">Overdue</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="date" className="text-sm">
//                     Invoice Date
//                   </Label>
//                   <Input
//                     id="date"
//                     type="date"
//                     value={invoice.date}
//                     onChange={(e) => handleInputChange("date", e.target.value)}
//                     className="text-sm"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="dueDate" className="text-sm">
//                     Due Date
//                   </Label>
//                   <Input
//                     id="dueDate"
//                     type="date"
//                     value={invoice.dueDate}
//                     onChange={(e) => handleInputChange("dueDate", e.target.value)}
//                     className="text-sm"
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Customer Information */}
//           <Card className="dark:bg-slate-900 dark:border-slate-800">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg md:text-xl dark:text-slate-100">
//                 Customer Information
//               </CardTitle>
//               <CardDescription className="dark:text-slate-400">
//                 Bill to details
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="space-y-2">
//                 <Label htmlFor="customerName" className="text-sm">
//                   Customer Name
//                 </Label>
//                 <Input
//                   id="customerName"
//                   value={invoice.customerName}
//                   onChange={(e) => handleInputChange("customerName", e.target.value)}
//                   placeholder="Enter customer name"
//                   className="text-sm"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="customerAddress" className="text-sm">
//                   Address
//                 </Label>
//                 <Input
//                   id="customerAddress"
//                   value={invoice.customerAddress}
//                   onChange={(e) => handleInputChange("customerAddress", e.target.value)}
//                   className="min-h-[60px] md:min-h-[80px] text-sm"
//                   placeholder="Enter customer address"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="customerPhone" className="text-sm">
//                   Phone Number
//                 </Label>
//                 <Input
//                   id="customerPhone"
//                   value={invoice.customerPhone}
//                   onChange={(e) => handleInputChange("customerPhone", e.target.value)}
//                   placeholder="Enter phone number"
//                   className="text-sm"
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Invoice Items - Mobile Optimized */}
//           <Card className="dark:bg-slate-900 dark:border-slate-800">
//             <CardHeader className="flex flex-row items-center justify-between pb-3">
//               <div>
//                 <CardTitle className="text-lg md:text-xl dark:text-slate-100">
//                   Invoice Items
//                 </CardTitle>
//                 <CardDescription className="dark:text-slate-400">
//                   Products and services
//                 </CardDescription>
//               </div>
//               <Button onClick={addNewItem} size="sm" className="gap-1 md:gap-2">
//                 <Plus className="w-3 h-3 md:w-4 md:h-4" />
//                 <span className="hidden sm:inline">Add Item</span>
//                 <span className="sm:hidden">Add</span>
//               </Button>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {invoice.items.map((item) => (
//                   <div
//                     key={item.id}
//                     className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start p-3 border rounded-lg dark:border-slate-700"
//                   >
//                     <div className="sm:col-span-12 md:col-span-4 space-y-2">
//                       <Label htmlFor={`item-desc-${item.id}`} className="text-xs">
//                         Description
//                       </Label>
//                       <Input
//                         id={`item-desc-${item.id}`}
//                         value={item.description}
//                         onChange={(e) =>
//                           handleItemChange(item.id, "description", e.target.value)
//                         }
//                         placeholder="Item description"
//                         className="text-sm"
//                       />
//                     </div>
//                     <div className="grid grid-cols-4 sm:grid-cols-12 gap-2 sm:col-span-12 md:col-span-8">
//                       <div className="sm:col-span-3 space-y-2">
//                         <Label htmlFor={`item-qty-${item.id}`} className="text-xs">
//                           Qty
//                         </Label>
//                         <Input
//                           id={`item-qty-${item.id}`}
//                           type="number"
//                           value={item.quantity}
//                           onChange={(e) =>
//                             handleItemChange(
//                               item.id,
//                               "quantity",
//                               parseFloat(e.target.value) || 0
//                             )
//                           }
//                           className="text-sm"
//                         />
//                       </div>
//                       <div className="sm:col-span-3 space-y-2">
//                         <Label htmlFor={`item-weight-${item.id}`} className="text-xs">
//                           Weight (g)
//                         </Label>
//                         <Input
//                           id={`item-weight-${item.id}`}
//                           type="number"
//                           step="0.001"
//                           value={item.weight}
//                           onChange={(e) =>
//                             handleItemChange(
//                               item.id,
//                               "weight",
//                               parseFloat(e.target.value) || 0
//                             )
//                           }
//                           placeholder="0.000"
//                           className="text-sm"
//                         />
//                       </div>
//                       <div className="sm:col-span-3 space-y-2">
//                         <Label htmlFor={`item-purity-${item.id}`} className="text-xs">
//                           Purity
//                         </Label>
//                         <Input
//                           id={`item-purity-${item.id}`}
//                           type="number"
//                           value={item.purity}
//                           onChange={(e) =>
//                             handleItemChange(
//                               item.id,
//                               "purity",
//                               parseFloat(e.target.value) || 0
//                             )
//                           }
//                           className="text-sm"
//                         />
//                       </div>
//                       <div className="sm:col-span-3 space-y-2">
//                         <Label htmlFor={`item-rate-${item.id}`} className="text-xs">
//                           Rate
//                         </Label>
//                         <Input
//                           id={`item-rate-${item.id}`}
//                           type="number"
//                           value={item.rate}
//                           onChange={(e) =>
//                             handleItemChange(
//                               item.id,
//                               "rate",
//                               parseFloat(e.target.value) || 0
//                             )
//                           }
//                           placeholder="0.00"
//                           className="text-sm"
//                         />
//                       </div>
//                       <div className="sm:col-span-6 space-y-2">
//                         <Label className="text-xs">Amount (KWD)</Label>
//                         <div className="flex items-center gap-2">
//                           <Input
//                             value={item.amount}
//                             onChange={(e) =>
//                               handleItemChange(
//                                 item.id,
//                                 "amount",
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             type="number"
//                             className="font-medium text-sm"
//                           />
//                           {invoice.items.length > 1 && (
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => removeItem(item.id)}
//                               className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 h-9"
//                             >
//                               ×
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Notes */}
//           <Card className="dark:bg-slate-900 dark:border-slate-800">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg md:text-xl dark:text-slate-100">
//                 Notes
//               </CardTitle>
//               <CardDescription className="dark:text-slate-400">
//                 Additional information
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Input
//                 value={invoice.notes}
//                 onChange={(e) => handleInputChange("notes", e.target.value)}
//                 className="min-h-[60px] md:min-h-[80px] text-sm"
//                 placeholder="Thank you for your business!"
//               />
//             </CardContent>
//           </Card>
//         </div>

//         {/* Invoice Preview & Totals - Collapsible on mobile */}
//         <div className="space-y-4 md:space-y-6">
//           {/* Mobile Preview Toggle */}
//           <Button
//             variant="outline"
//             className="w-full lg:hidden flex items-center justify-between"
//             onClick={() => setIsPreviewOpen(!isPreviewOpen)}
//           >
//             <span>Preview & Totals</span>
//             {isPreviewOpen ? (
//               <ChevronUp className="w-4 h-4" />
//             ) : (
//               <ChevronDown className="w-4 h-4" />
//             )}
//           </Button>

//           <div className={`space-y-4 md:space-y-6 ${isPreviewOpen ? "block" : "hidden lg:block"}`}>
//             {/* Invoice Preview */}
//             <Card className="dark:bg-slate-900 dark:border-slate-800">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg dark:text-slate-100">
//                   Invoice Preview
//                 </CardTitle>
//                 <CardDescription className="dark:text-slate-400">
//                   Real-time preview
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
//                   <div className="text-center mb-3">
//                     <h3 className="font-bold text-base md:text-lg dark:text-slate-100">
//                       BARKAT AL-KHAIR
//                     </h3>
//                     <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
//                       Invoice #{invoice.invoiceNumber}
//                     </p>
//                   </div>
//                   <div className="text-xs space-y-1 dark:text-slate-300">
//                     <p>
//                       <strong>Date:</strong> {formatDate(invoice.date)}
//                     </p>
//                     <p>
//                       <strong>Due Date:</strong> {formatDate(invoice.dueDate)}
//                     </p>
//                     <p>
//                       <strong>Status:</strong>{" "}
//                       <Badge
//                         variant={
//                           invoice.status === "paid"
//                             ? "default"
//                             : invoice.status === "overdue"
//                               ? "destructive"
//                               : "outline"
//                         }
//                         className="text-xs"
//                       >
//                         {invoice.status.toUpperCase()}
//                       </Badge>
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Totals */}
//             <Card className="dark:bg-slate-900 dark:border-slate-800">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg dark:text-slate-100">
//                   Invoice Totals
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex justify-between border-t pt-2 dark:border-slate-700">
//                   <span className="font-bold dark:text-slate-100">Total Amount:</span>
//                   <span className="font-bold text-base md:text-lg dark:text-slate-100">
//                     {invoice.total.toLocaleString()} KWD
//                   </span>
//                 </div>
//                 <Button onClick={recalculateTotals} className="w-full mt-2 text-sm">
//                   Recalculate Totals
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Quick Actions */}
//             <Card className="dark:bg-slate-900 dark:border-slate-800">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg dark:text-slate-100">
//                   Quick Actions
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start gap-2 dark:border-slate-700 dark:text-slate-300 text-sm"
//                 >
//                   <FileText className="w-3 h-3 md:w-4 md:h-4" />
//                   New Invoice
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start gap-2 dark:border-slate-700 dark:text-slate-300 text-sm"
//                 >
//                   <User className="w-3 h-3 md:w-4 md:h-4" />
//                   Add Customer
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start gap-2 dark:border-slate-700 dark:text-slate-300 text-sm"
//                 >
//                   <Calendar className="w-3 h-3 md:w-4 md:h-4" />
//                   Schedule Reminder
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>

//   );
// }



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
  Save,
  Copy,
  FileText,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
  total: number;
  notes: string;
  status: "draft" | "sent" | "paid" | "overdue" | "issued" | "received";
}

export default function InvoicePage() {
  const invoiceRef = useRef(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Empty invoice data - no dummy data
  const [invoice, setInvoice] = useState<Invoice>({
    id: "INV-001",
    invoiceNumber: "INV-2024-001",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    items: [
      {
        id: "1",
        description: "",
        quantity: 1,
        weight: 0,
        purity: 916,
        rate: 0,
        amount: 0,
      },
    ],
    subtotal: 0,
    total: 0,
    notes: "",
    status: "draft",
  });

  // Format date consistently to avoid hydration issues
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Handle field changes
  const handleInputChange = (field: string, value: string | number) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  // Handle item changes
  const handleItemChange = (
    itemId: string,
    field: string,
    value: string | number
  ) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate amount if quantity, weight, or rate changes
          if (field === "quantity" || field === "weight" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.weight * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  // Add new item
  const addNewItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      weight: 0,
      purity: 916,
      rate: 0,
      amount: 0,
    };
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Remove item
  const removeItem = (itemId: string) => {
    if (invoice.items.length > 1) {
      setInvoice((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
      }));
    } else {
      toast.error("Invoice must have at least one item");
    }
  };

  // Recalculate totals
  const recalculateTotals = () => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal;

    setInvoice((prev) => ({
      ...prev,
      subtotal,
      total,
    }));
    toast.success("Totals recalculated!");
  };

  // Auto-recalculate totals when items change
  useState(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal;
    
    if (invoice.subtotal !== subtotal || invoice.total !== total) {
      setInvoice(prev => ({
        ...prev,
        subtotal,
        total,
      }));
    }
  });

  // Save invoice
  const handleSaveInvoice = () => {
    recalculateTotals();

    // Validate required fields
    if (!invoice.customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    if (invoice.items.some((item) => !item.description.trim())) {
      toast.error("Please fill all item descriptions");
      return;
    }
    toast.success("Invoice saved successfully!");
  };

  // Duplicate invoice
  const handleDuplicateInvoice = () => {
    const newInvoice = {
      ...invoice,
      id: `INV-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(
        invoice.items.length + 1
      ).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      status: "draft" as const,
    };
    setInvoice(newInvoice);
    toast.success("Invoice duplicated!");
  };

  // Professional PDF Download function
  const handleDownloadPDF = () => {
    if (!invoice.customerName.trim()) {
      toast.error("Please enter customer name before downloading PDF");
      return;
    }

    if (invoice.items.some((item) => !item.description.trim())) {
      toast.error("Please fill all item descriptions before downloading PDF");
      return;
    }

    // Recalculate totals before generating PDF
    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal;

    // Generate table rows
    const tableRowsHTML = invoice.items
      .map(
        (item) => `
      <tr>
        <td class="item-desc">${item.description}</td>
        <td class="text-center">${item.quantity}</td>
        <td class="text-right">${item.weight.toFixed(3)}g</td>
        <td class="text-right">${item.purity}‰</td>
        <td class="text-right">${item.rate.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}</td>
        <td class="text-right amount">${item.amount.toLocaleString("en-US", {
          minimumFractionDigits: 3,
        })}</td>
      </tr>
    `
      )
      .join("");

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to generate PDF");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice-${invoice.invoiceNumber}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #ffffff;
            color: #1a1a1a;
            line-height: 1.4;
            font-size: 10pt;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
            
            .invoice-container {
              max-width: 210mm;
              margin: 0 auto;
              padding: 20mm;
              min-height: 297mm;
              position: relative;
            }
            
            /* Header Section */
            .header {
              display: grid;
              grid-template-columns: 1fr auto;
              gap: 30px;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .company-brand {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            
            .logo-placeholder {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 900;
              font-size: 18px;
            }
            
            .company-info h1 {
              font-size: 24px;
              font-weight: 900;
              color: #1a1a1a;
              margin-bottom: 4px;
              letter-spacing: -0.5px;
            }
            
            .company-info .tagline {
              font-size: 10px;
              font-weight: 600;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 8px;
            }
            
            .company-info .contact {
              font-size: 9px;
              color: #4b5563;
              font-weight: 500;
            }
            
            .invoice-meta {
              text-align: right;
            }
            
            .invoice-title {
              font-size: 32px;
              font-weight: 900;
              color: #1a1a1a;
              margin-bottom: 15px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            
            .meta-box {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              padding: 12px;
              min-width: 200px;
            }
            
            .meta-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 6px;
              font-size: 9px;
            }
            
            .meta-row:last-child {
              margin-bottom: 0;
            }
            
            .meta-label {
              font-weight: 600;
              color: #6b7280;
            }
            
            .meta-value {
              font-weight: 700;
              color: #1a1a1a;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 10px;
              border-radius: 20px;
              font-size: 8px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-left: 8px;
            }
            
            .status-draft { background: #e5e7eb; color: #374151; }
            .status-sent { background: #dbeafe; color: #1e40af; }
            .status-paid { background: #d1fae5; color: #065f46; }
            .status-overdue { background: #fee2e2; color: #991b1b; }
            .status-issued { background: #fed7aa; color: #92400e; }
            .status-received { background: #cffafe; color: #0e7490; }
            
            /* Customer Section */
            .customer-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 25px;
              margin-bottom: 30px;
            }
            
            .customer-box {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              padding: 15px;
            }
            
            .customer-box h3 {
              font-size: 11px;
              font-weight: 800;
              color: #1a1a1a;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .customer-details p {
              font-size: 10px;
              margin-bottom: 4px;
              color: #4b5563;
            }
            
            .customer-details strong {
              color: #1a1a1a;
              font-weight: 600;
            }
            
            /* Items Table */
            .items-section {
              margin-bottom: 25px;
            }
            
            .section-header {
              font-size: 12px;
              font-weight: 800;
              color: #1a1a1a;
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              margin-bottom: 20px;
            }
            
            thead {
              background: #1a1a1a;
            }
            
            th {
              padding: 10px 8px;
              text-align: left;
              font-size: 8px;
              font-weight: 800;
              color: #ffffff;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 2px solid #d97706;
            }
            
            th.text-center { text-align: center; }
            th.text-right { text-align: right; }
            
            td {
              padding: 10px 8px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 9px;
              color: #1a1a1a;
              font-weight: 500;
            }
            
            td.text-center { text-align: center; }
            td.text-right { text-align: right; }
            
            .item-desc {
              font-weight: 600;
            }
            
            .amount {
              font-weight: 700;
              color: #1a1a1a;
            }
            
            /* Totals Section */
            .totals-section {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 25px;
            }
            
            .totals-box {
              width: 280px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              padding: 15px;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 10px;
            }
            
            .total-row:last-child {
              margin-bottom: 0;
            }
            
            .total-label {
              font-weight: 600;
              color: #6b7280;
            }
            
            .total-value {
              font-weight: 700;
              color: #1a1a1a;
            }
            
            .total-row.grand-total {
              border-top: 2px solid #d97706;
              padding-top: 10px;
              margin-top: 10px;
            }
            
            .grand-total .total-label,
            .grand-total .total-value {
              font-size: 12px;
              font-weight: 900;
              color: #1a1a1a;
            }
            
            .currency {
              color: #d97706;
              font-weight: 800;
              margin-left: 2px;
            }
            
            /* Notes Section */
            .notes-section {
              background: #fffbeb;
              border: 1px solid #f59e0b;
              border-radius: 6px;
              padding: 12px;
              margin-bottom: 25px;
            }
            
            .notes-section h4 {
              font-size: 10px;
              font-weight: 800;
              color: #92400e;
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .notes-section p {
              font-size: 9px;
              color: #78350f;
              font-weight: 500;
            }
            
            /* Footer */
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
            }
            
            .footer p {
              font-size: 8px;
              color: #6b7280;
              margin-bottom: 4px;
              font-weight: 500;
            }
            
            .footer p:first-child {
              font-weight: 700;
              color: #4b5563;
              margin-bottom: 6px;
            }
            
            /* Payment Terms */
            .payment-terms {
              background: #f3f4f6;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              padding: 12px;
              margin-bottom: 20px;
            }
            
            .payment-terms h4 {
              font-size: 10px;
              font-weight: 800;
              color: #1a1a1a;
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .payment-terms p {
              font-size: 8px;
              color: #4b5563;
              font-weight: 500;
            }
            
            /* Print Styles */
            @media print {
              body {
                background: white !important;
              }
              
              .invoice-container {
                padding: 15mm !important;
                box-shadow: none !important;
              }
              
              .no-print {
                display: none !important;
              }
            }
            
            /* Responsive for small screens */
            @media (max-width: 640px) {
              .invoice-container {
                padding: 15px;
              }
              
              .header {
                grid-template-columns: 1fr;
                gap: 20px;
              }
              
              .invoice-meta {
                text-align: left;
              }
              
              .customer-section {
                grid-template-columns: 1fr;
                gap: 15px;
              }
              
              .totals-section {
                justify-content: stretch;
              }
              
              .totals-box {
                width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header -->
            <div class="header">
              <div class="company-brand">
                <div class="logo-placeholder">BK</div>
                <div class="company-info">
                  <h1>BARKAT AL-KHAIR</h1>
                  <p class="tagline">Premium Gold & Jewelry Trading</p>
                  <p class="contact">KUWAIT CITY, SHARQ • TEL: 90947886, 99273356</p>
                </div>
              </div>
              <div class="invoice-meta">
                <h2 class="invoice-title">Invoice</h2>
                <div class="meta-box">
                  <div class="meta-row">
                    <span class="meta-label">Number:</span>
                    <span class="meta-value">${invoice.invoiceNumber}</span>
                  </div>
                  <div class="meta-row">
                    <span class="meta-label">Date:</span>
                    <span class="meta-value">${formatDate(invoice.date)}</span>
                  </div>
                  <div class="meta-row">
                    <span class="meta-label">Due Date:</span>
                    <span class="meta-value">${formatDate(invoice.dueDate)}</span>
                  </div>
                  <div class="meta-row">
                    <span class="meta-label">Status:</span>
                    <span class="meta-value">
                      ${invoice.status.toUpperCase()}
                      <span class="status-badge status-${invoice.status}">${invoice.status}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Customer Section -->
            <div class="customer-section">
              <div class="customer-box">
                <h3>Bill To</h3>
                <div class="customer-details">
                  <p><strong>${invoice.customerName || "Customer Name"}</strong></p>
                  <p>${invoice.customerAddress || "Customer Address"}</p>
                  <p>${invoice.customerPhone || "Phone Number"}</p>
                </div>
              </div>
              <div class="customer-box">
                <h3>From</h3>
                <div class="customer-details">
                  <p><strong>BARKAT AL-KHAIR</strong></p>
                  <p>KUWAIT CITY, SHARQ</p>
                  <p>TEL: 90947886, 99273356</p>
                  <p>CR: 1234567890</p>
                </div>
              </div>
            </div>

            <!-- Items Section -->
            <div class="items-section">
              <h3 class="section-header">Invoice Items</h3>
              <table>
                <thead>
                  <tr>
                    <th style="width: 35%">Description</th>
                    <th class="text-center" style="width: 8%">Qty</th>
                    <th class="text-right" style="width: 12%">Weight</th>
                    <th class="text-right" style="width: 10%">Purity</th>
                    <th class="text-right" style="width: 15%">Rate (KWD)</th>
                    <th class="text-right" style="width: 20%">Amount (KWD)</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRowsHTML}
                </tbody>
              </table>
            </div>
          
            <!-- Payment Terms -->
            <div class="payment-terms">
              <h4>Payment Terms</h4>
              <p>Payment is due within 7 days from invoice date. Late payments may incur a 2% monthly fee. All prices are in Kuwaiti Dinars (KWD).</p>
            </div>

            <!-- Totals -->
            <div class="totals-section">
              <div class="totals-box">
                <div class="total-row grand-total">
                  <span class="total-label">Total Amount</span>
                  <span class="total-value">${total.toLocaleString("en-US", { minimumFractionDigits: 3 })}<span class="currency">KWD</span></span>
                </div>
              </div>
            </div>

            <!-- Notes -->
            ${invoice.notes ? `
              <div class="notes-section">
                <h4>Notes</h4>
                <p>${invoice.notes}</p>
              </div>
            ` : ""}

            <!-- Footer -->
            <div class="footer">
              <p>Thank you for your business with Barkat Al-Khair</p>
              <p>This is a computer-generated invoice and does not require a signature</p>
              <p>For inquiries, please contact us at 90947886, 99273356</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
              
              window.onafterprint = function() {
                setTimeout(function() {
                  window.close();
                }, 100);
              };
            };
          </script>
        </body>
        </html>
      `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    toast.success("PDF download initiated! Check your print dialog.");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-slate-100">
            Invoices
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Create and manage customer invoices
          </p>
        </div>

        {/* Action Buttons - Stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleDuplicateInvoice}
              className="gap-2 flex-1 sm:flex-none"
              size="sm"
            >
              <Copy className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Duplicate</span>
              <span className="sm:hidden">Copy</span>
            </Button>
            <Button
              onClick={handleSaveInvoice}
              className="gap-2 flex-1 sm:flex-none"
              size="sm"
            >
              <Save className="w-3 h-3 md:w-4 md:h-4" />
              Save
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="gap-2 flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Download className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
        {/* Invoice Editor - Full width on mobile */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Invoice Header */}
          <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl dark:text-slate-100">
                Invoice Details
              </CardTitle>
              <CardDescription className="dark:text-slate-400">
                Basic invoice information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber" className="text-sm">
                    Invoice Number
                  </Label>
                  <Input
                    id="invoiceNumber"
                    value={invoice.invoiceNumber}
                    onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm">
                    Status
                  </Label>
                  <Select
                    value={invoice.status}
                    onValueChange={(
                      value:
                        | "draft"
                        | "sent"
                        | "paid"
                        | "overdue"
                        | "issued"
                        | "received"
                    ) => handleInputChange("status", value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="issued">Issued</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm">
                    Invoice Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={invoice.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-sm">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl dark:text-slate-100">
                Customer Information
              </CardTitle>
              <CardDescription className="dark:text-slate-400">
                Bill to details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-sm">
                  Customer Name
                </Label>
                <Input
                  id="customerName"
                  value={invoice.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  placeholder="Enter customer name"
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress" className="text-sm">
                  Address
                </Label>
                <Input
                  id="customerAddress"
                  value={invoice.customerAddress}
                  onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                  className="min-h-[60px] md:min-h-[80px] text-sm"
                  placeholder="Enter customer address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="text-sm">
                  Phone Number
                </Label>
                <Input
                  id="customerPhone"
                  value={invoice.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                  placeholder="Enter phone number"
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items - Mobile Optimized */}
          <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg md:text-xl dark:text-slate-100">
                  Invoice Items
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Products and services
                </CardDescription>
              </div>
              <Button onClick={addNewItem} size="sm" className="gap-1 md:gap-2">
                <Plus className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Add Item</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoice.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start p-3 border rounded-lg dark:border-slate-700"
                  >
                    <div className="sm:col-span-12 md:col-span-4 space-y-2">
                      <Label htmlFor={`item-desc-${item.id}`} className="text-xs">
                        Description
                      </Label>
                      <Input
                        id={`item-desc-${item.id}`}
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(item.id, "description", e.target.value)
                        }
                        placeholder="Item description"
                        className="text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-12 gap-2 sm:col-span-12 md:col-span-8">
                      <div className="sm:col-span-3 space-y-2">
                        <Label htmlFor={`item-qty-${item.id}`} className="text-xs">
                          Qty
                        </Label>
                        <Input
                          id={`item-qty-${item.id}`}
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "quantity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="sm:col-span-3 space-y-2">
                        <Label htmlFor={`item-weight-${item.id}`} className="text-xs">
                          Weight (g)
                        </Label>
                        <Input
                          id={`item-weight-${item.id}`}
                          type="number"
                          step="0.001"
                          value={item.weight}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "weight",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0.000"
                          className="text-sm"
                        />
                      </div>
                      <div className="sm:col-span-3 space-y-2">
                        <Label htmlFor={`item-purity-${item.id}`} className="text-xs">
                          Purity
                        </Label>
                        <Input
                          id={`item-purity-${item.id}`}
                          type="number"
                          value={item.purity}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "purity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="sm:col-span-3 space-y-2">
                        <Label htmlFor={`item-rate-${item.id}`} className="text-xs">
                          Rate
                        </Label>
                        <Input
                          id={`item-rate-${item.id}`}
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "rate",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0.00"
                          className="text-sm"
                        />
                      </div>
                      <div className="sm:col-span-6 space-y-2">
                        <Label className="text-xs">Amount (KWD)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={item.amount}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "amount",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            type="number"
                            className="font-medium text-sm"
                          />
                          {invoice.items.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 h-9"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl dark:text-slate-100">
                Notes
              </CardTitle>
              <CardDescription className="dark:text-slate-400">
                Additional information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={invoice.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="min-h-[60px] md:min-h-[80px] text-sm"
                placeholder="Thank you for your business!"
              />
            </CardContent>
          </Card>
        </div>

        {/* Invoice Preview & Totals - Collapsible on mobile */}
        <div className="space-y-4 md:space-y-6">
          {/* Mobile Preview Toggle */}
          <Button
            variant="outline"
            className="w-full lg:hidden flex items-center justify-between"
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          >
            <span>Preview & Totals</span>
            {isPreviewOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          <div className={`space-y-4 md:space-y-6 ${isPreviewOpen ? "block" : "hidden lg:block"}`}>
            {/* Invoice Preview */}
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg dark:text-slate-100">
                  Invoice Preview
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Real-time preview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
                  <div className="text-center mb-3">
                    <h3 className="font-bold text-base md:text-lg dark:text-slate-100">
                      BARKAT AL-KHAIR
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                      Invoice #{invoice.invoiceNumber}
                    </p>
                  </div>
                  <div className="text-xs space-y-1 dark:text-slate-300">
                    <p>
                      <strong>Date:</strong> {formatDate(invoice.date)}
                    </p>
                    <p>
                      <strong>Due Date:</strong> {formatDate(invoice.dueDate)}
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
                        className="text-xs"
                      >
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </p>
                    <p>
                      <strong>Total Amount:</strong> {invoice.total.toLocaleString()} KWD
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Totals */}
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg dark:text-slate-100">
                  Invoice Totals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between border-t pt-2 dark:border-slate-700">
                  <span className="font-bold dark:text-slate-100">Total Amount:</span>
                  <span className="font-bold text-base md:text-lg dark:text-slate-100">
                    {invoice.total.toLocaleString()} KWD
                  </span>
                </div>
                <Button onClick={recalculateTotals} className="w-full mt-2 text-sm">
                  Recalculate Totals
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg dark:text-slate-100">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 dark:border-slate-700 dark:text-slate-300 text-sm"
                >
                  <FileText className="w-3 h-3 md:w-4 md:h-4" />
                  New Invoice
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 dark:border-slate-700 dark:text-slate-300 text-sm"
                >
                  <User className="w-3 h-3 md:w-4 md:h-4" />
                  Add Customer
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 dark:border-slate-700 dark:text-slate-300 text-sm"
                >
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  Schedule Reminder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}