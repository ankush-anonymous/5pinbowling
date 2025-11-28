"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Activity, Users } from "lucide-react"
import { type SlotBooking, type Package } from "@/lib/api"

interface WeeklyStatsProps {
  bookings: SlotBooking[];
}

export function WeeklyStats({ bookings }: WeeklyStatsProps) {
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
