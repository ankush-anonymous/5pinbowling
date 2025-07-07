"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Edit, Save, X, Clock, Calendar, Plus } from "lucide-react"

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
    date: "2024-01-20",
    day: "Saturday",
    bookings: [
      {
        id: 1,
        startTime: "14:00",
        endTime: "16:00",
        customerName: "John Smith",
        package: "Birthday Party",
        lane: "Lane 3",
        status: "confirmed",
      },
      {
        id: 2,
        startTime: "16:30",
        endTime: "17:30",
        customerName: "Sarah Johnson",
        package: "Economical",
        lane: "Lane 1",
        status: "confirmed",
      },
      {
        id: 3,
        startTime: "18:00",
        endTime: "20:00",
        customerName: "Mike Davis",
        package: "Corporate",
        lane: "Lane 2",
        status: "pending",
      },
    ],
  },
  {
    date: "2024-01-21",
    day: "Sunday",
    bookings: [
      {
        id: 4,
        startTime: "13:00",
        endTime: "16:00",
        customerName: "ABC Corp",
        package: "Corporate",
        lane: "Lanes 4-6",
        status: "pending",
      },
      {
        id: 5,
        startTime: "17:00",
        endTime: "18:00",
        customerName: "Emma Wilson",
        package: "Economical",
        lane: "Lane 1",
        status: "confirmed",
      },
    ],
  },
  {
    date: "2024-01-22",
    day: "Monday",
    bookings: [],
  },
  {
    date: "2024-01-23",
    day: "Tuesday",
    bookings: [],
  },
  {
    date: "2024-01-24",
    day: "Wednesday",
    bookings: [],
  },
  {
    date: "2024-01-25",
    day: "Thursday",
    bookings: [
      {
        id: 6,
        startTime: "15:00",
        endTime: "17:00",
        customerName: "Birthday Party",
        package: "Birthday",
        lane: "Lane 5",
        status: "confirmed",
      },
    ],
  },
  {
    date: "2024-01-26",
    day: "Friday",
    bookings: [
      {
        id: 7,
        startTime: "19:00",
        endTime: "21:00",
        customerName: "Team Event",
        package: "Corporate",
        lane: "Lane 3",
        status: "confirmed",
      },
      {
        id: 8,
        startTime: "14:00",
        endTime: "15:00",
        customerName: "Lisa Brown",
        package: "Economical",
        lane: "Lane 2",
        status: "confirmed",
      },
    ],
  },
]

export function BusinessHoursTab() {
  const router = useRouter()
  const [businessHours, setBusinessHours] = useState(initialBusinessHours)
  const [editingHours, setEditingHours] = useState(false)
  const [bookedSlots] = useState(sampleBookedSlots)

  const handleSaveHours = () => {
    setEditingHours(false)
    console.log("Saving business hours:", businessHours)
  }

  const handleHourChange = (index: number, field: string, value: any) => {
    const updated = [...businessHours]
    updated[index] = { ...updated[index], [field]: value }
    setBusinessHours(updated)
  }

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

  const getPackageColor = (packageType: string) => {
    switch (packageType.toLowerCase()) {
      case "birthday party":
      case "birthday":
        return "bg-pink-500"
      case "economical":
        return "bg-blue-500"
      case "corporate":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const timeToPosition = (time: string, startHour = 11, endHour = 22) => {
    const [hours, minutes] = time.split(":").map(Number)
    const totalMinutes = hours * 60 + minutes
    const startMinutes = startHour * 60
    const endMinutes = endHour * 60
    const totalRange = endMinutes - startMinutes
    return ((totalMinutes - startMinutes) / totalRange) * 100
  }

  const getBookingWidth = (startTime: string, endTime: string, startHour = 11, endHour = 22) => {
    const startPos = timeToPosition(startTime, startHour, endHour)
    const endPos = timeToPosition(endTime, startHour, endHour)
    return endPos - startPos
  }

  const handleDayClick = (date: string) => {
    router.push(`/admin/bookings?date=${date}`)
  }

  const generateTimeMarkers = (startHour = 11, endHour = 22) => {
    const markers = []
    for (let hour = startHour; hour <= endHour; hour++) {
      const position = ((hour - startHour) / (endHour - startHour)) * 100
      markers.push(
        <div key={hour} className="absolute flex flex-col items-center" style={{ left: `${position}%` }}>
          <div className="w-px h-4 bg-gray-300"></div>
          <span className="text-xs text-gray-500 mt-1">{hour}:00</span>
        </div>,
      )
    }
    return markers
  }

  return (
    <div className="space-y-6">
      {/* Booked Slots Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Weekly Booking Overview</span>
              </CardTitle>
              <CardDescription>Visual timeline of bookings for the week</CardDescription>
            </div>
            <Button onClick={() => router.push("/admin/bookings/new")} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Booking</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {bookedSlots.map((daySlot) => (
              <div key={daySlot.date} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900 w-20">{daySlot.day}</h4>
                    <span className="text-sm text-gray-500">{daySlot.date}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {daySlot.bookings.length} booking{daySlot.bookings.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDayClick(daySlot.date)} className="text-xs">
                    View Details
                  </Button>
                </div>

                <div
                  className="relative h-12 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors border-2 border-transparent hover:border-primary/20"
                  onClick={() => handleDayClick(daySlot.date)}
                >
                  {/* Time markers */}
                  {generateTimeMarkers(11, 22)}

                  {/* Booking blocks */}
                  {daySlot.bookings.map((booking) => {
                    const startPos = timeToPosition(booking.startTime, 11, 22)
                    const width = getBookingWidth(booking.startTime, booking.endTime, 11, 22)

                    return (
                      <div
                        key={booking.id}
                        className={`absolute top-1 h-10 rounded ${getPackageColor(booking.package)} opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium shadow-sm`}
                        style={{
                          left: `${startPos}%`,
                          width: `${width}%`,
                          minWidth: "60px",
                        }}
                        title={`${booking.customerName} - ${booking.package} (${booking.startTime}-${booking.endTime})`}
                      >
                        <span className="truncate px-1">{booking.customerName.split(" ")[0]}</span>
                      </div>
                    )
                  })}

                  {/* Empty state */}
                  {daySlot.bookings.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                      No bookings - Click to add
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Package Types:</h5>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-pink-500 rounded"></div>
                <span className="text-sm text-gray-600">Birthday Party</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Economical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm text-gray-600">Corporate</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </div>
  )
}
