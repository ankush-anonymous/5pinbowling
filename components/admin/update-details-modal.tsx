"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updatesApi, type Update, type UpdateUpdateRequest, handleApiError } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface UpdateDetailsModalProps {
  update: Update | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function UpdateDetailsModal({ update, isOpen, onClose, onUpdate }: UpdateDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<UpdateUpdateRequest>({})
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (update) {
      setFormData({
        title: update.title,
        subtitle: update.subtitle,
        body: update.body,
        image_url: update.image_url,
      })
    } else {
      setFormData({})
    }
    setIsEditing(false)
    setIsDeleting(false)
    setError(null)
  }, [update])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = async () => {
    if (!update) return
    setIsSubmitting(true)
    setError(null)
    try {
      await updatesApi.updateUpdateById(update._id, formData)
      onUpdate()
      onClose()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!update) return
    setIsSubmitting(true)
    setError(null)
    try {
      await updatesApi.deleteUpdateById(update._id)
      onUpdate()
      onClose()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!update) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Update" : "Update Details"}</DialogTitle>
        </DialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isDeleting ? (
          <div className="py-4">
            <p>Are you sure you want to delete this update?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                {isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        ) : isEditing ? (
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea id="body" name="body" value={formData.body} onChange={handleInputChange} rows={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleInputChange} />
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {update.image_url && <img src={update.image_url} alt={update.title} className="w-full h-48 object-cover rounded-md" />}
            <h2 className="text-2xl font-bold">{update.title}</h2>
            <p className="text-lg text-muted-foreground">{update.subtitle}</p>
            <div className="prose max-w-none">{update.body}</div>
            <p className="text-sm text-muted-foreground">Created at: {new Date(update.createdAt).toLocaleString()}</p>
          </div>
        )}
        <DialogFooter>
          {isDeleting ? null : isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveChanges} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="destructive" onClick={() => setIsDeleting(true)}>Delete</Button>
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
