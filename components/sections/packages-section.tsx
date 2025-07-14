"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Star, ArrowRight } from "lucide-react"
import { packagesApi, type Package, handleApiError } from "@/lib/api"

export function PackagesSection() {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await packagesApi.getAllPackages()
      // Show only first 3 packages on home page
      setPackages(response.data.slice(0, 3))
    } catch (error) {
      console.error("Failed to fetch packages:", handleApiError(error))
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Packages</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Packages</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our exciting bowling packages designed for every occasion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={pkg.img_url || "/placeholder.svg?height=250&width=400"}
                  alt={pkg.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Price overlay */}
                <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-2 rounded-full flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-bold">{pkg.cost}</span>
                </div>
                {/* Popular badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                    <p className="text-primary font-semibold">{pkg.subtitle}</p>
                  </div>

                  <p className="text-gray-600 leading-relaxed">{pkg.description}</p>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm">Up to {pkg.no_of_person} people</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">${pkg.cost}</span>
                    </div>
                  </div>

                  {/* Bottom section with price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-2xl font-bold text-primary">${pkg.cost}</div>
                      <div className="text-sm text-gray-500">for {pkg.no_of_person} people</div>
                    </div>
                    <Button className="group-hover:bg-primary-dark transition-colors">
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <a href="/packages">
              View All Packages
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
