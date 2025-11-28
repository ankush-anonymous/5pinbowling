"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"
import { updatesApi, type Update, handleApiError } from "@/lib/api"
import Link from "next/link"

export function UpdatesSection() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setIsLoading(true)
        const response = await updatesApi.getAllUpdates()
        // Handle both direct array response and object with data property
        setUpdates(response.data || response)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        console.error("Failed to fetch updates:", errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUpdates()
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <span className="text-primary font-semibold">Latest News</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Updates & News</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed about the latest happenings at 5pinbowlin
          </p>
        </div>

        {/* Updates List */}
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading updates...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📢</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Updates</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12">
            {updates.map((update, index) => (
              <Card
                key={update._id}
                className="overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative h-64 lg:h-auto">
                      <Image
                        src={update.image_url || "/placeholder.svg"}
                        alt={update.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="space-y-6">
                        {/* Meta Information */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{update.author}</span>
                          </div>
                        </div>

                        {/* Title and Subtitle */}
                        <div className="space-y-3">
                          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                            {update.title}
                          </h2>
                          <h3 className="text-lg text-primary font-semibold">{update.subtitle}</h3>
                        </div>

                        {/* Body */}
                        <p className="text-gray-600 leading-relaxed text-base lg:text-lg">{update.body}</p>

                        {/* Read More Link */}
                        <div className="pt-4">
                          <Link href={`/updates/${update._id}`}>
                            <button className="text-primary hover:text-burgundy-700 font-semibold transition-colors">
                              Read More →
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State for when no updates */}
        {!isLoading && !error && updates.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📢</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Updates Yet</h3>
            <p className="text-gray-600">Check back soon for the latest news and updates!</p>
          </div>
        )}
      </div>
    </section>
  )
}