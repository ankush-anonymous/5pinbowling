"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Edit, Save, X, Clock, Calendar } from "lucide-react"

const initialBusinessHours = [
  { day: "Monday", isOpen: false, openTime: "12:00", closeTime: "21:00" },
  { day: "Tuesday", isOpen: false, openTime: "12:00", closeTime: "21:00" },
  { day: "Wednesday", isOpen: false, openTime: "12:00", closeTime: "21:00" },
  { day: "Thursday", isOpen: true, openTime: "12:00", closeTime: "21:00" },
  { day: "Friday", isOpen: true, openTime: "12:00", closeTime: "21:00" },
  { day: "Saturday", isOpen: true, openTime: "11:00", closeTime: "22:00" },
  { day: "Sunday", isOpen: true, openTime: "11:00", closeTime: "19:00" },
]

const sampleBookedSlots = [
  {
    id: 1,
    date: "2024-01-20",
    time: "14:00",
    duration: "2 hours",
    customerName: "John Smith",
    package: "Birthday Party",
    lane: "Lane 3",
    status: "Confirmed",
  },
  {
    id: 2,
    date: "2024-01-20",
    time: "16:30",
    duration: "1 hour",
    customerName: "Sarah Johnson",
    package: "Economical Bowling",
    lane: "Lane 1",
    status: "Confirmed",
  },
  {
    id: 3,
    date: "2024-01-21",
    time: "13:00",
    duration: "3 hours",
    customerName: "Corporate Event - ABC Corp",
    package: "Corporate Package",
    lane: "Lanes 4-6",
    status: "Pending",
  },
]

export function BusinessHoursTab() {
  const [businessHours, setBusinessHours] = useState(initialBusinessHours)
  const [editingHours, setEditingHours] = useState(false)
  const [bookedSlots] = useState(sampleBookedSlots)

  const handleSaveHours = () => {
    setEditingHours(false)
    // Here you would save to your backend
    console.log("Saving business hours:", businessHours)
  }

  const handleHourChange = (index: number, field: string, value: any) => {
    const updated = [...businessHours]
    updated[index] = { ...updated[index], [field]: value }
    setBusinessHours(updated)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Business Hours Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Business Hours</span>
              </CardTitle>
              <CardDescription>Manage your bowling center's operating hours</CardDescription>
            </div>
            <div className="flex space-x-2">
              {editingHours ? (
                <>
                  <Button onClick={handleSaveHours} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={() => setEditingHours(false)} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditingHours(true)} size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessHours.map((day, index) => (
              <div key={day.day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-20 font-medium text-gray-900">{day.day}</div>
                  {editingHours ? (
                    <Switch
                      checked={day.isOpen}
                      onCheckedChange={(checked) => handleHourChange(index, "isOpen", checked)}
                    />
                  ) : (
                    <div
                      className={`px-2 py-1 rounded text-sm ${day.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {day.isOpen ? "Open" : "Closed"}
                    </div>
                  )}
                </div>

                {day.isOpen && (
                  <div className="flex items-center space-x-4">
                    {editingHours ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`open-${index}`} className="text-sm">
                            Open:
                          </Label>
                          <Input
                            id={`open-${index}`}
                            type="time"
                            value={day.openTime}
                            onChange={(e) => handleHourChange(index, "openTime", e.target.value)}
                            className="w-24"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`close-${index}`} className="text-sm">
                            Close:
                          </Label>
                          <Input
                            id={`close-${index}`}
                            type="time"
                            value={day.closeTime}
                            onChange={(e) => handleHourChange(index, "closeTime", e.target.value)}
                            className="w-24"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-600">
                        {day.openTime} - {day.closeTime}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booked Slots Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Booked Slots</span>
          </CardTitle>
          <CardDescription>Current bookings and reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookedSlots.map((slot) => (
              <div key={slot.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <h4 className="font-semibold text-gray-900">{slot.customerName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slot.status)}`}>
                        {slot.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>📅 {slot.date}</span>
                      <span>🕐 {slot.time}</span>
                      <span>⏱️ {slot.duration}</span>
                      <span>🎳 {slot.lane}</span>
                    </div>
                    <div className="text-sm text-primary font-medium">{slot.package}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
