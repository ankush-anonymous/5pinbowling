"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Edit, Save, X, Clock, Calendar, Plus } from "lucide-react"
import {
  businessHoursApi,
  type BusinessHour,
  type UpdateBusinessHourRequest,
  handleApiError,
  type SlotBooking,
} from "@/lib/api"
import dayjs from "dayjs"
import "dayjs/locale/en"
dayjs.locale("en")

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
        id: "1",
        starttime: "14:00",
        endtime: "16:00",
        customername: "John Smith",
        package_name: "Birthday Party",
        lane_no: 3,
        book_status: "confirmed",
      },
      {
        id: "2",
        starttime: "16:30",
        endtime: "17:30",
        customername: "Sarah Johnson",
        package_name: "Economical",
        lane_no: 1,
        book_status: "confirmed",
      },
      {
        id: "3",
        starttime: "18:00",
        endtime: "20:00",
        customername: "Mike Davis",
        package_name: "Corporate",
        lane_no: 2,
        book_status: "pending",
      },
    ],
  },
  {
    date: "2024-01-21",
    day: "Sunday",
    bookings: [
      {
        id: "4",
        starttime: "13:00",
        endtime: "16:00",
        customername: "ABC Corp",
        package_name: "Corporate",
        lane_no: 4,
        book_status: "pending",
      },
      {
        id: "5",
        starttime: "17:00",
        endtime: "18:00",
        customername: "Emma Wilson",
        package_name: "Economical",
        lane_no: 1,
        book_status: "confirmed",
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
        id: "6",
        starttime: "15:00",
        endtime: "17:00",
        customername: "Birthday Party",
        package_name: "Birthday",
        lane_no: 5,
        book_status: "confirmed",
      },
    ],
  },
  {
    date: "2024-01-26",
    day: "Friday",
    bookings: [
      {
        id: "7",
        starttime: "19:00",
        endtime: "21:00",
        customername: "Team Event",
        package_name: "Corporate",
        lane_no: 3,
        book_status: "confirmed",
      },
      {
        id: "8",
        starttime: "14:00",
        endtime: "15:00",
        customername: "Lisa Brown",
        package_name: "Economical",
        lane_no: 2,
        book_status: "confirmed",
      },
    ],
  },
]

export function BusinessHoursTab() {
  const router = useRouter()
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([])
  const [editingHours, setEditingHours] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookedSlots] = useState(sampleBookedSlots)
  const [weeklyBookings, setWeeklyBookings] = useState<{ [date: string]: SlotBooking[] }>({})
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
        const today = dayjs()
        const nextWeek = today.add(7, "days")
        const startDate = today.format("YYYY-MM-DD")
        const endDate = nextWeek.format("YYYY-MM-DD")

        // Fetch bookings for the week
        // const bookings = await bookingsApi.getBookingsByDateRange(startDate, endDate);
        const bookings = sampleBookedSlots // Replace with actual API call when available

        // Group bookings by date
        const groupedBookings: { [date: string]: SlotBooking[] } = {}
        bookings.forEach((booking) => {
          groupedBookings[booking.date] = booking.bookings as unknown as SlotBooking[]
        })

        setWeeklyBookings(groupedBookings)
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
    if (!packageType) return "bg-gray-500"
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
          {timelineLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading weekly bookings...</p>
            </div>
          ) : timelineError ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error: {timelineError}</p>
              {/* <Button onClick={fetchWeeklyBookings} variant="outline">
                Try Again
              </Button> */}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(weeklyBookings).map(([date, bookings]) => {
                const day = dayjs(date)
                const dayName = day.format("dddd")
                const isTodayOrFuture = day.isSame(dayjs(), "day") || day.isAfter(dayjs(), "day")

                if (!isTodayOrFuture) {
                  return null // Skip past days
                }

                // Find business hours for the current day
                const businessHour = businessHours.find((hour) => hour.day_name === dayName)
                if (!businessHour) {
                  return null // Skip if no business hours found for the day
                }

                const startHour = Number.parseInt(businessHour.startTime.split(":")[0])
                const endHour = Number.parseInt(businessHour.endTime.split(":")[0])

                const generateTimelineMarkers = () => {
                  const markers = []
                  for (let hour = startHour; hour <= endHour; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
                      const position = timeToPosition(time, startHour, endHour)
                      markers.push(
                        <div
                          key={`${date}-${time}`}
                          className="absolute flex flex-col items-center"
                          style={{ left: `${position}%` }}
                        >
                          {minute === 0 && <div className="w-px h-4 bg-gray-300"></div>}
                          {minute === 0 && <span className="text-2xs text-gray-500 mt-1">{hour}:00</span>}
                        </div>,
                      )
                    }
                  }
                  return markers
                }

                const renderBookingBlocks = () => {
                  return bookings.map((booking) => {
                    const startPos = timeToPosition(booking.starttime, startHour, endHour)
                    const width = getBookingWidth(booking.starttime, booking.endtime, startHour, endHour)

                    return (
                      <div
                        key={booking.id}
                        className={`absolute top-1 h-10 rounded ${getPackageColor(
                          booking.package_name || "",
                        )} opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium shadow-sm`}
                        style={{
                          left: `${startPos}%`,
                          width: `${width}%`,
                          minWidth: "60px",
                        }}
                        title={`${booking.customername} - ${booking.package_name} (${booking.starttime}-${booking.endtime})`}
                      >
                        <span className="truncate px-1">{booking.customername.split(" ")[0]}</span>
                      </div>
                    )
                  })
                }

                return (
                  <div key={date} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-gray-900 w-20">{dayName}</h4>
                        <span className="text-sm text-gray-500">{day.format("YYYY-MM-DD")}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleDayClick(date)} className="text-xs">
                        View Details
                      </Button>
                    </div>

                    <div
                      className="relative h-12 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors border-2 border-transparent hover:border-primary/20"
                      onClick={() => handleDayClick(date)}
                    >
                      {/* Time markers */}
                      {generateTimelineMarkers()}

                      {/* Business Hours Timeline */}
                      {!businessHour.offDay && (
                        <div
                          className="absolute inset-y-0 bg-green-100 opacity-30"
                          style={{
                            left: `${timeToPosition(businessHour.startTime, startHour, endHour)}%`,
                            width: `${getBookingWidth(businessHour.startTime, businessHour.endTime, startHour, endHour)}%`,
                          }}
                        ></div>
                      )}

                      {/* Booking blocks */}
                      {renderBookingBlocks()}

                      {/* Empty state */}
                      {bookings.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                          No bookings - Click to add
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

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
            </div>
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