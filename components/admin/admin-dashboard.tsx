"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Package, MessageSquare, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BusinessHoursTab } from "./business-hours-tab"
import { UpdatesTab } from "./updates-tab"
import { LeaguesTab } from "./leagues-tab"
import { PackagesTab } from "./packages-tab"
import { WeeklyTimeline } from "./weekly-timeline"
import { AvailableSlots } from "./available-slots"

export function AdminDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("isAdminAuthenticated") // For cleanup of old auth
    router.push("/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your bowling center operations</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookings" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Packages</span>
          </TabsTrigger>
          <TabsTrigger value="business-hours" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Business Hours</span>
          </TabsTrigger>
          <TabsTrigger value="updates" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Updates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-6">
          <AvailableSlots />
        </TabsContent>

        <TabsContent value="packages">
          <PackagesTab />
        </TabsContent>

        <TabsContent value="business-hours">
          <BusinessHoursTab />
        </TabsContent>

        <TabsContent value="updates">
          <UpdatesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
