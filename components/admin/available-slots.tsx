"use client"

import { useEffect, useState } from "react"
import { slotBookingApi, type SlotBooking, handleApiError } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock } from "lucide-react"

// Helper to generate time slots
const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots = []
  for (let i = startHour; i < endHour; i++) {
    const time = `${i.toString().padStart(2, "0")}:00`
    slots.push(time)
  }
  return slots
}

export function AvailableSlots() {
  const [bookings, setBookings] = useState<SlotBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lanes = [1, 2, 3]
  const today = new Date().toISOString().split("T")[0]

  const timeSlots = generateTimeSlots(10, 22) // 10 AM to 10 PM

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await slotBookingApi.getAllBookings()
        setBookings(response.data)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getAvailableSlots = (day: string, lane: number) => {
    const bookedSlots = bookings
      .filter((b) => {
        if (!b.starttime) return false
        const bookingDate = new Date(b.date).toISOString().split("T")[0]
        return bookingDate === day && b.lane_no === lane
      })
      .map((b) => Number.parseInt(b.starttime.split(":")[0]))

    return timeSlots.filter((slot) => {
      const slotHour = Number.parseInt(slot.split(":")[0])
      return !bookedSlots.includes(slotHour)
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
        <CardTitle>Available Slots for Today</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lanes.map((lane) => (
            <Card key={lane}>
              <CardHeader>
                <CardTitle className="text-lg text-center">Lane {lane}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {getAvailableSlots(today, lane).map((slot) => (
                    <div
                      key={slot}
                      className="bg-green-100 text-green-800 rounded-md p-2 text-center text-sm font-medium flex items-center justify-center"
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      {slot}
                    </div>
                  ))}
                </div>
                {getAvailableSlots(today, lane).length === 0 && (
                  <p className="text-center text-gray-500 text-sm">No available slots</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
