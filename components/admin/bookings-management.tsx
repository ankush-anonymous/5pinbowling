"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Edit, Trash2, Plus, Search, Filter, Calendar, Clock, User, Package } from "lucide-react"

interface BookingsManagementProps {
  selectedDate: string | null
}

const sampleBookings = [
  {
    id: 1,
    bookingReference: "BK-2024-001",
    date: "2024-01-20",
    time: "14:00",
    endTime: "16:00",
    duration: "2 hours",
    customer: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-123-4567",
    },
    package: {
      name: "Birthday Party",
      price: 120.0,
    },
    lane: "Lane 3",
    numberOfPlayers: 6,
    status: "confirmed",
    paymentStatus: "paid",
    specialRequests: "Birthday decorations for 8-year-old",
    createdAt: "2024-01-18T09:15:00Z",
  },
  {
    id: 2,
    bookingReference: "BK-2024-002",
    date: "2024-01-20",
    time: "16:30",
    endTime: "17:30",
    duration: "1 hour",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1-555-987-6543",
    },
    package: {
      name: "Economical Bowling",
      price: 45.0,
    },
    lane: "Lane 1",
    numberOfPlayers: 4,
    status: "confirmed",
    paymentStatus: "paid",
    specialRequests: null,
    createdAt: "2024-01-19T14:20:00Z",
  },
  {
    id: 3,
    bookingReference: "BK-2024-003",
    date: "2024-01-21",
    time: "13:00",
    endTime: "16:00",
    duration: "3 hours",
    customer: {
      name: "ABC Corporation",
      email: "events@abccorp.com",
      phone: "+1-555-456-7890",
    },
    package: {
      name: "Corporate Package",
      price: 450.0,
    },
    lane: "Lanes 4-6",
    numberOfPlayers: 18,
    status: "pending",
    paymentStatus: "pending",
    specialRequests: "Team building event, catering required",
    createdAt: "2024-01-19T16:45:00Z",
  },
]

export function BookingsManagement({ selectedDate }: BookingsManagementProps) {
  const router = useRouter()
  const [bookings, setBookings] = useState(sampleBookings)
  const [editingBooking, setEditingBooking] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editForm, setEditForm] = useState<any>({})

  const filteredBookings = bookings.filter((booking) => {
    const matchesDate = selectedDate ? booking.date === selectedDate : true
    const matchesSearch =
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesDate && matchesSearch && matchesStatus
  })

  const handleEditBooking = (booking: any) => {
    setEditingBooking(booking.id)
    setEditForm(booking)
  }

  const handleSaveBooking = () => {
    setBookings(bookings.map((booking) => (booking.id === editingBooking ? editForm : booking)))
    setEditingBooking(null)
    setEditForm({})
  }

  const handleCancelEdit = () => {
    setEditingBooking(null)
    setEditForm({})
  }

  const handleDeleteBooking = (id: number) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      setBookings(bookings.filter((booking) => booking.id !== id))
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
                    placeholder="Search by name or reference..."
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

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {editingBooking === booking.id ? (
                  // Edit Mode
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Edit Booking - {booking.bookingReference}</h3>
                      <div className="flex space-x-2">
                        <Button onClick={handleSaveBooking} size="sm" className="bg-green-600 hover:bg-green-700">
                          Save Changes
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label>Customer Name</Label>
                        <Input
                          value={editForm.customer?.name || ""}
                          onChange={(e) =>
                            handleInputChange("customer", { ...editForm.customer, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={editForm.customer?.email || ""}
                          onChange={(e) =>
                            handleInputChange("customer", { ...editForm.customer, email: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={editForm.customer?.phone || ""}
                          onChange={(e) =>
                            handleInputChange("customer", { ...editForm.customer, phone: e.target.value })
                          }
                        />
                      </div>

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
                          value={editForm.time || ""}
                          onChange={(e) => handleInputChange("time", e.target.value)}
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
                        <Label>Lane</Label>
                        <Input
                          value={editForm.lane || ""}
                          onChange={(e) => handleInputChange("lane", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Number of Players</Label>
                        <Input
                          type="number"
                          value={editForm.numberOfPlayers || ""}
                          onChange={(e) => handleInputChange("numberOfPlayers", Number.parseInt(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={editForm.status || ""}
                          onValueChange={(value) => handleInputChange("status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Payment Status</Label>
                        <Select
                          value={editForm.paymentStatus || ""}
                          onValueChange={(value) => handleInputChange("paymentStatus", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Special Requests</Label>
                      <Textarea
                        value={editForm.specialRequests || ""}
                        onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">{booking.bookingReference}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}
                        >
                          Payment: {booking.paymentStatus}
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
                          <p className="font-semibold text-gray-900">{booking.customer.name}</p>
                          <p className="text-sm text-gray-600">{booking.customer.email}</p>
                          <p className="text-sm text-gray-600">{booking.customer.phone}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Date & Time</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.date}</p>
                          <p className="text-sm text-gray-600">
                            {booking.time} - {booking.endTime}
                          </p>
                          <p className="text-sm text-gray-600">Duration: {booking.duration}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Package className="w-4 h-4" />
                          <span className="font-medium">Package</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.package.name}</p>
                          <p className="text-sm text-gray-600">${booking.package.price}</p>
                          <p className="text-sm text-gray-600">{booking.numberOfPlayers} players</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Lane & Details</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.lane}</p>
                          <p className="text-sm text-gray-600">
                            Created: {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Special Requests:</h4>
                        <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                      </div>
                    )}
                  </div>
                )}
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
      </main>
    </div>
  )
}
