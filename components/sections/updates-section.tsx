"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Sample updates data - this will come from your backend later
const sampleUpdates = [
  {
    id: 1,
    title: "New Computer Scoring System Installation",
    subtitle: "Enhanced bowling experience coming soon",
    body: "We're excited to announce that our new state-of-the-art computer scoring system is being installed this month. This upgrade will provide digital displays, interactive games, and automatic scoring for an enhanced bowling experience. Stay tuned for the official launch date!",
    image: "/placeholder.svg?height=300&width=500",
    date: "2024-01-15",
    author: "5pinbowlin Team",
  },
  {
    id: 2,
    title: "Extended Weekend Hours",
    subtitle: "More time for family fun",
    body: "Starting this weekend, we're extending our Saturday hours until 11 PM to accommodate more families and groups. This change comes in response to popular demand from our valued customers who want more flexibility for their bowling sessions.",
    image: "/placeholder.svg?height=300&width=500",
    date: "2024-01-10",
    author: "Management",
  },
  {
    id: 3,
    title: "Birthday Party Package Updates",
    subtitle: "Even more value for celebrations",
    body: "We've enhanced our birthday party packages with additional options including themed decorations and extended party room access. Our partnership with Domino's continues to provide fresh, hot pizza for all celebrations.",
    image: "/placeholder.svg?height=300&width=500",
    date: "2024-01-05",
    author: "Events Team",
  },
]

export function UpdatesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sectionRef.current && titleRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      tl.fromTo(
        titleRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      ).fromTo(
        cardsRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        },
        "-=0.4",
      )
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16" ref={titleRef}>
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <span className="text-primary font-semibold">Latest News</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Updates & News</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed about the latest happenings at 5pinbowlin
          </p>
        </div>

        {/* Updates List */}
        <div className="max-w-4xl mx-auto space-y-12">
          {sampleUpdates.map((update, index) => (
            <Card
              key={update.id}
              className="overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all duration-300 bg-white"
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
            >
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-64 lg:h-auto">
                    <Image src={update.image || "/placeholder.svg"} alt={update.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="space-y-6">
                      {/* Meta Information */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(update.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{update.author}</span>
                        </div>
                      </div>

                      {/* Title and Subtitle */}
                      <div className="space-y-3">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{update.title}</h2>
                        <h3 className="text-lg text-primary font-semibold">{update.subtitle}</h3>
                      </div>

                      {/* Body */}
                      <p className="text-gray-600 leading-relaxed text-base lg:text-lg">{update.body}</p>

                      {/* Read More Link */}
                      <div className="pt-4">
                        <button className="text-primary hover:text-burgundy-700 font-semibold transition-colors">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for when no updates */}
        {sampleUpdates.length === 0 && (
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
