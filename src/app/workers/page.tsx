

// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Plus, TrendingUp, TrendingDown, Users } from "lucide-react";
// import { loadWorkers, saveWorkers } from "@/lib/storage";
// import { v4 as uuidv4 } from "uuid";
// import { useAppStore } from "@/lib/store";
// import { toast } from "sonner";

// // Motion variants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.1 },
//   },
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: { y: 0, opacity: 1 },
// };

// export default function WorkersPage() {
//   const [workers, setWorkers] = useState<any[]>([]);
//   const [newWorkerName, setNewWorkerName] = useState("");
//   const [open, setOpen] = useState(false);

//   // Load from localStorage
//   useEffect(() => {
//     setWorkers(loadWorkers());
//   }, []);

//   // Add new worker
//   const handleAddWorker = () => {
//     if (!newWorkerName.trim()) return;
//     const newWorker = {
//       id: uuidv4(),
//       name: newWorkerName.trim(),
//       totalIssued: 0,
//       totalReturned: 0,
//       totalLoss: 0,
//       efficiency: 0,
//     };
//     const updated = [...workers, newWorker];
//     setWorkers(updated);
//     saveWorkers(updated);
//     setNewWorkerName("");
//     setOpen(false);
//   };

//   const { addExtraLoss } = useAppStore();
//   const [openLossDialog, setOpenLossDialog] = useState(false);
//   const [workerName, setWorkerName] = useState("");
//   const [lossAmount, setLossAmount] = useState<number | "">("");
//   const [note, setNote] = useState("");

//   const handleAddLoss = () => {
//     if (!workerName || !lossAmount)
//       return toast.error("Enter worker name and loss amount");

//     const newLoss = {
//       id: Date.now().toString(),
//       worker: workerName,
//       amount: Number(lossAmount),
//       note,
//       date: new Date().toISOString(),
//     };

//     addExtraLoss(newLoss);
//     toast.success("Extra loss added successfully");
//     setWorkerName("");
//     setLossAmount("");
//     setNote("");
//     setOpenLossDialog(false);
//   };

//   // Calculations
//   const totalWorkers = workers.length;
//   const totalLoss = workers.reduce((sum, w) => sum + (w.totalLoss || 0), 0);
//   const totalIssued = workers.reduce((sum, w) => sum + (w.totalIssued || 0), 0);
//   const totalReturned = workers.reduce(
//     (sum, w) => sum + (w.totalReturned || 0),
//     0
//   );
//   const avgEfficiency =
//     totalWorkers > 0
//       ? (
//           workers.reduce((sum, w) => sum + Number(w.efficiency || 0), 0) /
//           totalWorkers
//         ).toFixed(1)
//       : 0;

//   const goldHandled = (totalIssued + totalReturned).toFixed(2);

//   return (
//     <div className="p-4 md:p-6 space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
//       >
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
//             Worker Management
//           </h1>
//           <p className="text-slate-600 mt-1">
//             Track worker performance and efficiency
//           </p>
//         </div>

//         {/* Add Worker Button (Dialog) */}
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Button className="gap-2 w-full sm:w-auto">
//                 <Plus className="w-4 h-4" />
//                 Add Worker
//               </Button>
//             </motion.div>
//           </DialogTrigger>
//           <DialogContent className="max-w-sm">
//             <DialogHeader>
//               <DialogTitle>Add New Worker</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-3">
//               <Input
//                 placeholder="Enter worker name"
//                 value={newWorkerName}
//                 onChange={(e) => setNewWorkerName(e.target.value)}
//               />
//               <Button onClick={handleAddWorker} className="w-full">
//                 Save Worker
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>

//         <Dialog open={openLossDialog} onOpenChange={setOpenLossDialog}>
//           <DialogTrigger asChild>
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Button variant="outline" className="gap-2 w-full sm:w-auto">
//                 <TrendingDown className="w-4 h-4 text-rose-600" />
//                 Add Extra Loss
//               </Button>
//             </motion.div>
//           </DialogTrigger>
//           <DialogContent className="max-w-sm">
//             <DialogHeader>
//               <DialogTitle>Add Extra Loss</DialogTitle>
//             </DialogHeader>
//             const [lossAmount, setLossAmount] = useState("") // Keep as string
//             <div className="space-y-3">
//               <Input
//                 placeholder="Worker name"
//                 value={workerName}
//                 onChange={(e) => setWorkerName(e.target.value)}
//               />
//               <Input
//                 type="number"
//                 placeholder="Loss in grams"
//                 value={lossAmount} // Now this is a string
//                 onChange={(e) => setLossAmount(e.target.value)} // Direct string assignment
//               />
//               <Input
//                 placeholder="Optional note"
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//               />
//               <Button
//                 onClick={handleAddLoss}
//                 className="w-full"
//                 disabled={!workerName.trim() || !lossAmount}
//               >
//                 Save Loss
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </motion.div>

//       {/* Stats Overview */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
//       >
//         {[
//           {
//             title: "Total Workers",
//             value: totalWorkers,
//             icon: "👷",
//             color: "text-slate-900",
//           },
//           {
//             title: "Avg Efficiency",
//             value: `${avgEfficiency}%`,
//             icon: <TrendingUp className="w-4 h-4" />,
//             color: "text-emerald-600",
//           },
//           {
//             title: "Gold Handled",
//             value: `${goldHandled}g`,
//             icon: "💰",
//             color: "text-slate-900",
//           },
//           {
//             title: "work Loss",
//             value: `${totalLoss.toFixed(3)}g`,
//             icon: <TrendingDown className="w-4 h-4" />,
//             color: "text-rose-600",
//           },
//         ].map((stat, index) => (
//           <motion.div key={index} variants={itemVariants}>
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               transition={{ type: "spring", stiffness: 400 }}
//             >
//               <Card className="h-full">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     {stat.title}
//                   </CardTitle>
//                   {stat.icon}
//                 </CardHeader>
//                 <CardContent>
//                   <div
//                     className={`text-xl md:text-2xl font-bold ${stat.color}`}
//                   >
//                     {stat.value}
//                   </div>
//                   <p className="text-xs text-slate-500">Active workers</p>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Workers List */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3 }}
//       >
//         <Card>
//           <CardHeader>
//             <CardTitle>Worker Performance</CardTitle>
//             <CardDescription>
//               Efficiency and gold handling metrics
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {workers.length === 0 ? (
//               <div className="text-center py-12">
//                 <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900">
//                   No workers yet
//                 </h3>
//                 <p className="text-gray-500 mt-1">
//                   Workers will appear here when you issue gold to them
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {workers.map((worker) => (
//                   <motion.div
//                     key={worker.id}
//                     variants={itemVariants}
//                     initial="hidden"
//                     animate="visible"
//                   >
//                     <Card className="hover:shadow-md transition-shadow">
//                       <CardContent className="flex items-center justify-between py-4">
//                         <div className="flex items-center gap-3">
//                           <Avatar className="h-10 w-10">
//                             <AvatarFallback>
//                               {worker.name[0]?.toUpperCase()}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <p className="font-semibold text-lg">
//                               {worker.name}
//                             </p>
//                             <p className="text-sm text-slate-500">
//                               Issued: {worker.totalIssued.toFixed(2)}g •
//                               Returned: {worker.totalReturned.toFixed(2)}g
//                             </p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <Badge variant="secondary" className="text-sm">
//                             Efficiency: {worker.efficiency || 0}%
//                           </Badge>
//                           <p className="text-xs text-rose-600 mt-1">
//                             Loss: {worker.totalLoss.toFixed(3)}g
//                           </p>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, TrendingUp, TrendingDown, Users } from "lucide-react";
import { loadWorkers, saveWorkers } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

// Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function WorkersPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [newWorkerName, setNewWorkerName] = useState("");
  const [open, setOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setWorkers(loadWorkers());
  }, []);

  // Add new worker
  const handleAddWorker = () => {
    if (!newWorkerName.trim()) return;
    const newWorker = {
      id: uuidv4(),
      name: newWorkerName.trim(),
      totalIssued: 0,
      totalReturned: 0,
      totalLoss: 0,
      efficiency: 0,
    };
    const updated = [...workers, newWorker];
    setWorkers(updated);
    saveWorkers(updated);
    setNewWorkerName("");
    setOpen(false);
  };

  const { addExtraLoss } = useAppStore();
  const [openLossDialog, setOpenLossDialog] = useState(false);
  const [workerName, setWorkerName] = useState("");
  const [lossAmount, setLossAmount] = useState(""); // Changed to string
  const [note, setNote] = useState("");

  const handleAddLoss = () => {
    if (!workerName.trim() || !lossAmount) {
      toast.error("Enter worker name and loss amount");
      return;
    }

    const lossValue = parseFloat(lossAmount);
    if (isNaN(lossValue) || lossValue <= 0) {
      toast.error("Please enter a valid loss amount greater than 0");
      return;
    }

    const newLoss = {
      id: Date.now().toString(),
      worker: workerName.trim(),
      amount: lossValue,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
    };

    addExtraLoss(newLoss);
    toast.success("Extra loss added successfully");
    setWorkerName("");
    setLossAmount("");
    setNote("");
    setOpenLossDialog(false);
  };

  // Calculations
  const totalWorkers = workers.length;
  const totalLoss = workers.reduce((sum, w) => sum + (w.totalLoss || 0), 0);
  const totalIssued = workers.reduce((sum, w) => sum + (w.totalIssued || 0), 0);
  const totalReturned = workers.reduce(
    (sum, w) => sum + (w.totalReturned || 0),
    0
  );
  const avgEfficiency =
    totalWorkers > 0
      ? (
          workers.reduce((sum, w) => sum + Number(w.efficiency || 0), 0) /
          totalWorkers
        ).toFixed(1)
      : 0;

  const goldHandled = (totalIssued + totalReturned).toFixed(2);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Worker Management
          </h1>
          <p className="text-slate-600 mt-1">
            Track worker performance and efficiency
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Add Worker Button (Dialog) */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  Add Worker
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Add New Worker</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder="Enter worker name"
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                />
                <Button 
                  onClick={handleAddWorker} 
                  className="w-full"
                  disabled={!newWorkerName.trim()}
                >
                  Save Worker
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Extra Loss Button */}
          <Dialog open={openLossDialog} onOpenChange={setOpenLossDialog}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                  Add Extra Loss
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Add Extra Loss</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder="Worker name"
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                />
                <Input
                  type="number"
                  step="0.001"
                  placeholder="Loss in grams"
                  value={lossAmount}
                  onChange={(e) => setLossAmount(e.target.value)}
                />
                <Input
                  placeholder="Optional note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button
                  onClick={handleAddLoss}
                  className="w-full"
                  disabled={!workerName.trim() || !lossAmount}
                >
                  Save Loss
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {[
          {
            title: "Total Workers",
            value: totalWorkers,
            icon: "👷",
            color: "text-slate-900",
          },
          {
            title: "Avg Efficiency",
            value: `${avgEfficiency}%`,
            icon: <TrendingUp className="w-4 h-4" />,
            color: "text-emerald-600",
          },
          {
            title: "Gold Handled",
            value: `${goldHandled}g`,
            icon: "💰",
            color: "text-slate-900",
          },
          {
            title: "Work Loss",
            value: `${totalLoss.toFixed(3)}g`,
            icon: <TrendingDown className="w-4 h-4" />,
            color: "text-rose-600",
          },
        ].map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-xl md:text-2xl font-bold ${stat.color}`}
                  >
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-500">Active workers</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Workers List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Worker Performance</CardTitle>
            <CardDescription>
              Efficiency and gold handling metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No workers yet
                </h3>
                <p className="text-gray-500 mt-1">
                  Add workers to start tracking their performance
                </p>
                <Button 
                  onClick={() => setOpen(true)} 
                  className="mt-4 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add First Worker
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {workers.map((worker) => (
                  <motion.div
                    key={worker.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {worker.name[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-lg">
                              {worker.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              Issued: {worker.totalIssued.toFixed(2)}g •
                              Returned: {worker.totalReturned.toFixed(2)}g
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="text-sm">
                            Efficiency: {worker.efficiency || 0}%
                          </Badge>
                          <p className="text-xs text-rose-600 mt-1">
                            Loss: {worker.totalLoss.toFixed(3)}g
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}