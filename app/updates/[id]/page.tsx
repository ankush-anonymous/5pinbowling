"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { updatesApi, type Update, handleApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UpdatePage() {
  const params = useParams()
  const id = params.id as string

  const [update, setUpdate] = useState<Update | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const fetchUpdate = async () => {
        try {
          setIsLoading(true)
          const response = await updatesApi.getUpdateById(id)
          setUpdate(response)
        } catch (err) {
          const errorMessage = handleApiError(err)
          setError(errorMessage)
          console.error(`Failed to fetch update with id ${id}:`, errorMessage)
        } finally {
          setIsLoading(false)
        }
      }

      fetchUpdate()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <div className="text-5xl mb-4">😢</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Failed to Load Update</h1>
        <p className="text-red-600 mb-6">Error: {error}</p>
        <Button asChild>
          <Link href="/updates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Updates
          </Link>
        </Button>
      </div>
    )
  }

  if (!update) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <div className="text-5xl mb-4">🤔</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Update Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the update you're looking for.</p>
        <Button asChild>
          <Link href="/updates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Updates
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen py-12 sm:py-20">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm">
            <Link href="/updates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Updates
            </Link>
          </Button>
        </div>

        <article className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg border border-gray-200/80">
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <Image
              src={update.image_url || "/placeholder.svg"}
              alt={update.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 md:p-10 text-white">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {update.title}
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl text-primary font-semibold mt-2">
                {update.subtitle}
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-medium">Published on:</span>
                <span>{new Date(update.dateOfCreation).toLocaleDateString("en-US", { dateStyle: "long" })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span className="font-medium">Author:</span>
                <span>{update.author}</span>
              </div>
            </div>

            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: update.body }}
            ></div>
          </div>
        </article>
      </div>
    </div>
  )
}
