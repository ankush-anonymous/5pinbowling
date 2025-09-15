"use client"

import { useEffect, useState } from "react"
import {
  slotBookingApi,
  businessHoursApi,
  type SlotBooking,
  type BusinessHour,
  handleApiError,
} from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BookingDetailsModal } from "./booking-details-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Helper to generate time slots
const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots = []
  // Ensure endHour is not the same as startHour
  if (startHour >= endHour) {
    endHour = startHour + 1
  }
  for (let i = startHour; i < endHour; i++) {
    const time = `${i.toString().padStart(2, "0")}:00`
    slots.push(time)
  }
  return slots
}

const getDayName = (date: Date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  return days[date.getUTCDay()]
}

export function AvailableSlots() {
  const router = useRouter()
  const [bookings, setBookings] = useState<SlotBooking[]>([])
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lanes = [1, 2, 3]

  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const toDateString = (date: Date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }

  const todayDateString = toDateString(today)
  const tomorrowDateString = toDateString(tomorrow)
  const todayDayName = getDayName(today)
  const tomorrowDayName = getDayName(tomorrow)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [bookingsResponse, businessHoursResponse] = await Promise.all([
          slotBookingApi.getAllBookings(),
          businessHoursApi.getAllBusinessHours(),
        ])
        setBookings(bookingsResponse.data)
        setBusinessHours(businessHoursResponse.data)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getSlotsForDay = (dayName: string) => {
    const dayHours = businessHours.find(
      (bh) => bh.day_name.toLowerCase() === dayName.toLowerCase()
    )
    if (!dayHours || dayHours.offDay) return []
    const startHour = Number.parseInt(dayHours.startTime.split(":")[0])
    const endHour = Number.parseInt(dayHours.endTime.split(":")[0])
    return generateTimeSlots(startHour, endHour)
  }

  const todaySlots = getSlotsForDay(todayDayName)
  const tomorrowSlots = getSlotsForDay(tomorrowDayName)

  const getBookedSlots = (day: string, lane: number) => {
    return bookings.filter((b) => {
      if (!b.startTime) return false
      const d = new Date(b.date)
      const bookingDate = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
      return bookingDate === day && b.lane_no === lane
    })
  }

  const isSlotBooked = (slot: string, bookedSlots: SlotBooking[]) => {
    const slotHour = Number.parseInt(slot.split(":")[0])
    return bookedSlots.some(
      (b) => Number.parseInt(b.startTime.split(":")[0]) === slotHour
    )
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

  const renderLane = (lane: number, dateString: string, timeSlots: string[]) => {
    const bookedSlotsForLane = getBookedSlots(dateString, lane)
    const availableSlots = timeSlots.filter(slot => !isSlotBooked(slot, bookedSlotsForLane))

    return (
      <Card key={lane}>
        <CardHeader>
          <CardTitle className="text-lg text-center">Lane {lane}</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2 text-center">Available Slots</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
            {availableSlots.map((slot) => (
              <div
                key={slot}
                className="bg-green-100 text-green-800 rounded-md p-2 text-center text-sm font-medium flex items-center justify-center"
              >
                <Clock className="w-4 h-4 mr-1" />
                {slot}
              </div>
            ))}
            {availableSlots.length === 0 && timeSlots.length > 0 && (
              <p className="text-center text-gray-500 text-sm col-span-full">
                No available slots
              </p>
            )}
          </div>
          {timeSlots.length === 0 && (
            <p className="text-center text-gray-500 text-sm">Not open</p>
          )}

          <hr className="my-4" />

          <h3 className="font-semibold mb-2 text-center">
            Bookings ({bookedSlotsForLane.length})
          </h3>
          <div className="space-y-2">
            {bookedSlotsForLane.map((booking) => (
              <BookingDetailsModal key={booking._id} booking={booking}>
                <Card className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-3 flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-sm">
                        {booking.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </BookingDetailsModal>
            ))}
            {bookedSlotsForLane.length === 0 && (
              <p className="text-center text-gray-500 text-sm">
                No bookings for this lane.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Available Slots</CardTitle>
          <Button onClick={() => router.push("/admin/bookings/new")} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">
              Today ({today.toLocaleDateString()})
            </TabsTrigger>
            <TabsTrigger value="tomorrow">
              Tomorrow ({tomorrow.toLocaleDateString()})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {lanes.map((lane) =>
                renderLane(lane, todayDateString, todaySlots)
              )}
            </div>
          </TabsContent>
          <TabsContent value="tomorrow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {lanes.map((lane) =>
                renderLane(lane, tomorrowDateString, tomorrowSlots)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
