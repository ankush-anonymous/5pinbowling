"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Edit, Save, X, Clock } from "lucide-react"
import { businessHoursApi, type BusinessHour, type UpdateBusinessHourRequest, handleApiError } from "@/lib/api"

export function BusinessHoursTab() {
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([])
  const [editingHours, setEditingHours] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch business hours on component mount
  useEffect(() => {
    fetchBusinessHours()
  }, [])

  const fetchBusinessHours = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const hours = await businessHoursApi.getAllBusinessHours()
      // Sort by day_no to ensure correct order
      const sortedHours = hours.sort((a, b) => a.day_no - b.day_no)
      setBusinessHours(sortedHours)
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error("Failed to fetch business hours:", errorMessage)
    } finally {
      setIsLoading(false)
    }
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
          startTime: hour.starttime,
          endTime: hour.endtime,
          offDay: hour.offday,
        }

        return businessHoursApi.updateBusinessHourById(hour.id, updateData)
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
      updated[index] = { ...updated[index], offday: !value }
    } else if (field === "openTime") {
      updated[index] = { ...updated[index], starttime: `${value}:00` }
    } else if (field === "closeTime") {
      updated[index] = { ...updated[index], endtime: `${value}:00` }
    }
    setBusinessHours(updated)
  }

  // Helper function to format time for input
  const formatTimeForInput = (timeString: string) => {
    return timeString.slice(0, 5) // Remove seconds part
  }

  return (
    <div className="space-y-6">
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
                <div key={day.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 font-medium text-gray-900">{day.day_name}</div>
                    {editingHours ? (
                      <Switch
                        checked={!day.offday}
                        onCheckedChange={(checked) => handleHourChange(index, "isOpen", checked)}
                      />
                    ) : (
                      <div
                        className={`px-2 py-1 rounded text-sm ${!day.offday ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {!day.offday ? "Open" : "Closed"}
                      </div>
                    )}
                  </div>

                  {!day.offday && (
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
                              value={formatTimeForInput(day.starttime)}
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
                              value={formatTimeForInput(day.endtime)}
                              onChange={(e) => handleHourChange(index, "closeTime", e.target.value)}
                              className="w-28"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-600">
                          {formatTimeForInput(day.starttime)} - {formatTimeForInput(day.endtime)}
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
