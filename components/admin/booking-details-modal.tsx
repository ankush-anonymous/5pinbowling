"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import {
  SlotBooking,
  packagesApi,
  Package as Pkg,
  UpdateSlotBookingRequest,
  slotBookingApi,
  handleApiError,
} from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BookingDetailsModalProps {
  booking: SlotBooking
  children: React.ReactNode
  onUpdate: () => void
}

export function BookingDetailsModal({
  booking,
  children,
  onUpdate,
}: BookingDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UpdateSlotBookingRequest>({})
  const [packages, setPackages] = useState<Pkg[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Fetch packages when modal opens
      const fetchPackages = async () => {
        try {
          const pkgsResponse = await packagesApi.getAllPackages()
          setPackages(pkgsResponse.data || [])
        } catch (err) {
          console.error("Failed to fetch packages", err)
        }
      }
      fetchPackages()

      // Initialize form data
      setFormData({
        customerName: booking.customerName,
        email: booking.email,
        phone: booking.phone,
        date: new Date(booking.date).toISOString().split("T")[0],
        startTime: booking.startTime,
        endTime: booking.endTime,
        noOfPlayers: booking.noOfPlayers,
        package_id: typeof booking.package_id === 'object' ? (booking.package_id as Pkg)._id : booking.package_id,
        lane_no: booking.lane_no,
        book_status: booking.book_status,
        pay_status: booking.pay_status,
        note: booking.note,
        pizza_quantity: booking.pizza_quantity,
        pizza_type: booking.pizza_type,
        shoe_size: booking.shoe_size,
      })
    } else {
      // Reset state when modal closes
      setIsEditing(false)
      setError(null)
    }
  }, [isOpen, booking])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await slotBookingApi.updateBookingById(booking._id, formData)
      onUpdate() // Trigger parent refresh
      setIsEditing(false)
      setIsOpen(false)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Booking" : "Booking Details"}</DialogTitle>
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Update Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isEditing ? (
          <div className="py-4 grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="customerName">Name</Label>
              <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" name="startTime" type="time" value={formData.startTime} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lane_no">Lane</Label>
              <Input id="lane_no" name="lane_no" type="number" value={formData.lane_no} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noOfPlayers">Players</Label>
              <Input id="noOfPlayers" name="noOfPlayers" type="number" value={formData.noOfPlayers} onChange={handleInputChange} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="package_id">Package</Label>
              <Select name="package_id" value={formData.package_id} onValueChange={(value) => handleSelectChange("package_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a package" />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg._id} value={pkg._id}>{pkg.Title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="book_status">Booking Status</Label>
              <Select name="book_status" value={formData.book_status} onValueChange={(value) => handleSelectChange("book_status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay_status">Payment Status</Label>
              <Select name="pay_status" value={formData.pay_status} onValueChange={(value) => handleSelectChange("pay_status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="note">Notes</Label>
              <Textarea id="note" name="note" value={formData.note} onChange={handleInputChange} />
            </div>
          </div>
        ) : (
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
        )}
        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveChanges} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}