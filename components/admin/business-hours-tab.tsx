"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Save, X, Clock, Calendar, Plus, DollarSign, Activity, Users } from "lucide-react"
import {
  businessHoursApi,
  type BusinessHour,
  type UpdateBusinessHourRequest,
  handleApiError,
  type SlotBooking,
  slotBookingApi,
} from "@/lib/api"
import dayjs from "dayjs"
import "dayjs/locale/en"
dayjs.locale("en")

interface WeeklyStatsProps {
  bookings: SlotBooking[];
}

function WeeklyStats({ bookings }: WeeklyStatsProps) {
  const totalPeople = bookings.reduce((sum, b) => sum + (b.noOfPlayers || 0), 0);

  const totalHours = bookings.reduce((sum, b) => {
    if (b.startTime && b.endTime) {
      try {
        const start = new Date(`1970-01-01T${b.startTime}`);
        const end = new Date(`1970-01-01T${b.endTime}`);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return sum + duration;
        }
      } catch (e) {
        console.error("Invalid time format", b.startTime, b.endTime);
        return sum;
      }
    }
    return sum;
  }, 0);

  const totalRevenue = bookings.reduce((sum, b) => {
    if (b.package_id && typeof b.package_id === 'object' && b.package_id.Cost) {
      return sum + parseFloat(b.package_id.Cost.$numberDecimal);
    }
    return sum;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Revenue from packages this week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings Hours</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Total hours of bookings this week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{totalPeople}</div>
          <p className="text-xs text-muted-foreground">Number of guests this week</p>
        </CardContent>
      </Card>
    </div>
  );
}

const initialBusinessHours = [
  { day: "Monday", isOpen: false, openTime: "12:00", closeTime: "21:00" },
  { day: "Tuesday", isOpen: false, openTime: "12:00", closeTime: "21:00" },
  { day: "Wednesday", isOpen: false, openTime: "12:00", closeTime: "21:00" },
  { day: "Thursday", isOpen: true, openTime: "12:00", closeTime: "21:00" },
  { day: "Friday", isOpen: true, openTime: "12:00", closeTime: "21:00" },
  { day: "Saturday", isOpen: true, openTime: "11:00", closeTime: "22:00" },
  { day: "Sunday", isOpen: true, openTime: "11:00", closeTime: "19:00" },
]



export function BusinessHoursTab() {
  const router = useRouter()
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([])
  const [editingHours, setEditingHours] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [weeklyBookings, setWeeklyBookings] = useState<SlotBooking[]>([])
  const [timelineLoading, setTimelineLoading] = useState(true)
  const [timelineError, setTimelineError] = useState<string | null>(null)

  // Fetch business hours on component mount
  useEffect(() => {
    fetchBusinessHours()
  }, [])

  const fetchBusinessHours = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get the full response
      const response = await businessHoursApi.getAllBusinessHours()

      // Extract the data array
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

  useEffect(() => {
    const fetchWeeklyBookings = async () => {
      setTimelineLoading(true)
      setTimelineError(null)
      try {
        const bookingsResponse = await slotBookingApi.getAllBookings()
        const bookings = bookingsResponse.data

        const weekDates = getCurrentWeekDates()

        const currentWeekBookings = bookings.filter(booking => {
          const bookingDate = new Date(booking.date).toISOString().split("T")[0];
          return weekDates.some(weekDay => weekDay.date === bookingDate);
        });

        setWeeklyBookings(currentWeekBookings)
      } catch (error) {
        const errorMessage = handleApiError(error)
        setTimelineError(errorMessage)
        console.error("Failed to fetch weekly bookings:", errorMessage)
      } finally {
        setTimelineLoading(false)
      }
    }

    fetchWeeklyBookings()
  }, [])

  const getCurrentWeekDates = () => {
    const today = new Date()
    const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const monday = new Date(today)
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)) // Adjust to get Monday

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      weekDates.push({
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
      })
    }

    return weekDates
  }

  const handleSaveHours = async () => {
    try {
      setIsSaving(true)
      setError(null)

      // Update each business hour
      const updatePromises = businessHours.map(async (hour) => {
        const updateData: UpdateBusinessHourRequest = {
          day_no: hour.day_no,
          day_name: hour.day_name,
          startTime: hour.startTime,
          endTime: hour.endTime,
          offDay: hour.offDay,
        }

        return businessHoursApi.updateBusinessHourById(hour._id, updateData)
      })

      await Promise.all(updatePromises)
      setEditingHours(false)

      // Show success message
      alert("Business hours updated successfully!")

      // Refresh data
      await fetchBusinessHours()
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error("Failed to save business hours:", errorMessage)
      alert(`Failed to save business hours: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleHourChange = (index: number, field: string, value: any) => {
    const updated = [...businessHours]
    if (field === "isOpen") {
      updated[index] = { ...updated[index], offDay: !value }
    } else if (field === "openTime") {
      updated[index] = { ...updated[index], startTime: `${value}:00` }
    } else if (field === "closeTime") {
      updated[index] = { ...updated[index], endTime: `${value}:00` }
    }
    setBusinessHours(updated)
  }

  // Helper function to format time for input
  const formatTimeForInput = (timeString: string) => {
    if (!timeString) return ""
    return timeString.slice(0, 5) // Remove seconds part
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
            
          </div>
        </CardHeader>
        <CardContent>
          {timelineLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading weekly bookings...</p>
            </div>
          ) : timelineError ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error: {timelineError}</p>
            </div>
          ) : (
            <>
              <WeeklyStats bookings={weeklyBookings} />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Lane</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeklyBookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(booking => (
                    <TableRow key={booking._id}>
                      <TableCell>{new Date(booking.date).toLocaleDateString(undefined, { timeZone: 'UTC' })}</TableCell>
                      <TableCell>{booking.customerName}</TableCell>
                      <TableCell>{booking.startTime} - {booking.endTime}</TableCell>
                      <TableCell>{booking.lane_no}</TableCell>
                      <TableCell>{booking.package_id && typeof booking.package_id === 'object' ? (booking.package_id as any).Title : 'N/A'}</TableCell>
                      <TableCell>{booking.book_status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
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
                  <Button
                    onClick={handleSaveHours}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingHours(false)
                      fetchBusinessHours() // Reset to original data
                    }}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditingHours(true)} size="sm" disabled={isLoading}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading business hours...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button onClick={fetchBusinessHours} variant="outline">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {businessHours.map((day, index) => (
                <div key={day._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 font-medium text-gray-900">{day.day_name}</div>
                    {editingHours ? (
                      <Switch
                        checked={!day.offDay}
                        onCheckedChange={(checked) => handleHourChange(index, "isOpen", checked)}
                      />
                    ) : (
                      <div
                        className={`px-2 py-1 rounded text-sm ${!day.offDay ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {!day.offDay ? "Open" : "Closed"}
                      </div>
                    )}
                  </div>

                  {!day.offDay && (
                    <div className="flex items-center space-x-8">
                      {editingHours ? (
                        <>
                          <div className="flex items-center space-x-4">
                            <Label htmlFor={`open-${index}`} className="text-sm">
                              Open:
                            </Label>
                            <Input
                              id={`open-${index}`}
                              type="time"
                              value={formatTimeForInput(day.startTime)}
                              onChange={(e) => handleHourChange(index, "openTime", e.target.value)}
                              className="w-28"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`close-${index}`} className="text-sm">
                              Close:
                            </Label>
                            <Input
                              id={`close-${index}`}
                              type="time"
                              value={formatTimeForInput(day.endTime)}
                              onChange={(e) => handleHourChange(index, "closeTime", e.target.value)}
                              className="w-28"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-600">
                          {formatTimeForInput(day.startTime)} - {formatTimeForInput(day.endTime)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}