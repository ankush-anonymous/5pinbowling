"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BusinessHoursTab } from "./business-hours-tab"
import { PackagesTab } from "./packages-tab"
import { UpdatesTab } from "./updates-tab"
import { LeaguesTab } from "./leagues-tab"
import { Calendar, Package, Clock, Megaphone, Trophy } from "lucide-react"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("bookings")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your bowling center operations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
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
              <Megaphone className="w-4 h-4" />
              <span>Updates</span>
            </TabsTrigger>
            <TabsTrigger value="leagues" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Leagues</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Booking Management</span>
                </CardTitle>
                <CardDescription>View and manage all bowling reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Access the full booking management system to view, edit, and create new reservations.
                </p>
                <a
                  href="/admin/bookings"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Open Booking Management
                </a>
              </CardContent>
            </Card>
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

          <TabsContent value="leagues">
            <LeaguesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
