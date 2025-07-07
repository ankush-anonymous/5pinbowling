"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Settings, FileText, Trophy } from "lucide-react"
import { BusinessHoursTab } from "./business-hours-tab"
import { UpdatesTab } from "./updates-tab"
import { LeaguesTab } from "./leagues-tab"

export function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated")
    router.push("/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎳</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">5pinbowlin Admin</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Updates</span>
            </TabsTrigger>
            <TabsTrigger value="leagues" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Leagues</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <BusinessHoursTab />
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <UpdatesTab />
          </TabsContent>

          <TabsContent value="leagues" className="space-y-6">
            <LeaguesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
