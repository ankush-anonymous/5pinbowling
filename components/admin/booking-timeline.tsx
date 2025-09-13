"use client"

import { useEffect, useState } from "react"
import { slotBookingApi, type SlotBooking, handleApiError } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Helper to generate time slots
const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots = []
  for (let i = startHour; i < endHour; i++) {
    const time = `${i.toString().padStart(2, "0")}:00`
    slots.push(time)
  }
  return slots
}

// Helper to get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-500 border-green-600 text-white"
    case "pending":
      return "bg-yellow-500 border-yellow-600 text-white"
    case "cancelled":
      return "bg-red-500 border-red-600 text-white"
    default:
      return "bg-gray-400 border-gray-500 text-white"
  }
}

export function BookingTimeline() {
  const [bookings, setBookings] = useState<SlotBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [days, setDays] = useState<string[]>([])
  const lanes = [1, 2, 3]

  const timeSlots = generateTimeSlots(10, 22) // 10 AM to 10 PM

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await slotBookingApi.getAllBookings()
        const bookingsData = response.data

        // Process data
        const uniqueDays = [...new Set(bookingsData.map((b) => new Date(b.date).toISOString().split("T")[0]))].sort()

        setBookings(bookingsData)
        setDays(uniqueDays)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getBookingForSlot = (day: string, time: string, lane: number) => {
    return bookings.find((b) => {
      if (!b.starttime) {
        return false
      }
      const bookingDate = new Date(b.date).toISOString().split("T")[0]
      const bookingStartHour = Number.parseInt(b.starttime.split(":")[0])
      const slotHour = Number.parseInt(time.split(":")[0])
      return bookingDate === day && bookingStartHour === slotHour && b.lane_no === lane
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Timeline</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-max">
          {days.map((day) => (
            <div key={day} className="mb-12">
              <h3 className="text-xl font-bold mb-4 text-center bg-gray-100 p-2 rounded-lg">
                {new Date(day).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </h3>
              <div className="grid grid-cols-12 gap-1">
                {/* Header Row */}
                <div className="col-span-1 font-semibold text-center p-2 border-r">Time</div>
                {lanes.map((lane) => (
                  <div key={lane} className="col-span-3 font-semibold text-center p-2 border-r">
                    Lane {lane}
                  </div>
                ))}

                {/* Time Slot Rows */}
                {timeSlots.map((time) => (
                  <div key={time} className="col-span-12 grid grid-cols-12 border-t">
                    <div className="col-span-1 text-center p-2 border-r font-mono text-sm">{time}</div>
                    {lanes.map((lane) => {
                      const booking = getBookingForSlot(day, time, lane)
                      return (
                        <div
                          key={`${day}-${time}-${lane}`}
                          className="col-span-3 p-2 border-r min-h-[80px] flex items-center justify-center"
                        >
                          {booking ? (
                            <div
                              className={`w-full h-full p-2 rounded-md text-xs ${getStatusColor(
                                booking.book_status,
                              )}`}
                            >
                              <p className="font-bold">{booking.customername}</p>
                              <p>{booking.starttime} - {booking.endtime}</p>
                              <p>Status: {booking.book_status}</p>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-xs">Available</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
