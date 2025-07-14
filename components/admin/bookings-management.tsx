"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Edit, Trash2, Plus, Search, Filter, Calendar, User, Pizza, Footprints } from "lucide-react"
import { slotBookingApi, packagesApi, type SlotBooking, type UpdateSlotBookingRequest, handleApiError } from "@/lib/api"

interface BookingsManagementProps {
  selectedDate: string | null
}

export function BookingsManagement({ selectedDate }: BookingsManagementProps) {
  const router = useRouter()
  const [bookings, setBookings] = useState<SlotBooking[]>([])
  const [packagesList, setPackagesList] = useState<any[]>([])
  const [editingBooking, setEditingBooking] = useState<SlotBooking | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState<any>({})

  useEffect(() => {
    fetchBookings()
    fetchPackages()
  }, [])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const response = await slotBookingApi.getAllBookings()
      setBookings(response.data)
    } catch (error) {
      console.error("Failed to fetch bookings:", handleApiError(error))
      alert("Failed to fetch bookings")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await packagesApi.getAllPackages()
      setPackagesList(response.data)
    } catch (error) {
      console.error("Failed to fetch packages:", handleApiError(error))
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date).toISOString().split("T")[0]
    const matchesDate = selectedDate ? bookingDate === selectedDate : true
    const matchesSearch =
      booking.customername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.book_status === statusFilter

    return matchesDate && matchesSearch && matchesStatus
  })

  const handleEditBooking = (booking: SlotBooking) => {
    setEditingBooking(booking)
    setEditForm({
      customerName: booking.customername,
      email: booking.email,
      phone: booking.phone,
      date: new Date(booking.date).toISOString().split("T")[0],
      startTime: booking.starttime.slice(0, 5),
      endTime: booking.endtime.slice(0, 5),
      noOfPlayers: booking.noofplayers,
      package_id: booking.package_id,
      lane_no: booking.lane_no,
      book_status: booking.book_status,
      pay_status: booking.pay_status,
      note: booking.note,
      pizza_quantity: booking.pizza_quantity,
      pizza_type: booking.pizza_type,
      shoe_size: booking.shoe_size,
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveBooking = async () => {
    if (!editingBooking) return

    try {
      const updateData: UpdateSlotBookingRequest = {
        customerName: editForm.customerName,
        email: editForm.email,
        phone: editForm.phone,
        date: editForm.date,
        startTime: editForm.startTime,
        endTime: editForm.endTime,
        noOfPlayers: Number(editForm.noOfPlayers),
        package_id: editForm.package_id,
        lane_no: Number(editForm.lane_no),
        book_status: editForm.book_status,
        pay_status: editForm.pay_status,
        note: editForm.note,
        pizza_quantity: editForm.pizza_quantity,
        pizza_type: editForm.pizza_type,
        shoe_size: editForm.shoe_size,
      }

      await slotBookingApi.updateBookingById(editingBooking.id, updateData)
      await fetchBookings()
      setIsEditDialogOpen(false)
      setEditingBooking(null)
      alert("Booking updated successfully!")
    } catch (error) {
      console.error("Failed to update booking:", handleApiError(error))
      alert("Failed to update booking")
    }
  }

  const handleDeleteBooking = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        await slotBookingApi.deleteBookingById(id)
        await fetchBookings()
        alert("Booking deleted successfully!")
      } catch (error) {
        console.error("Failed to delete booking:", handleApiError(error))
        alert("Failed to delete booking")
      }
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setEditForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPackageName = (packageId: string) => {
    const pkg = packagesList.find((p) => p.id === packageId)
    return pkg ? pkg.title : "Unknown Package"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push("/admin")}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bookings Management</h1>
                {selectedDate && <p className="text-sm text-gray-500">Showing bookings for {selectedDate}</p>}
              </div>
            </div>
            <Button onClick={() => router.push("/admin/bookings/new")} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Booking</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Bookings</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full bg-transparent">
                  Export Bookings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">{booking.customername}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.book_status)}`}
                        >
                          {booking.book_status.charAt(0).toUpperCase() + booking.book_status.slice(1)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.pay_status)}`}
                        >
                          Payment: {booking.pay_status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleEditBooking(booking)} variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteBooking(booking.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="font-medium">Customer</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.customername}</p>
                          <p className="text-sm text-gray-600">{booking.email}</p>
                          <p className="text-sm text-gray-600">{booking.phone}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Date & Time</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{new Date(booking.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">
                            {booking.starttime.slice(0, 5)} - {booking.endtime.slice(0, 5)}
                          </p>
                          <p className="text-sm text-gray-600">Lane {booking.lane_no}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Footprints className="w-4 h-4" />
                          <span className="font-medium">Package</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{getPackageName(booking.package_id)}</p>
                          <p className="text-sm text-gray-600">{booking.noofplayers} players</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Pizza className="w-4 h-4" />
                          <span className="font-medium">Extras</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pizza: {booking.pizza_type}</p>
                          <p className="text-sm text-gray-600">Qty: {booking.pizza_quantity}</p>
                          <p className="text-sm text-gray-600">Shoes: {booking.shoe_size}</p>
                        </div>
                      </div>
                    </div>

                    {booking.note && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
                        <p className="text-sm text-gray-600">{booking.note}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredBookings.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600 mb-4">
                    {selectedDate ? `No bookings found for ${selectedDate}` : "No bookings match your current filters"}
                  </p>
                  <Button onClick={() => router.push("/admin/bookings/new")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Booking
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>Update booking details for {editingBooking?.customername}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Customer Information</span>
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input
                    value={editForm.customerName || ""}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={editForm.email || ""} onChange={(e) => handleInputChange("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={editForm.phone || ""} onChange={(e) => handleInputChange("phone", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Booking Details</span>
              </h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={editForm.date || ""}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={editForm.startTime || ""}
                    onChange={(e) => handleInputChange("startTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={editForm.endTime || ""}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Players</Label>
                  <Input
                    type="number"
                    value={editForm.noOfPlayers || ""}
                    onChange={(e) => handleInputChange("noOfPlayers", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Package & Lane */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Footprints className="w-4 h-4" />
                <span>Package & Lane</span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Package</Label>
                  <Select
                    value={editForm.package_id || ""}
                    onValueChange={(value) => handleInputChange("package_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                      {packagesList.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lane</Label>
                  <Select
                    value={editForm.lane_no?.toString() || ""}
                    onValueChange={(value) => handleInputChange("lane_no", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lane" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Lane 1</SelectItem>
                      <SelectItem value="2">Lane 2</SelectItem>
                      <SelectItem value="3">Lane 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h4 className="font-medium">Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Booking Status</Label>
                  <Select
                    value={editForm.book_status || ""}
                    onValueChange={(value) => handleInputChange("book_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Status</Label>
                  <Select
                    value={editForm.pay_status || ""}
                    onValueChange={(value) => handleInputChange("pay_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pizza & Extras */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Pizza className="w-4 h-4" />
                <span>Pizza & Extras</span>
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Pizza Types (comma separated)</Label>
                  <Input
                    value={editForm.pizza_type || ""}
                    onChange={(e) => handleInputChange("pizza_type", e.target.value)}
                    placeholder="Pepperoni,Margherita"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pizza Quantities (comma separated)</Label>
                  <Input
                    value={editForm.pizza_quantity || ""}
                    onChange={(e) => handleInputChange("pizza_quantity", e.target.value)}
                    placeholder="2,1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Shoe Sizes (comma separated)</Label>
                  <Input
                    value={editForm.shoe_size || ""}
                    onChange={(e) => handleInputChange("shoe_size", e.target.value)}
                    placeholder="42,43,40,41,42"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={editForm.note || ""}
                onChange={(e) => handleInputChange("note", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBooking}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
