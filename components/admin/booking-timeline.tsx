"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { businessHoursApi, slotBookingApi, type BusinessHour, type SlotBooking, handleApiError } from "@/lib/api"

interface TimeSlot {
  time: string
  isBooked: boolean
  bookingCount: number
  bookings: SlotBooking[]
}

export function BookingTimeline() {
  const router = useRouter()
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([])
  const [bookings, setBookings] = useState<SlotBooking[]>([])
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [hoursResponse, bookingsResponse] = await Promise.all([
        businessHoursApi.getAllBusinessHours(),
        slotBookingApi.getAllBookings(),
      ])

      setBusinessHours(hoursResponse.sort((a, b) => a.day_no - b.day_no))
      setBookings(bookingsResponse.data)
    } catch (error) {
      console.error("Failed to fetch data:", handleApiError(error))
    } finally {
      setIsLoading(false)
    }
  }

  // Get current week dates
  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek)
      currentDate.setDate(startOfWeek.getDate() + i)
      week.push(currentDate)
    }
    return week
  }

  const weekDates = getWeekDates(currentWeek)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Generate time slots for a given business hour
  const generateTimeSlots = (businessHour: BusinessHour, date: Date): TimeSlot[] => {
    if (businessHour.offday) return []

    const slots: TimeSlot[] = []
    const startTime = new Date(`2000-01-01T${businessHour.starttime}`)
    const endTime = new Date(`2000-01-01T${businessHour.endtime}`)

    const current = new Date(startTime)

    while (current < endTime) {
      const timeString = current.toTimeString().slice(0, 5)
      const nextSlot = new Date(current)
      nextSlot.setMinutes(current.getMinutes() + 30)
      const nextTimeString = nextSlot.toTimeString().slice(0, 5)

      // Find bookings for this time slot and date
      const dateString = date.toISOString().split("T")[0]
      const slotBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date).toISOString().split("T")[0]
        const bookingStart = booking.starttime.slice(0, 5)
        const bookingEnd = booking.endtime.slice(0, 5)

        return (
          bookingDate === dateString &&
          bookingStart <= timeString &&
          bookingEnd > timeString &&
          booking.book_status !== "cancelled"
        )
      })

      slots.push({
        time: `${timeString}-${nextTimeString}`,
        isBooked: slotBookings.length > 0,
        bookingCount: slotBookings.length,
        bookings: slotBookings,
      })

      current.setMinutes(current.getMinutes() + 30)
    }

    return slots
  }

  const handleDayClick = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    router.push(`/admin/bookings?date=${dateString}`)
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newWeek)
  }

  const isDatePast = (date: Date) => {
    const dateOnly = new Date(date)
    dateOnly.setHours(0, 0, 0, 0)
    return dateOnly < today
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getBookingColor = (slot: TimeSlot) => {
    if (!slot.isBooked) return "bg-gray-100"
    if (slot.bookingCount === 1) return "bg-yellow-400"
    if (slot.bookingCount === 2) return "bg-orange-500"
    return "bg-red-500"
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking timeline...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Weekly Booking Timeline</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Click on any day to view detailed bookings and manage reservations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek("prev")}
                  className="flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek("next")}
                  className="flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={() => router.push("/admin/bookings/new")} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Booking</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span className="text-sm text-gray-600">1 Booking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm text-gray-600">2 Bookings</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">3+ Bookings</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded opacity-50"></div>
                <span className="text-sm text-gray-600">Past/Closed</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Week of {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Grid */}
      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date, dayIndex) => {
          const businessHour = businessHours.find((bh) => bh.day_no === (date.getDay() === 0 ? 7 : date.getDay()))
          const timeSlots = businessHour ? generateTimeSlots(businessHour, date) : []
          const isPast = isDatePast(date)
          const isToday = date.toDateString() === today.toDateString()

          return (
            <Card
              key={dayIndex}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isToday ? "ring-2 ring-primary" : ""
              } ${isPast ? "opacity-75" : ""}`}
              onClick={() => handleDayClick(date)}
            >
              <CardHeader className="pb-3">
                <div className="text-center">
                  <div className={`font-semibold ${isToday ? "text-primary" : "text-gray-900"}`}>
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className={`text-sm ${isToday ? "text-primary" : "text-gray-600"}`}>{date.getDate()}</div>
                  {isToday && <div className="text-xs text-primary font-medium mt-1">Today</div>}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {businessHour?.offday ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-sm">Closed</div>
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-sm">No hours set</div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Business hours indicator */}
                    <div className="text-xs text-gray-500 text-center mb-2">
                      {businessHour?.starttime.slice(0, 5)} - {businessHour?.endtime.slice(0, 5)}
                    </div>

                    {/* Time slots */}
                    <div className="grid grid-cols-2 gap-1">
                      {timeSlots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className={`h-6 rounded text-xs flex items-center justify-center text-white font-medium transition-all duration-200 hover:scale-105 ${
                            isPast ? "opacity-50" : ""
                          } ${getBookingColor(slot)}`}
                          title={`${slot.time}${slot.isBooked ? ` - ${slot.bookingCount} booking(s)` : " - Available"}`}
                        >
                          {slot.bookingCount > 0 && <span className="text-xs font-bold">{slot.bookingCount}</span>}
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="text-xs text-gray-500 text-center mt-2">
                      {timeSlots.filter((s) => s.isBooked).length} / {timeSlots.length} booked
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {
                  bookings.filter((b) => {
                    const bookingDate = new Date(b.date)
                    return (
                      weekDates.some((d) => d.toDateString() === bookingDate.toDateString()) &&
                      b.book_status === "confirmed"
                    )
                  }).length
                }
              </div>
              <div className="text-sm text-gray-600">Confirmed This Week</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  bookings.filter((b) => {
                    const bookingDate = new Date(b.date)
                    return (
                      weekDates.some((d) => d.toDateString() === bookingDate.toDateString()) &&
                      b.book_status === "pending"
                    )
                  }).length
                }
              </div>
              <div className="text-sm text-gray-600">Pending This Week</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  bookings.filter((b) => {
                    const bookingDate = new Date(b.date)
                    return bookingDate.toDateString() === today.toDateString() && b.book_status === "confirmed"
                  }).length
                }
              </div>
              <div className="text-sm text-gray-600">Today's Bookings</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{businessHours.filter((bh) => !bh.offday).length}</div>
              <div className="text-sm text-gray-600">Operating Days</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
