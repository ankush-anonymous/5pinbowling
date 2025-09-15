"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { SlotBooking } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Hash,
  Package,
  Users,
  CreditCard,
  StickyNote,
  Pizza,
  Footprints,
} from "lucide-react"

interface BookingDetailsModalProps {
  booking: SlotBooking
  children: React.ReactNode
}

export function BookingDetailsModal({
  booking,
  children,
}: BookingDetailsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Card>
            <CardContent className="grid gap-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="font-semibold">{booking.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <a href={`mailto:${booking.email}`} className="text-blue-500">
                    {booking.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <a href={`tel:${booking.phone}`} className="text-blue-500">
                    {booking.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>{new Date(booking.date).toLocaleDateString(undefined, { timeZone: 'UTC' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>
                    {booking.startTime} - {booking.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-gray-500" />
                  <span>Lane {booking.lane_no}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>{booking.noOfPlayers} players</span>
                </div>
                {booking.package_id && typeof booking.package_id === 'object' && (
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-gray-500" />
                    <span>{(booking.package_id as any).Title}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <Badge
                    variant={
                      booking.pay_status === "Paid" ? "default" : "secondary"
                    }
                  >
                    {booking.pay_status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <Badge
                    variant={
                      booking.book_status === "Confirmed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {booking.book_status}
                  </Badge>
                </div>
              </div>

              {booking.note && (
                <div className="flex items-start gap-2">
                  <StickyNote className="h-5 w-5 text-gray-500 mt-1" />
                  <p className="text-sm text-gray-700">{booking.note}</p>
                </div>
              )}

              {(booking.pizza_quantity || booking.pizza_type) && (
                <div className="flex items-start gap-2">
                  <Pizza className="h-5 w-5 text-gray-500 mt-1" />
                  <p className="text-sm text-gray-700">
                    {booking.pizza_quantity} {booking.pizza_type} pizza(s)
                  </p>
                </div>
              )}

              {booking.shoe_size && (
                <div className="flex items-start gap-2">
                  <Footprints className="h-5 w-5 text-gray-500 mt-1" />
                  <p className="text-sm text-gray-700">
                    Shoe sizes: {booking.shoe_size}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}