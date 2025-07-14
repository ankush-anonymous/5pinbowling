"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Trash2, Plus, PackageIcon, DollarSign, Users } from "lucide-react"
import {
  packagesApi,
  type Package as PackageType,
  type CreatePackageRequest,
  type UpdatePackageRequest,
  handleApiError,
} from "@/lib/api"

export function PackagesTab() {
  const [packages, setPackages] = useState<PackageType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null)
  const [formData, setFormData] = useState({
    pageName: "",
    img_url: "",
    Title: "",
    subtitle: "",
    description: "",
    Cost: "",
    no_of_person: "",
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setIsLoading(true)
      const response = await packagesApi.getAllPackages()
      setPackages(response.data)
    } catch (error) {
      console.error("Failed to fetch packages:", handleApiError(error))
      alert("Failed to fetch packages")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      pageName: "",
      img_url: "",
      Title: "",
      subtitle: "",
      description: "",
      Cost: "",
      no_of_person: "",
    })
  }

  const handleCreatePackage = async () => {
    try {
      const createData: CreatePackageRequest = {
        pageName: formData.pageName,
        img_url: formData.img_url,
        Title: formData.Title,
        subtitle: formData.subtitle,
        description: formData.description,
        Cost: Number(formData.Cost),
        no_of_person: Number(formData.no_of_person),
      }

      await packagesApi.createPackage(createData)
      await fetchPackages()
      setIsCreateDialogOpen(false)
      resetForm()
      alert("Package created successfully!")
    } catch (error) {
      console.error("Failed to create package:", handleApiError(error))
      alert("Failed to create package")
    }
  }

  const handleEditPackage = (pkg: PackageType) => {
    setEditingPackage(pkg)
    setFormData({
      pageName: pkg.pagename,
      img_url: pkg.img_url,
      Title: pkg.title,
      subtitle: pkg.subtitle,
      description: pkg.description,
      Cost: pkg.cost,
      no_of_person: pkg.no_of_person.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdatePackage = async () => {
    if (!editingPackage) return

    try {
      const updateData: UpdatePackageRequest = {
        pageName: formData.pageName,
        img_url: formData.img_url,
        Title: formData.Title,
        subtitle: formData.subtitle,
        description: formData.description,
        Cost: Number(formData.Cost),
        no_of_person: Number(formData.no_of_person),
      }

      await packagesApi.updatePackageById(editingPackage.id, updateData)
      await fetchPackages()
      setIsEditDialogOpen(false)
      setEditingPackage(null)
      resetForm()
      alert("Package updated successfully!")
    } catch (error) {
      console.error("Failed to update package:", handleApiError(error))
      alert("Failed to update package")
    }
  }

  const handleDeletePackage = async (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await packagesApi.deletePackageById(id)
        await fetchPackages()
        alert("Package deleted successfully!")
      } catch (error) {
        console.error("Failed to delete package:", handleApiError(error))
        alert("Failed to delete package")
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <PackageIcon className="w-5 h-5" />
                <span>Package Management</span>
              </CardTitle>
              <CardDescription>Create and manage bowling packages</CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Package</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading packages...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={pkg.img_url || "/placeholder.svg?height=200&width=400"}
                      alt={pkg.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-sm font-medium">
                      ${pkg.cost}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-gray-900">{pkg.title}</h3>
                      <p className="text-sm text-gray-600">{pkg.subtitle}</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{pkg.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{pkg.no_of_person} people</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm font-medium text-primary">
                          <DollarSign className="w-4 h-4" />
                          <span>{pkg.cost}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button onClick={() => handleEditPackage(pkg)} variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeletePackage(pkg.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {packages.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <PackageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
                  <p className="text-gray-600 mb-4">Create your first package to get started</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Package
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Package Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Package</DialogTitle>
            <DialogDescription>Add a new bowling package with all the details</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Page Name</Label>
                <Input
                  value={formData.pageName}
                  onChange={(e) => handleInputChange("pageName", e.target.value)}
                  placeholder="Birthday Bash"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.Title}
                  onChange={(e) => handleInputChange("Title", e.target.value)}
                  placeholder="Ultimate Birthday Package"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.img_url}
                onChange={(e) => handleInputChange("img_url", e.target.value)}
                placeholder="https://example.com/images/birthday.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                placeholder="Celebrate in style"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="This package includes 2 hours of bowling, pizza, drinks, and decorations for up to 8 people."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cost</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.Cost}
                  onChange={(e) => handleInputChange("Cost", e.target.value)}
                  placeholder="4999.99"
                />
              </div>
              <div className="space-y-2">
                <Label>Number of People</Label>
                <Input
                  type="number"
                  value={formData.no_of_person}
                  onChange={(e) => handleInputChange("no_of_person", e.target.value)}
                  placeholder="8"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePackage}>Create Package</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Package Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>Update package details</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Page Name</Label>
                <Input
                  value={formData.pageName}
                  onChange={(e) => handleInputChange("pageName", e.target.value)}
                  placeholder="Birthday Bash"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.Title}
                  onChange={(e) => handleInputChange("Title", e.target.value)}
                  placeholder="Ultimate Birthday Package"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.img_url}
                onChange={(e) => handleInputChange("img_url", e.target.value)}
                placeholder="https://example.com/images/birthday.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                placeholder="Celebrate in style"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="This package includes 2 hours of bowling, pizza, drinks, and decorations for up to 8 people."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cost</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.Cost}
                  onChange={(e) => handleInputChange("Cost", e.target.value)}
                  placeholder="4999.99"
                />
              </div>
              <div className="space-y-2">
                <Label>Number of People</Label>
                <Input
                  type="number"
                  value={formData.no_of_person}
                  onChange={(e) => handleInputChange("no_of_person", e.target.value)}
                  placeholder="8"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePackage}>Update Package</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
