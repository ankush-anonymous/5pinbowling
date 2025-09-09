import axios from "axios"

// Replace with your actual server URL - now using localhost:5001
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Business Hours API Types
export interface BusinessHour {
  id: string
  day_no: number
  day_name: string
  starttime: string
  endtime: string
  offday: boolean
}

export interface CreateBusinessHourRequest {
  day_no: number
  day_name: string
  startTime: string
  endTime: string
  offDay: boolean
}

export interface UpdateBusinessHourRequest {
  day_no?: number
  day_name?: string
  startTime?: string
  endTime?: string
  offDay?: boolean
}

// Business Hours Response Type
export interface BusinessHoursResponse {
  data: BusinessHour[]
}

// Business Hours API Functions
export const businessHoursApi = {
  // Get all business hours
  getAllBusinessHours: async (): Promise<BusinessHoursResponse> => {
    try {
      const response = await api.get("/api/v1/businessHours/getAllBusinessHours")
      return response.data
    } catch (error) {
      console.error("Error fetching business hours:", error)
      throw new Error("Failed to fetch business hours")
    }
  },

  // Get business hour by ID
  getBusinessHourById: async (id: string): Promise<BusinessHour> => {
    try {
      const response = await api.get(`/api/v1/businessHours/getBusinessHourById/${id}`)
      return response.data
    } catch (error) {
      console.error("Error fetching business hour by ID:", error)
      throw new Error("Failed to fetch business hour")
    }
  },

  // Create new business hour
  createBusinessHour: async (data: CreateBusinessHourRequest): Promise<BusinessHour> => {
    try {
      const response = await api.post("/api/v1/businessHours/createBusinessHour", data)
      return response.data
    } catch (error) {
      console.error("Error creating business hour:", error)
      throw new Error("Failed to create business hour")
    }
  },

  // Update business hour by ID
  updateBusinessHourById: async (id: string, data: UpdateBusinessHourRequest): Promise<BusinessHour> => {
    try {
      const response = await api.put(`/api/v1/businessHours/updateBusinessHourById/${id}`, data)
      return response.data
    } catch (error) {
      console.error("Error updating business hour:", error)
      throw new Error("Failed to update business hour")
    }
  },

  // Delete business hour by ID
  deleteBusinessHourById: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/v1/businessHours/deleteBusinessHourById/${id}`)
    } catch (error) {
      console.error("Error deleting business hour:", error)
      throw new Error("Failed to delete business hour")
    }
  },
}

// Package API Types
export interface Package {
  id(id: any): void
  _id: string
  pageName: string
  img_url: string
  Title: string
  subtitle: string
  description: string
  Cost: {
    $numberDecimal: string
  }
  no_of_person: number
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CreatePackageRequest {
  pageName: string
  img_url: string
  Title: string
  subtitle: string
  description: string
  Cost: number
  no_of_person: number
}

export interface UpdatePackageRequest {
  pageName?: string
  img_url?: string
  Title?: string
  subtitle?: string
  description?: string
  Cost?: number
  no_of_person?: number
}

export interface PackagesResponse {
  currentPage: number
  totalPages: number
  totalPackages: number
  data: Package[]
}

// Package API Functions
export const packagesApi = {
  // Get all packages
  getAllPackages: async (): Promise<PackagesResponse> => {
    try {
      const response = await api.get("/api/v1/package/getAllPackages")
      return response.data
    } catch (error) {
      console.error("Error fetching packages:", error)
      throw new Error("Failed to fetch packages")
    }
  },

  // Get package by ID
  getPackageById: async (id: string): Promise<Package> => {
    try {
      const response = await api.get(`/api/v1/package/getPackageById/${id}`)
      return response.data
    } catch (error) {
      console.error("Error fetching package by ID:", error)
      throw new Error("Failed to fetch package")
    }
  },

  // Create new package
  createPackage: async (data: CreatePackageRequest): Promise<Package> => {
    try {
      const response = await api.post("/api/v1/package/createPackage", data)
      return response.data
    } catch (error) {
      console.error("Error creating package:", error)
      throw new Error("Failed to create package")
    }
  },

  // Update package by ID
  updatePackageById: async (id: string, data: UpdatePackageRequest): Promise<Package> => {
    try {
      const response = await api.put(`/api/v1/package/updatePackageById/${id}`, data)
      return response.data
    } catch (error) {
      console.error("Error updating package:", error)
      throw new Error("Failed to update package")
    }
  },

  // Delete package by ID
  deletePackageById: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/v1/package/deletePackageById/${id}`)
    } catch (error) {
      console.error("Error deleting package:", error)
      throw new Error("Failed to delete package")
    }
  },
}

// Slot Booking API Types
export interface SlotBooking {
  id: string
  customername: string
  email: string
  phone: string
  date: string
  starttime: string
  endtime: string
  noofplayers: number
  package_id: string
  package_name?: string // Optional field that might come from joined data
  lane_no: number
  book_status: string
  pay_status: string
  note: string
  pizza_quantity: string
  pizza_type: string
  shoe_size: string
}

export interface CreateSlotBookingRequest {
  customerName: string
  email: string
  phone: string
  date: string
  startTime: string
  endTime: string
  noOfPlayers: number
  package_id: string
  lane_no: number
  book_status: string
  pay_status: string
  note: string
  pizza_quantity: string
  pizza_type: string
  shoe_size: string
}

export interface UpdateSlotBookingRequest {
  customerName?: string
  email?: string
  phone?: string
  date?: string
  startTime?: string
  endTime?: string
  noOfPlayers?: number
  package_id?: string
  lane_no?: number
  book_status?: string
  pay_status?: string
  note?: string
  pizza_quantity?: string
  pizza_type?: string
  shoe_size?: string
}

export interface SlotBookingsResponse {
  currentPage: number
  totalPages: number
  totalBookings: number
  data: SlotBooking[]
}

// Slot Booking API Functions
export const slotBookingApi = {
  // Get all slot bookings
  getAllBookings: async (): Promise<SlotBookingsResponse> => {
    try {
      const response = await api.get("/api/v1/slotbooking/getAllBookings")
      return response.data
    } catch (error) {
      console.error("Error fetching slot bookings:", error)
      throw new Error("Failed to fetch slot bookings")
    }
  },

  // Get slot booking by ID
  getBookingById: async (id: string): Promise<SlotBooking> => {
    try {
      const response = await api.get(`/api/v1/slotbooking/getBookingById/${id}`)
      return response.data
    } catch (error) {
      console.error("Error fetching slot booking by ID:", error)
      throw new Error("Failed to fetch slot booking")
    }
  },

  // Create new slot booking
  createBooking: async (data: CreateSlotBookingRequest): Promise<SlotBooking> => {
    try {
      const response = await api.post("/api/v1/slotbooking/createBooking", data)
      return response.data
    } catch (error) {
      console.error("Error creating slot booking:", error)
      throw new Error("Failed to create slot booking")
    }
  },

  // Update slot booking by ID
  updateBookingById: async (id: string, data: UpdateSlotBookingRequest): Promise<SlotBooking> => {
    try {
      const response = await api.put(`/api/v1/slotbooking/updateBookingById/${id}`, data)
      return response.data
    } catch (error) {
      console.error("Error updating slot booking:", error)
      throw new Error("Failed to update slot booking")
    }
  },

  // Delete slot booking by ID
  deleteBookingById: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/v1/slotbooking/deleteBookingById/${id}`)
    } catch (error) {
      console.error("Error deleting slot booking:", error)
      throw new Error("Failed to delete slot booking")
    }
  },
}

// Error handler for API responses
export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      return error.response.data?.message || "Server error occurred"
    } else if (error.request) {
      // Request was made but no response received
      return "Network error - please check your connection"
    }
  }
  return error.message || "An unexpected error occurred"
}

export default api