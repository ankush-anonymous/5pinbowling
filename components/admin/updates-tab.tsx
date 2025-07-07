"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Upload, Plus } from "lucide-react"

export function UpdatesTab() {
  const [updateForm, setUpdateForm] = useState({
    title: "",
    subtitle: "",
    body: "",
    image: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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

      {/* Recent Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>Manage your published updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                title: "New Computer Scoring System Installation",
                subtitle: "Enhanced bowling experience coming soon",
                date: "2024-01-15",
                status: "Published",
              },
              {
                id: 2,
                title: "Extended Weekend Hours",
                subtitle: "More time for family fun",
                date: "2024-01-10",
                status: "Published",
              },
            ].map((update) => (
              <div key={update.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-900">{update.title}</h4>
                    <p className="text-sm text-gray-600">{update.subtitle}</p>
                    <p className="text-xs text-gray-500">Published on {update.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
