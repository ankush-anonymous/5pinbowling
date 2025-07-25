"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Plus, Clock } from "lucide-react"
import { businessHoursApi, slotBookingApi,type BusinessHour, handleApiError } from "@/lib/api"

interface BookingSlot {
  id: string
  startTime: string
  endTime: string
  customerName: string
  package: string
  lane: string
  status: "confirmed" | "pending" | "cancelled"
}

interface DayBookings {
  date: string
  dayName: string
  bookings: BookingSlot[]
}



export function WeeklyTimeline() {
  const router = useRouter()
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([])
const [weeklyBookings, setWeeklyBookings] = useState<DayBookings[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

 useEffect(() => {
  fetchBusinessHours()
}, [])

useEffect(() => {
  fetchWeeklyBooking()
}, [businessHours])  // trigger booking fetch after hours are loaded


 const fetchBusinessHours = async () => {
  try {
    setIsLoading(true)
    setError(null)

    // Destructure the array from response
    const response = await businessHoursApi.getAllBusinessHours()
    const hours: BusinessHour[] = response.data

    // Sort by day_no
    const sortedHours = hours.sort((a, b) => a.day_no - b.day_no)

    // Update state
    setBusinessHours(sortedHours)
  } catch (err) {
    const errorMessage = handleApiError(err)
    setError(errorMessage)
    console.error("Failed to fetch business hours:", errorMessage)
  } finally {
    setIsLoading(false)
  }
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

  // Convert time string to minutes from start of day
  const timeToMinutes = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Calculate position percentage based on business hours
  const getTimePosition = (time: string, startTime: string, endTime: string) => {
    const timeMinutes = timeToMinutes(time)
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)
    const totalMinutes = endMinutes - startMinutes

    if (timeMinutes < startMinutes || timeMinutes > endMinutes) return 0
    return ((timeMinutes - startMinutes) / totalMinutes) * 100
  }

  // Calculate width percentage for booking duration
  const getBookingWidth = (startTime: string, endTime: string, businessStart: string, businessEnd: string) => {
    const startPos = getTimePosition(startTime, businessStart, businessEnd)
    const endPos = getTimePosition(endTime, businessStart, businessEnd)
    return endPos - startPos
  }

  // Generate time markers for business hours
  const generateTimeMarkers = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)
    const markers = []

    // Create markers every 2 hours
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += 120) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      const timeString = `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
      const position = getTimePosition(timeString, startTime, endTime)

      markers.push(
        <div key={minutes} className="absolute flex flex-col items-center" style={{ left: `${position}%` }}>
          <div className="w-px h-4 bg-gray-300"></div>
          <span className="text-xs text-gray-500 mt-1">{timeString}</span>
        </div>,
      )
    }

    return markers
  }

  // Get current week dates
  const getCurrentWeekDates = () => {
    const today = new Date()
    const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const monday = new Date(today)
    monday.setDate(today.getDate() - currentDay + 1) // Get Monday of current week

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      weekDates.push({
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
        isPast: date < new Date(today.toDateString()),
      })
    }

    return weekDates
  }

const fetchWeeklyBooking = async () => {
  try {
    const bookingsResponse = await slotBookingApi.getAllBookings()
    const bookings: SlotBooking[] = bookingsResponse.data

    const grouped: DayBookings[] = weekDates.map((weekDay) => {
      const date = weekDay.date

      const dayBookings: BookingSlot[] = bookings
     .filter((b) => {
  const bookingDate = new Date(b.date).toISOString().split("T")[0]
  return bookingDate === date
})

        .map((b) => ({
          id: b.id,
          startTime: b.starttime.slice(0, 5),
          endTime: b.endtime.slice(0, 5),
          customerName: b.customername,
          package: b.package_name ?? "",       
          status: b.book_status ?? "Booked",   
        }))

      return {
        date,
        dayName: weekDay.dayName,
        bookings: dayBookings,
      }
    })

    setWeeklyBookings(grouped)
  } catch (err) {
    console.error("Error fetching weekly bookings:", err)
    setWeeklyBookings([])
  }
}


  const weekDates = getCurrentWeekDates()
  const currentWeekBookings = weekDates.map((weekDay) => {
    const dayBookings = weeklyBookings.find((booking) => booking.date === weekDay.date)
    return {
      ...weekDay,
      bookings: dayBookings?.bookings || [],
    }
  })

  const handleDayClick = (date: string) => {
    router.push(`/admin/bookings?date=${date}`)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading weekly timeline...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading timeline: {error}</p>
            <Button onClick={fetchBusinessHours} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Weekly Booking Timeline</span>
            </CardTitle>
            <CardDescription>Visual overview of bookings across the week with business hours</CardDescription>
          </div>
          <Button onClick={() => router.push("/admin/bookings/new")} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentWeekBookings.map((dayData) => {
            // {console.log(dayData.date, dayData.bookings)}
            const businessHour = businessHours.find((bh) => bh.day_name === dayData.dayName)

            // Skip past days
            if (dayData.isPast) return null

            // Handle closed days
            if (!businessHour || businessHour.offday) {
              return (
                <div key={dayData.date} className="space-y-2 opacity-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900 w-24">{dayData.dayName}</h4>
                      <span className="text-sm text-gray-500">{dayData.date}</span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">CLOSED</span>
                    </div>
                  </div>
                  <div className="h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Closed</span>
                  </div>
                </div>
              )
            }

            const startTime = businessHour.starttime.slice(0, 5) // Remove seconds
            const endTime = businessHour.endtime.slice(0, 5) // Remove seconds

            return (
              <div key={dayData.date} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900 w-24">{dayData.dayName}</h4>
                    <span className="text-sm text-gray-500">{dayData.date}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {startTime} - {endTime}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {dayData.bookings.length} booking{dayData.bookings.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDayClick(dayData.date)} className="text-xs">
                    View Details
                  </Button>
                </div>

                <div
                  className="relative h-12 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors border-2 border-transparent hover:border-primary/20"
                  onClick={() => handleDayClick(dayData.date)}
                >
                  {/* Time markers */}
                  {generateTimeMarkers(startTime, endTime)}

                  {/* Business hours background */}
                  <div className="absolute inset-1 bg-green-50 rounded border border-green-200"></div>

                  {/* Booking blocks */}
                  {dayData.bookings.map((booking) => {
                    const startPos = getTimePosition(booking.startTime, startTime, endTime)
                    const width = getBookingWidth(booking.startTime, booking.endTime, startTime, endTime)

                    return (
                      <div
                        key={booking.id}
                        className={`absolute top-1 h-10 rounded ${getPackageColor(booking.package)} opacity-90 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium shadow-sm border border-white/20`}
                        style={{
                          left: `${startPos}%`,
                          width: `${width}%`,
                          minWidth: "40px",
                        }}
                        title={`${booking.customerName} - ${booking.package} (${booking.startTime}-${booking.endTime}) - ${booking.status}`}
                      >
                        <span className="truncate px-1">{booking.customerName.split(" ")[0]}</span>
                      </div>
                    )
                  })}

                  {/* Empty state */}
                  {dayData.bookings.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      No bookings - Click to add
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
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
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Status:</h5>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Confirmed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600">Cancelled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
