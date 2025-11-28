"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  packagesApi,
  type Package as PackageType,
  type UpdatePackageRequest,
  handleApiError,
} from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface PackageDetailsModalProps {
  pkg: PackageType | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function PackageDetailsModal({
  pkg,
  isOpen,
  onClose,
  onUpdate,
}: PackageDetailsModalProps) {
  const [formData, setFormData] = useState<UpdatePackageRequest>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (pkg) {
      setFormData({
        img_url: pkg.img_url,
        Title: pkg.Title,
        subtitle: pkg.subtitle,
        description: pkg.description,
        Cost: parseFloat(pkg.Cost.$numberDecimal),
        no_of_person: pkg.no_of_person,
      })
    }
  }, [pkg])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Cost" || name === "no_of_person" ? Number(value) : value,
    }))
  }

  const handleSaveChanges = async () => {
    if (!pkg) return
    setIsSubmitting(true)
    setError(null)
    try {
      await packagesApi.updatePackageById(pkg._id, formData)
      onUpdate()
      onClose()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Package</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="img_url">Image URL *</Label>
                <Input
                  id="img_url"
                  name="img_url"
                  value={formData.img_url}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Title">Title *</Label>
                <Input
                  id="Title"
                  name="Title"
                  value={formData.Title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Cost">Cost *</Label>
                <Input
                  id="Cost"
                  name="Cost"
                  type="number"
                  value={formData.Cost}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="no_of_person">Number of Persons *</Label>
                <Input
                  id="no_of_person"
                  name="no_of_person"
                  type="number"
                  value={formData.no_of_person}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
