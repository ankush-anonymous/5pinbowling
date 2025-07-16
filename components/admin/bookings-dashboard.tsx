"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { slotBookingApi, businessHoursApi, type SlotBooking, type BusinessHour, handleApiError } from "@/lib/api"

export function BookingsDashboard() {
  const router = useRouter()
  const [bookings, setBookings] = useState<SlotBooking[]>([])
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([])
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLane, setSelectedLane] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [bookingsResponse, businessHoursResponse] = await Promise.all([
        slotBookingApi.getAllBookings(),
        businessHoursApi.getAllBusinessHours(),
      ])

      setBookings(bookingsResponse.data)
      setBusinessHours(businessHoursResponse.sort((a, b) => a.day_no - b.day_no))
    } catch (error) {
      console.error("Failed to fetch data:", handleApiError(error))
    } finally {
      setIsLoading(false)
    }
  }

  // Get current week dates
  const getWeekDates = () => {
    const startOfWeek = new Date(currentWeek)
    const dayOfWeek = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - dayOfWeek
    startOfWeek.setDate(diff)

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  // Generate time slots for a day
  const generateTimeSlots = (businessHour: BusinessHour) => {
    if (businessHour.offday) return []

    const slots = []
    const startTime = new Date(`2000-01-01T${businessHour.starttime}`)
    const endTime = new Date(`2000-01-01T${businessHour.endtime}`)

    let currentTime = new Date(startTime)
    while (currentTime < endTime) {
      const nextTime = new Date(currentTime.getTime() + 30 * 60 * 1000) // 30 minutes

      slots.push({
        start: currentTime.toTimeString().slice(0, 5),
        end: nextTime.toTimeString().slice(0, 5),
        startDate: new Date(currentTime),
        endDate: new Date(nextTime),
      })

      currentTime = nextTime
    }

    return slots
  }

  // Check if a slot is booked
  const isSlotBooked = (date: Date, startTime: string, endTime: string, laneNo: number) => {
    const dateStr = date.toISOString().split("T")[0]
    return bookings.some((booking) => {
      const bookingDate = new Date(booking.date).toISOString().split("T")[0]
      return (
        bookingDate === dateStr &&
        booking.starttime.slice(0, 5) === startTime &&
        booking.endtime.slice(0, 5) === endTime &&
        booking.lane_no === laneNo
      )
    })
  }

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date).toISOString().split("T")[0]
      return bookingDate === dateStr
    })
  }

  // Navigate to detailed bookings
  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    router.push(`/admin/bookings?date=${dateStr}`)
  }

  // Handle week navigation
  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newWeek)
  }

  // Check if date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const weekDates = getWeekDates()
  const lanes = [1, 2, 3] // Assuming 3 lanes

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Bookings Dashboard</span>
            </CardTitle>
            <Button onClick={() => router.push("/admin/bookings/new")} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Booking</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
                <ChevronLeft className="w-4 h-4" />
                Previous Week
              </Button>
              <h3 className="text-lg font-semibold">
                Week of {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
              </h3>
              <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
                Next Week
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filter by Lane:</span>
              <Select value={selectedLane} onValueChange={setSelectedLane}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lanes</SelectItem>
                  {lanes.map((lane) => (
                    <SelectItem key={lane} value={lane.toString()}>
                      Lane {lane}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Weekly View */}
          <div className="grid grid-cols-7 gap-4">
            {weekDates.map((date, dateIndex) => {
              const businessHour = businessHours.find((bh) => bh.day_no === date.getDay())
              const dayBookings = getBookingsForDate(date)
              const isToday = date.toDateString() === new Date().toDateString()
              const isPast = isPastDate(date)

              // Don't show past dates
              if (isPast) {
                return (
                  <div key={dateIndex} className="opacity-50">
                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                      <div className="font-medium text-gray-400">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="text-sm text-gray-400">{date.getDate()}</div>
                      <div className="text-xs text-gray-400 mt-2">Past</div>
                    </div>
                  </div>
                )
              }

              return (
                <div key={dateIndex} className="space-y-2">
                  <div
                    className={`p-3 rounded-lg border-2 ${isToday ? "border-primary bg-primary/5" : "border-gray-200"}`}
                  >
                    <div className="text-center mb-3">
                      <div className="font-medium text-gray-900">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="text-sm text-gray-600">{date.getDate()}</div>
                    </div>

                    {businessHour?.offday ? (
                      <div className="text-center">
                        <div className="text-xs text-red-600 font-medium bg-red-50 p-2 rounded">CLOSED</div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {/* Lane-wise booking display */}
                        {lanes.map((laneNo) => {
                          if (selectedLane !== "all" && selectedLane !== laneNo.toString()) {
                            return null
                          }

                          const laneBookings = dayBookings.filter((b) => b.lane_no === laneNo)
                          const timeSlots = businessHour ? generateTimeSlots(businessHour) : []

                          return (
                            <div key={laneNo} className="border rounded p-2">
                              <div className="text-xs font-medium text-gray-700 mb-1">Lane {laneNo}</div>
                              <div className="grid grid-cols-1 gap-1">
                                {timeSlots.map((slot, slotIndex) => {
                                  const isBooked = isSlotBooked(date, slot.start, slot.end, laneNo)
                                  return (
                                    <div
                                      key={slotIndex}
                                      className={`text-xs p-1 rounded text-center ${
                                        isBooked ? "bg-red-500 text-white" : "bg-green-100 text-green-800"
                                      }`}
                                    >
                                      {slot.start}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}

                        {/* Summary */}
                        <div className="pt-2 border-t">
                          <div className="text-xs text-center">
                            <div className="font-medium">
                              {dayBookings.length} booking{dayBookings.length !== 1 ? "s" : ""}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-1 text-xs h-6 bg-transparent"
                              onClick={() => handleDayClick(date)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span className="text-sm text-gray-600">Closed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
