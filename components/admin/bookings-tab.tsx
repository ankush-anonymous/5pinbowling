"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  slotBookingApi,
  businessHoursApi,
  type SlotBooking,
  type BusinessHour,
  timeUtils,
  handleApiError,
} from "@/lib/api"
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, User, MapPin, AlertCircle } from "lucide-react"

interface TimeSlot {
  time: string
  isBooked: boolean
  booking?: SlotBooking
  isPast: boolean
}

interface DaySlots {
  date: string
  dayName: string
  isToday: boolean
  isPast: boolean
  slots: TimeSlot[]
  businessHour?: BusinessHour
}

export function BookingsTab() {
  const router = useRouter()
  const [weekDays, setWeekDays] = useState<DaySlots[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date())
  const [bookings, setBookings] = useState<SlotBooking[]>([])
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set current week start to Monday
    const today = timeUtils.getCurrentISTDate()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    setCurrentWeekStart(monday)
  }, [])

  useEffect(() => {
    if (currentWeekStart) {
      fetchData()
    }
  }, [currentWeekStart])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [bookingsResponse, businessHoursResponse] = await Promise.all([
        slotBookingApi.getAllBookings(),
        businessHoursApi.getAllBusinessHours(),
      ])

      setBookings(bookingsResponse.data)
      setBusinessHours(businessHoursResponse.data.sort((a, b) => a.day_no - b.day_no))
generateWeekDays(bookingsResponse.data, businessHoursResponse)

    } catch (error) {
      console.error("Failed to fetch data:", handleApiError(error))
    } finally {
      setIsLoading(false)
    }
  }

  const generateWeekDays = (bookingsData: SlotBooking[], businessHoursData: BusinessHour[]) => {
    const days: DaySlots[] = []
    const today = timeUtils.getCurrentISTDate()

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)

      const dateString = timeUtils.formatDateForAPI(date)
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
      const isToday = dateString === timeUtils.formatDateForAPI(today)
      const isPast = date < today && !isToday

      // Find business hours for this day
      const businessHour = businessHoursData.find((bh) => bh.day_name.toLowerCase() === dayName.toLowerCase())

      let slots: TimeSlot[] = []

      if (businessHour && !businessHour.offday) {
        // Generate time slots
        const timeSlots = timeUtils.generateTimeSlots(
          businessHour.starttime.slice(0, 5),
          businessHour.endtime.slice(0, 5),
        )

        slots = timeSlots.map((time) => {
          const dayBookings = bookingsData.filter((booking) => {
            const bookingDate = new Date(booking.date).toISOString().split("T")[0]
            return bookingDate === dateString
          })

          const isBooked = dayBookings.some((booking) => {
            const startTime = booking.starttime.slice(0, 5)
            const endTime = booking.endtime.slice(0, 5)
            return time >= startTime && time < endTime
          })

          const booking = dayBookings.find((booking) => {
            const startTime = booking.starttime.slice(0, 5)
            return time === startTime
          })

          const isPastSlot = timeUtils.isSlotInPast(dateString, time)

          return {
            time,
            isBooked,
            booking,
            isPast: isPastSlot,
          }
        })

        // Filter out past slots
        slots = slots.filter((slot) => !slot.isPast)
      }

      days.push({
        date: dateString,
        dayName,
        isToday,
        isPast,
        slots,
        businessHour,
      })
    }

    setWeekDays(days)
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeekStart(newWeekStart)
  }

  const handleDayClick = (date: string) => {
    setSelectedDate(date)
    router.push(`/admin/bookings?date=${date}`)
  }

  const getSlotColor = (slot: TimeSlot) => {
    if (slot.isPast) return "bg-gray-200"
    if (slot.isBooked) return "bg-red-500 hover:bg-red-600"
    return "bg-green-500 hover:bg-green-600"
  }

  const getSlotTextColor = (slot: TimeSlot) => {
    if (slot.isPast) return "text-gray-500"
    return "text-white"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Booking Overview</h2>
          <p className="text-gray-600">
            Week of {currentWeekStart.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button onClick={() => navigateWeek("prev")} variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button onClick={() => navigateWeek("next")} variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={() => router.push("/admin/bookings/new")} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </Button>
        </div>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="text-sm">Past/Closed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <Card
            key={day.date}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              day.isToday ? "ring-2 ring-primary" : ""
            } ${day.isPast ? "opacity-60" : ""}`}
            onClick={() => handleDayClick(day.date)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{day.dayName}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                {day.isToday && <Badge variant="default">Today</Badge>}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {day.businessHour?.offday ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Closed</p>
                  </div>
                </div>
              ) : day.slots.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">No slots available</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-1">
                    {day.slots.slice(0, 8).map((slot) => (
                      <div
                        key={slot.time}
                        className={`px-2 py-1 rounded text-xs font-medium text-center transition-colors ${getSlotColor(
                          slot,
                        )} ${getSlotTextColor(slot)}`}
                      >
                        {slot.time}
                      </div>
                    ))}
                  </div>
                  {day.slots.length > 8 && (
                    <p className="text-xs text-gray-500 text-center">+{day.slots.length - 8} more slots</p>
                  )}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Available: {day.slots.filter((s) => !s.isBooked && !s.isPast).length}</span>
                      <span>Booked: {day.slots.filter((s) => s.isBooked).length}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">
                  {
                    bookings.filter((b) => {
                      const bookingDate = new Date(b.date).toISOString().split("T")[0]
                      const weekEnd = new Date(currentWeekStart)
                      weekEnd.setDate(currentWeekStart.getDate() + 6)
                      return (
                        bookingDate >= timeUtils.formatDateForAPI(currentWeekStart) &&
                        bookingDate <= timeUtils.formatDateForAPI(weekEnd)
                      )
                    }).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter((b) => b.book_status === "confirmed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter((b) => b.book_status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Today's Bookings</p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    bookings.filter((b) => {
                      const bookingDate = new Date(b.date).toISOString().split("T")[0]
                      const today = timeUtils.formatDateForAPI(timeUtils.getCurrentISTDate())
                      return bookingDate === today
                    }).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
