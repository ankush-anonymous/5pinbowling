"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FileText, Upload, Plus } from "lucide-react"
import { updatesApi, type Update, handleApiError } from "@/lib/api"
import { UpdateDetailsModal } from "./update-details-modal"

export function UpdatesTab() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [updateForm, setUpdateForm] = useState({
    title: "",
    subtitle: "",
    body: "",
    image_url: "",
    author: "Admin", // Default author
    isArchived: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchUpdates()
  }, [])

  const fetchUpdates = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await updatesApi.getAllUpdates()
      setUpdates(response.data)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (update: Update) => {
    setSelectedUpdate(update)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedUpdate(null)
    setIsModalOpen(false)
  }

  const handleUpdate = () => {
    fetchUpdates() // Refetch updates after an update or delete operation
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUpdateForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setUpdateForm((prev) => ({ ...prev, image: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Publishing update:", updateForm)
      setUpdateForm({ title: "", subtitle: "", body: "", image: null })
      setIsSubmitting(false)
      alert("Update published successfully!")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Create New Update</span>
          </CardTitle>
          <CardDescription>Add news and updates for your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={updateForm.title}
                  onChange={handleInputChange}
                  placeholder="Enter update title"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle" className="text-sm font-medium">
                  Subtitle
                </Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={updateForm.subtitle}
                  onChange={handleInputChange}
                  placeholder="Enter subtitle (optional)"
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body" className="text-sm font-medium">
                Body Content *
              </Label>
              <Textarea
                id="body"
                name="body"
                value={updateForm.body}
                onChange={handleInputChange}
                placeholder="Write your update content here..."
                rows={6}
                required
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium">
                Featured Image
              </Label>
              <div className="flex items-center space-x-4">
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
                <Button type="button" variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </Button>
              </div>
              {updateForm.image && <p className="text-sm text-gray-600">Selected: {updateForm.image.name}</p>}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUpdateForm({ title: "", subtitle: "", body: "", image: null })}
              >
                Clear
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-burgundy-700">
                {isSubmitting ? (
                  "Publishing..."
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Publish Update
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>Manage your published updates</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading updates...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900">{update.title}</h4>
                      <p className="text-sm text-gray-600">{update.subtitle}</p>
                      <p className="text-xs text-gray-500">Published on {new Date(update.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenModal(update)}>
                        View / Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <UpdateDetailsModal
        update={selectedUpdate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
