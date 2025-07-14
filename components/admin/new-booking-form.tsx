"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Calendar, User, Clock, Pizza, Footprints } from "lucide-react"
import {
  slotBookingApi,
  packagesApi,
  type CreateSlotBookingRequest,
  type Package as PackageType,
  handleApiError,
} from "@/lib/api"

export function NewBookingForm() {
  const router = useRouter()
  const [packages, setPackages] = useState<PackageType[]>([])
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    date: "",
    startTime: "",
    endTime: "",
    noOfPlayers: "",
    package_id: "",
    lane_no: "",
    book_status: "pending",
    pay_status: "pending",
    note: "",
    pizza_type: "",
    pizza_quantity: "",
    shoe_size: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await packagesApi.getAllPackages()
      setPackages(response.data)
    } catch (error) {
      console.error("Failed to fetch packages:", handleApiError(error))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const bookingData: CreateSlotBookingRequest = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        noOfPlayers: Number(formData.noOfPlayers),
        package_id: formData.package_id,
        lane_no: Number(formData.lane_no),
        book_status: formData.book_status,
        pay_status: formData.pay_status,
        note: formData.note,
        pizza_type: formData.pizza_type,
        pizza_quantity: formData.pizza_quantity,
        shoe_size: formData.shoe_size,
      }

      await slotBookingApi.createBooking(bookingData)
      alert("Booking created successfully!")
      router.push("/admin")
    } catch (error) {
      console.error("Failed to create booking:", handleApiError(error))
      alert("Failed to create booking")
    } finally {
      setIsSubmitting(false)
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
                <h1 className="text-xl font-bold text-gray-900">Create New Booking</h1>
                <p className="text-sm text-gray-500">Add a new bowling reservation</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Booking Details</span>
            </CardTitle>
            <CardDescription>Fill in the information below to create a new booking</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Customer Information</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="9876543210"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Booking Details</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="noOfPlayers">Number of Players *</Label>
                    <Input
                      id="noOfPlayers"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.noOfPlayers}
                      onChange={(e) => handleInputChange("noOfPlayers", e.target.value)}
                      placeholder="1-20"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Package & Lane */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Footprints className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Package & Lane</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="package_id">Package *</Label>
                    <Select
                      value={formData.package_id}
                      onValueChange={(value) => handleInputChange("package_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            {pkg.title} - ${pkg.cost}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lane_no">Lane *</Label>
                    <Select value={formData.lane_no} onValueChange={(value) => handleInputChange("lane_no", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a lane" />
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

              {/* Pizza & Extras */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Pizza className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Pizza & Extras</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pizza_type">Pizza Types</Label>
                    <Input
                      id="pizza_type"
                      value={formData.pizza_type}
                      onChange={(e) => handleInputChange("pizza_type", e.target.value)}
                      placeholder="Pepperoni,Margherita (comma separated)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pizza_quantity">Pizza Quantities</Label>
                    <Input
                      id="pizza_quantity"
                      value={formData.pizza_quantity}
                      onChange={(e) => handleInputChange("pizza_quantity", e.target.value)}
                      placeholder="2,1 (comma separated)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shoe_size">Shoe Sizes</Label>
                    <Input
                      id="shoe_size"
                      value={formData.shoe_size}
                      onChange={(e) => handleInputChange("shoe_size", e.target.value)}
                      placeholder="42,43,40,41,42 (comma separated)"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Payment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Status</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="book_status">Booking Status</Label>
                    <Select
                      value={formData.book_status}
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
                    <Label htmlFor="pay_status">Payment Status</Label>
                    <Select
                      value={formData.pay_status}
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

              {/* Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="note">Notes</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={4}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-burgundy-700">
                  {isSubmitting ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Booking
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
