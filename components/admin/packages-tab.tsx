"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Package as PackageIcon, Edit, Trash2 } from "lucide-react"
import {
  packagesApi,
  type Package as PackageType,
  type CreatePackageRequest,
  handleApiError,
} from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function PackagesTab() {
  const [packages, setPackages] = useState<PackageType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [packageForm, setPackageForm] = useState<CreatePackageRequest>({
    pageName: "",
    img_url: "",
    Title: "",
    subtitle: "",
    description: "",
    Cost: 0,
    no_of_person: 0,
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await packagesApi.getAllPackages()
      setPackages(response.data)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPackageForm((prev) => ({
      ...prev,
      [name]: name === "Cost" || name === "no_of_person" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    try {
      await packagesApi.createPackage(packageForm)
      alert("Package created successfully!")
      setPackageForm({
        pageName: "",
        img_url: "",
        Title: "",
        subtitle: "",
        description: "",
        Cost: 0,
        no_of_person: 0,
      }) // Clear form
      fetchPackages() // Refresh list
    } catch (err) {
      setFormError(handleApiError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return
    }
    try {
      await packagesApi.deletePackageById(id)
      alert("Package deleted successfully!")
      fetchPackages() // Refresh list
    } catch (err) {
      alert(`Failed to delete package: ${handleApiError(err)}`)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PackageIcon className="w-5 h-5" />
            <span>Create New Package</span>
          </CardTitle>
          <CardDescription>Add a new bowling package for your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pageName">Page Name *</Label>
                <Input
                  id="pageName"
                  name="pageName"
                  value={packageForm.pageName}
                  onChange={handleInputChange}
                  placeholder="e.g., Birthday Bash"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="img_url">Image URL *</Label>
                <Input
                  id="img_url"
                  name="img_url"
                  value={packageForm.img_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Title">Title *</Label>
                <Input
                  id="Title"
                  name="Title"
                  value={packageForm.Title}
                  onChange={handleInputChange}
                  placeholder="e.g., Ultimate Birthday Package"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={packageForm.subtitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Celebrate in style"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Cost">Cost *</Label>
                <Input
                  id="Cost"
                  name="Cost"
                  type="number"
                  value={packageForm.Cost}
                  onChange={handleInputChange}
                  placeholder="e.g., 79.99"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="no_of_person">Number of Persons *</Label>
                <Input
                  id="no_of_person"
                  name="no_of_person"
                  type="number"
                  value={packageForm.no_of_person}
                  onChange={handleInputChange}
                  placeholder="e.g., 8"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={packageForm.description}
                onChange={handleInputChange}
                placeholder="Detailed description of the package..."
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="submit" disabled={isSubmitting}>
                <Plus className="w-4 h-4 mr-2" />
                {isSubmitting ? "Creating..." : "Create Package"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Packages</CardTitle>
          <CardDescription>Manage your bowling packages</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading packages...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button onClick={fetchPackages} variant="outline">
                Try Again
              </Button>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No packages found. Create one above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Card key={pkg._id}>
                  <CardHeader className="relative pb-0">
                    {pkg.img_url && (
                      <img
                        src={pkg.img_url}
                        alt={pkg.Title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button variant="secondary" size="icon" className="rounded-full">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" className="rounded-full" onClick={() => handleDeletePackage(pkg._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <h3 className="text-xl font-bold mb-1">{pkg.Title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{pkg.subtitle}</p>
                    <p className="text-lg font-semibold text-primary mb-2">${pkg.Cost.$numberDecimal}</p>
                    <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                    <p className="text-sm text-gray-500">For {pkg.no_of_person} people</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}