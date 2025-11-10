"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Save, Bell, Shield, Database, Palette } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    autoBackup: true,
    privateMode: false,
    darkMode: false,
    goldRateAlerts: true
  })

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your workshop preferences</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="gap-2 w-full sm:w-auto">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Settings Categories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Settings */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your alert preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-slate-500">Receive alerts for important events</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(value) => updateSetting('notifications', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="goldRateAlerts">Gold Rate Alerts</Label>
                    <p className="text-sm text-slate-500">Get notified about gold price changes</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>Protect your workshop data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="privateMode">Private Mode</Label>
                    <p className="text-sm text-slate-500">Hide gold stock values from dashboard</p>
                  </div>
                  <Switch
                    id="privateMode"
                    checked={settings.privateMode}
                    onCheckedChange={(value) => updateSetting('privateMode', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBackup">Auto Backup</Label>
                    <p className="text-sm text-slate-500">Automatically backup your data daily</p>
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

          {/* Appearance Settings */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize the interface</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-slate-500">Switch to dark theme</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={settings.darkMode}
                    onCheckedChange={(value) => updateSetting('darkMode', value)}
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Export All Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Backup Now
                </Button>
                <Separator />
                <Button variant="outline" className="w-full justify-start text-rose-600 hover:text-rose-700">
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Info */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Last Backup</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Data Size</span>
                  <span className="font-medium">4.7 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Transactions</span>
                  <span className="font-medium">142 records</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}