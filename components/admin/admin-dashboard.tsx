"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Package, MessageSquare, Trophy } from "lucide-react"
import { BusinessHoursTab } from "./business-hours-tab"
import { UpdatesTab } from "./updates-tab"
import { LeaguesTab } from "./leagues-tab"
import { PackagesTab } from "./packages-tab"
import { WeeklyTimeline } from "./weekly-timeline"

// Mock data for booked slots timeline
// const mockBookedSlots = [
//   {
//     id: "1",
//     date: "2024-01-15",
//     slots: [
//       { time: "10:00", lane: 1, customer: "John Doe", status: "confirmed" },
//       { time: "11:00", lane: 2, customer: "Jane Smith", status: "pending" },
//       { time: "14:00", lane: 1, customer: "Bob Wilson", status: "confirmed" },
//       { time: "16:00", lane: 3, customer: "Alice Brown", status: "confirmed" },
//     ],
//   },
//   {
//     id: "2",
//     date: "2024-01-16",
//     slots: [
//       { time: "09:00", lane: 2, customer: "Mike Johnson", status: "confirmed" },
//       { time: "13:00", lane: 1, customer: "Sarah Davis", status: "pending" },
//       { time: "15:00", lane: 3, customer: "Tom Anderson", status: "confirmed" },
//     ],
//   },
//   {
//     id: "3",
//     date: "2024-01-17",
//     slots: [
//       { time: '11:00", lane 1, customer: "Emma Wilson', status: "confirmed" },
//       { time: "14:00", lane: 2, customer: "David Lee", status: "confirmed" },
//     ],
//   },
// ]

export function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState<string>("2024-01-15")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // const selectedDaySlots = mockBookedSlots.find((day) => day.date === selectedDate)?.slots || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your bowling center operations</p>
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
          {/* <TabsTrigger value="leagues" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Leagues</span>
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="bookings" className="space-y-6">
          <WeeklyTimeline />
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

        {/* <TabsContent value="leagues">
          <LeaguesTab />
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
