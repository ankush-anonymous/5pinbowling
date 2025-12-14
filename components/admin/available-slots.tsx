"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  slotBookingApi,
  businessHoursApi,
  type SlotBooking,
  type BusinessHour,
  type BookingsByDate,
  handleApiError,
} from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AlertCircle,
  Clock,
  User,
  Plus,
  DollarSign,
  Calendar,
  Users,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BookingDetailsModal } from "./booking-details-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// WeeklyStats Component
interface WeeklyStatsProps {
  bookings: SlotBooking[];
}

function WeeklyStats({ bookings }: WeeklyStatsProps) {
  const totalPeople = bookings.reduce(
    (sum, b) => sum + (b.noOfPlayers || 0),
    0
  );

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
    if (b.package_id && typeof b.package_id === "object" && b.package_id.Cost) {
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
          <p className="text-xs text-muted-foreground">
            Revenue from packages this week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Bookings Hours
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            Total hours of bookings this week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{totalPeople}</div>
          <p className="text-xs text-muted-foreground">
            Number of guests this week
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper to generate time slots
const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots = [];
  // Ensure endHour is not the same as startHour
  if (startHour >= endHour) {
    endHour = startHour + 1;
  }
  for (let i = startHour; i < endHour; i++) {
    const time = `${i.toString().padStart(2, "0")}:00`;
    slots.push(time);
  }
  return slots;
};

const getDayName = (date: Date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getUTCDay()];
};

const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // Adjust to get Monday

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push({
      date: date.toISOString().split("T")[0],
      dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
    });
  }

  return weekDates;
};

export function AvailableSlots() {
  const router = useRouter();
  const [bookings, setBookings] = useState<SlotBooking[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lanes = [1, 2, 3];
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [timelineError, setTimelineError] = useState<string | null>(null);
  const [weeklyBookings, setWeeklyBookings] = useState<SlotBooking[]>([]);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const toDateString = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayDateString = toDateString(today);
  const tomorrowDateString = toDateString(tomorrow);
  const todayDayName = getDayName(today);
  const tomorrowDayName = getDayName(tomorrow);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setTimelineLoading(true);
      setError(null);
      setTimelineError(null);

      const [bookingsResponse, businessHoursResponse] = await Promise.all([
        slotBookingApi.getAllBookings(),
        businessHoursApi.getAllBusinessHours(),
      ]);

      // The API returns data grouped by date, so we need to flatten it
      const bookingsByDate: BookingsByDate[] = bookingsResponse?.data || [];
      const allBookings: SlotBooking[] = bookingsByDate.flatMap(
        (day) => day.bookings_details
      );

      setBookings(allBookings);
      setBusinessHours(businessHoursResponse?.data || []);

      // Calculate weekly bookings
      const weekDates = getCurrentWeekDates();
      const currentWeekBookings = allBookings.filter((booking) => {
        const bookingDate = new Date(booking.date).toISOString().split("T")[0];
        return weekDates.some((weekDay) => weekDay.date === bookingDate);
      });
      setWeeklyBookings(currentWeekBookings);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setTimelineError(errorMessage);
    } finally {
      setIsLoading(false);
      setTimelineLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getSlotsForDay = (dayName: string) => {
    const dayHours = businessHours.find(
      (bh) => bh.day_name.toLowerCase() === dayName.toLowerCase()
    );
    if (!dayHours || dayHours.offDay) return [];
    const startHour = Number.parseInt(dayHours.startTime.split(":")[0]);
    const endHour = Number.parseInt(dayHours.endTime.split(":")[0]);
    return generateTimeSlots(startHour, endHour);
  };

  const todaySlots = getSlotsForDay(todayDayName);
  const tomorrowSlots = getSlotsForDay(tomorrowDayName);

  const getBookedSlots = (day: string, lane: number) => {
    return bookings.filter((b) => {
      if (!b.startTime) return false;
      const d = new Date(b.date);
      const bookingDate = `${d.getUTCFullYear()}-${String(
        d.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
      return bookingDate === day && b.lane_no === lane;
    });
  };

  const isSlotBooked = (slot: string, bookedSlots: SlotBooking[]) => {
    const slotHour = Number.parseInt(slot.split(":")[0]);
    return bookedSlots.some(
      (b) => Number.parseInt(b.startTime.split(":")[0]) === slotHour
    );
  };

  const renderLane = (
    lane: number,
    dateString: string,
    timeSlots: string[]
  ) => {
    const bookedSlotsForLane = getBookedSlots(dateString, lane);
    const availableSlots = timeSlots.filter(
      (slot) => !isSlotBooked(slot, bookedSlotsForLane)
    );

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
              <Card key={booking._id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-sm">
                            {booking.customerName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookingDetailsModal
                          booking={booking}
                          onUpdate={fetchData}
                        >
                          <Button variant="outline" size="sm">View/Update</Button>
                        </BookingDetailsModal>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this booking.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  try {
                                    await slotBookingApi.deleteBookingById(booking._id);
                                    fetchData();
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
            {bookedSlotsForLane.length === 0 && (
              <p className="text-center text-gray-500 text-sm">
                No bookings for this lane.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Slots</CardTitle>
            <Button
              onClick={() => router.push("/admin/bookings/new")}
              className="flex items-center space-x-2"
            >
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
      {/* Booked Slots Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Weekly Booking Overview</span>
              </CardTitle>
              <CardDescription>
                Visual timeline of bookings for the week
              </CardDescription>
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Lane</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(
                    weeklyBookings.reduce((acc, booking) => {
                      const bookingDate = new Date(booking.date)
                        .toISOString()
                        .split("T")[0];
                      if (!acc[bookingDate]) {
                        acc[bookingDate] = [];
                      }
                      acc[bookingDate].push(booking);
                      return acc;
                    }, {} as Record<string, SlotBooking[]>)
                  )
                    .sort(
                      ([dateA], [dateB]) =>
                        new Date(dateA).getTime() - new Date(dateB).getTime()
                    )
                    .map(([date, bookingsOnDate]) => (
                      <React.Fragment key={date}>
                        <TableRow key={date}>
                          <TableCell
                            colSpan={6}
                            className="bg-muted font-medium"
                          >
                            {new Date(date).toLocaleDateString(undefined, {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              timeZone: "UTC",
                            })}
                          </TableCell>
                        </TableRow>
                        {bookingsOnDate
                          .sort((a, b) =>
                            a.startTime.localeCompare(b.startTime)
                          )
                          .map((booking) => (
                            <TableRow key={booking._id}>
                              <TableCell>{booking.customerName}</TableCell>
                              <TableCell>
                                {booking.startTime} - {booking.endTime}
                              </TableCell>
                              <TableCell>{booking.lane_no}</TableCell>
                              <TableCell>
                                {booking.package_id &&
                                typeof booking.package_id === "object"
                                  ? (booking.package_id as any).Title
                                  : "N/A"}
                              </TableCell>
                              <TableCell>{booking.book_status}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <BookingDetailsModal
                                    booking={booking}
                                    onUpdate={fetchData}
                                  >
                                    <Button variant="outline" size="sm">View/Update</Button>
                                  </BookingDetailsModal>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="sm">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete this booking.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={async () => {
                                            try {
                                              await slotBookingApi.deleteBookingById(booking._id);
                                              fetchData();
                                            } catch (err) {
                                              console.error(err);
                                            }
                                          }}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </React.Fragment>
                    ))}
                </TableBody>              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
