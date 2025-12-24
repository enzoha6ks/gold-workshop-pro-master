// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { Save, Bell, Shield, Database, Palette, Moon, Sun, Monitor } from "lucide-react"
// import { useTheme } from "@/contexts/theme-provider"
// import { toast } from "sonner"

// export default function SettingsPage() {
//   const { theme, setTheme } = useTheme()
//   const [settings, setSettings] = useState({
//     notifications: true,
//     autoBackup: true,
//     privateMode: false,
//     goldRateAlerts: true
//   })

//   // Initialize settings from localStorage
//   useEffect(() => {
//     const savedSettings = localStorage.getItem("goldpro-settings")
//     if (savedSettings) {
//       setSettings(JSON.parse(savedSettings))
//     }
//   }, [])

//   const updateSetting = (key: string, value: boolean) => {
//     const newSettings = { ...settings, [key]: value }
//     setSettings(newSettings)
//     localStorage.setItem("goldpro-settings", JSON.stringify(newSettings))
//   }

//   const handleSaveChanges = () => {
//     localStorage.setItem("goldpro-settings", JSON.stringify(settings))
//     toast.success("Settings saved successfully!")
//   }

//   const handleExportData = () => {
//     // Implement data export logic
//     const data = {
//       settings,
//       theme,
//       exportDate: new Date().toISOString()
//     }
//     const dataStr = JSON.stringify(data, null, 2)
//     const dataBlob = new Blob([dataStr], { type: 'application/json' })
//     const url = URL.createObjectURL(dataBlob)
//     const link = document.createElement('a')
//     link.href = url
//     link.download = `goldpro-settings-${new Date().toISOString().split('T')[0]}.json`
//     link.click()
//     URL.revokeObjectURL(url)
//     toast.success("Settings exported successfully!")
//   }

//   const handleBackupNow = () => {
//     localStorage.setItem("goldpro-last-backup", new Date().toLocaleString())
//     toast.success("Data backed up successfully!")
//   }

//   const handleClearData = () => {
//     if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
//       localStorage.clear()
//       toast.success("All data cleared successfully!")
//       // Reload the page to reset the application
//       setTimeout(() => window.location.reload(), 1000)
//     }
//   }

//   const getSystemInfo = () => {
//     const dataSize = JSON.stringify(localStorage).length / 1024 / 1024 // Convert to MB
//     const lastBackup = localStorage.getItem("goldpro-last-backup") || "Never"
    
//     return {
//       version: "1.0.0",
//       lastBackup,
//       dataSize: dataSize.toFixed(2) + " MB",
//       transactions: Object.keys(localStorage).length + " items"
//     }
//   }

//   const systemInfo = getSystemInfo()

//   return (
//     <div className="p-4 md:p-6 space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
//       >
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
//           <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your workshop preferences</p>
//         </div>
//         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//           <Button onClick={handleSaveChanges} className="gap-2 w-full sm:w-auto">
//             <Save className="w-4 h-4" />
//             Save Changes
//           </Button>
//         </motion.div>
//       </motion.div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Settings Categories */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Appearance Settings */}
//           <motion.div whileHover={{ scale: 1.01 }}>
//             <Card className="dark:bg-slate-900 dark:border-slate-800">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 dark:text-slate-100">
//                   <Palette className="w-5 h-5" />
//                   Appearance
//                 </CardTitle>
//                 <CardDescription className="dark:text-slate-400">Customize the interface appearance</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-4">
//                   <Label className="text-sm font-medium dark:text-slate-300">Theme</Label>
//                   <div className="grid grid-cols-3 gap-3">
//                     <Button
//                       variant={theme === "light" ? "default" : "outline"}
//                       onClick={() => setTheme("light")}
//                       className="flex flex-col items-center gap-2 h-auto py-4 dark:border-slate-700 dark:text-slate-300"
//                     >
//                       <Sun className="w-5 h-5" />
//                       <span>Light</span>
//                     </Button>
//                     <Button
//                       variant={theme === "dark" ? "default" : "outline"}
//                       onClick={() => setTheme("dark")}
//                       className="flex flex-col items-center gap-2 h-auto py-4 dark:border-slate-700 dark:text-slate-300"
//                     >
//                       <Moon className="w-5 h-5" />
//                       <span>Dark</span>
//                     </Button>
//                     <Button
//                       variant={theme === "system" ? "default" : "outline"}
//                       onClick={() => setTheme("system")}
//                       className="flex flex-col items-center gap-2 h-auto py-4 dark:border-slate-700 dark:text-slate-300"
//                     >
//                       <Monitor className="w-5 h-5" />
//                       <span>System</span>
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="space-y-0.5">
//                     <Label htmlFor="privateMode" className="dark:text-slate-300">Private Mode</Label>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">Hide gold stock values from dashboard</p>
//                   </div>
//                   <Switch
//                     id="privateMode"
//                     checked={settings.privateMode}
//                     onCheckedChange={(value) => updateSetting('privateMode', value)}
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Notification Settings */}
//           <motion.div whileHover={{ scale: 1.01 }}>
//             <Card className="dark:bg-slate-900 dark:border-slate-800">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 dark:text-slate-100">
//                   <Bell className="w-5 h-5" />
//                   Notifications
//                 </CardTitle>
//                 <CardDescription className="dark:text-slate-400">Manage your alert preferences</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-0.5">
//                     <Label htmlFor="notifications" className="dark:text-slate-300">Push Notifications</Label>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts for important events</p>
//                   </div>
//                   <Switch
//                     id="notifications"
//                     checked={settings.notifications}
//                     onCheckedChange={(value) => updateSetting('notifications', value)}
//                   />
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-0.5">
//                     <Label htmlFor="goldRateAlerts" className="dark:text-slate-300">Gold Rate Alerts</Label>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">Get notified about gold price changes</p>
//                   </div>
//                   <Switch
//                     id="goldRateAlerts"
//                     checked={settings.goldRateAlerts}
//                     onCheckedChange={(value) => updateSetting('goldRateAlerts', value)}
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Security Settings */}
//           <motion.div whileHover={{ scale: 1.01 }}>
//             <Card className="dark:bg-slate-900 dark:border-slate-800">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 dark:text-slate-100">
//                   <Shield className="w-5 h-5" />
//                   Security & Privacy
//                 </CardTitle>
//                 <CardDescription className="dark:text-slate-400">Protect your workshop data</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-0.5">
//                     <Label htmlFor="autoBackup" className="dark:text-slate-300">Auto Backup</Label>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">Automatically backup your data daily</p>
//                   </div>
//                   <Switch
//                     id="autoBackup"
//                     checked={settings.autoBackup}
//                     onCheckedChange={(value) => updateSetting('autoBackup', value)}
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>

//         {/* Right Column - Quick Actions & Info */}
//         <div className="space-y-6">
//           {/* Data Management */}
//           <motion.div whileHover={{ scale: 1.02 }}>
//             <Card className="dark:bg-slate-900 dark:border-slate-800">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 dark:text-slate-100">
//                   <Database className="w-5 h-5" />
//                   Data Management
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <Button 
//                   variant="outline" 
//                   onClick={handleExportData} 
//                   className="w-full justify-start dark:border-slate-700 dark:text-slate-300 hover:dark:bg-slate-800"
//                 >
//                   Export All Data
//                 </Button>
//                 <Button 
//                   variant="outline" 
//                   onClick={handleBackupNow} 
//                   className="w-full justify-start dark:border-slate-700 dark:text-slate-300 hover:dark:bg-slate-800"
//                 >
//                   Backup Now
//                 </Button>
//                 <Separator className="dark:bg-slate-700" />
//                 <Button 
//                   variant="outline" 
//                   onClick={handleClearData}
//                   className="w-full justify-start text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 dark:border-slate-700 hover:dark:bg-slate-800"
//                 >
//                   Clear All Data
//                 </Button>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* System Info */}
//           <motion.div whileHover={{ scale: 1.02 }}>
//             <Card className="dark:bg-slate-900 dark:border-slate-800">
//               <CardHeader>
//                 <CardTitle className="dark:text-slate-100">System Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-slate-600 dark:text-slate-400">Version</span>
//                   <span className="font-medium dark:text-slate-300">{systemInfo.version}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-600 dark:text-slate-400">Last Backup</span>
//                   <span className="font-medium dark:text-slate-300">{systemInfo.lastBackup}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-600 dark:text-slate-400">Data Size</span>
//                   <span className="font-medium dark:text-slate-300">{systemInfo.dataSize}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-600 dark:text-slate-400">Storage Items</span>
//                   <span className="font-medium dark:text-slate-300">{systemInfo.transactions}</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Save, Bell, Shield, Database, Palette, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/contexts/theme-provider"
import { toast } from "sonner"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    notifications: true,
    autoBackup: true,
    privateMode: false,
    goldRateAlerts: true
  })
  const [isClient, setIsClient] = useState(false)

  // Initialize settings from localStorage only on client side
  useEffect(() => {
    setIsClient(true)
    const savedSettings = localStorage.getItem("goldpro-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSetting = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    if (isClient) {
      localStorage.setItem("goldpro-settings", JSON.stringify(newSettings))
    }
  }

  const handleSaveChanges = () => {
    if (isClient) {
      localStorage.setItem("goldpro-settings", JSON.stringify(settings))
    }
    toast.success("Settings saved successfully!")
  }

  const handleExportData = () => {
    if (!isClient) return
    
    // Implement data export logic
    const data = {
      settings,
      theme,
      exportDate: new Date().toISOString()
    }
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `goldpro-settings-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Settings exported successfully!")
  }

  const handleBackupNow = () => {
    if (isClient) {
      localStorage.setItem("goldpro-last-backup", new Date().toLocaleString())
    }
    toast.success("Data backed up successfully!")
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      if (isClient) {
        localStorage.clear()
      }
      toast.success("All data cleared successfully!")
      // Reload the page to reset the application
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  const getSystemInfo = () => {
    if (!isClient) {
      return {
        version: "1.0.0",
        lastBackup: "Loading...",
        dataSize: "0.00 MB",
        transactions: "0 items"
      }
    }
    
    const dataSize = JSON.stringify(localStorage).length / 1024 / 1024 // Convert to MB
    const lastBackup = localStorage.getItem("goldpro-last-backup") || "Never"
    
    return {
      version: "1.0.0",
      lastBackup,
      dataSize: dataSize.toFixed(2) + " MB",
      transactions: Object.keys(localStorage).length + " items"
    }
  }

  const systemInfo = getSystemInfo()

  // Show loading state during server-side rendering
  if (!isClient) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Loading settings...</p>
          </div>
          <Button disabled className="gap-2 w-full sm:w-auto">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="dark:bg-slate-900 dark:border-slate-800">
                <CardHeader>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2].map((subItem) => (
                      <div key={subItem} className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-48 animate-pulse"></div>
                        </div>
                        <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="space-y-6">
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-9 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                ))}
              </CardContent>
            </Card>
            
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex justify-between">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 animate-pulse"></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your workshop preferences</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleSaveChanges} className="gap-2 w-full sm:w-auto">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Settings Categories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance Settings */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                  <Palette className="w-5 h-5" />
                  Appearance
                </CardTitle>
                <CardDescription className="dark:text-slate-400">Customize the interface appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium dark:text-slate-300">Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      className="flex flex-col items-center gap-2 h-auto py-4 dark:border-slate-700 dark:text-slate-300"
                    >
                      <Sun className="w-5 h-5" />
                      <span>Light</span>
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className="flex flex-col items-center gap-2 h-auto py-4 dark:border-slate-700 dark:text-slate-300"
                    >
                      <Moon className="w-5 h-5" />
                      <span>Dark</span>
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                      className="flex flex-col items-center gap-2 h-auto py-4 dark:border-slate-700 dark:text-slate-300"
                    >
                      <Monitor className="w-5 h-5" />
                      <span>System</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="privateMode" className="dark:text-slate-300">Private Mode</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Hide gold stock values from dashboard</p>
                  </div>
                  <Switch
                    id="privateMode"
                    checked={settings.privateMode}
                    onCheckedChange={(value) => updateSetting('privateMode', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription className="dark:text-slate-400">Manage your alert preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="dark:text-slate-300">Push Notifications</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts for important events</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(value) => updateSetting('notifications', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="goldRateAlerts" className="dark:text-slate-300">Gold Rate Alerts</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Get notified about gold price changes</p>
                  </div>
                  <Switch
                    id="goldRateAlerts"
                    checked={settings.goldRateAlerts}
                    onCheckedChange={(value) => updateSetting('goldRateAlerts', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                  <Shield className="w-5 h-5" />
                  Security & Privacy
                </CardTitle>
                <CardDescription className="dark:text-slate-400">Protect your workshop data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBackup" className="dark:text-slate-300">Auto Backup</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Automatically backup your data daily</p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={settings.autoBackup}
                    onCheckedChange={(value) => updateSetting('autoBackup', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-6">
          {/* Data Management */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                  <Database className="w-5 h-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={handleExportData} 
                  className="w-full justify-start dark:border-slate-700 dark:text-slate-300 hover:dark:bg-slate-800"
                >
                  Export All Data
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleBackupNow} 
                  className="w-full justify-start dark:border-slate-700 dark:text-slate-300 hover:dark:bg-slate-800"
                >
                  Backup Now
                </Button>
                <Separator className="dark:bg-slate-700" />
                <Button 
                  variant="outline" 
                  onClick={handleClearData}
                  className="w-full justify-start text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 dark:border-slate-700 hover:dark:bg-slate-800"
                >
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Info */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="dark:text-slate-100">System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Version</span>
                  <span className="font-medium dark:text-slate-300">{systemInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Last Backup</span>
                  <span className="font-medium dark:text-slate-300">{systemInfo.lastBackup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Data Size</span>
                  <span className="font-medium dark:text-slate-300">{systemInfo.dataSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Storage Items</span>
                  <span className="font-medium dark:text-slate-300">{systemInfo.transactions}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}