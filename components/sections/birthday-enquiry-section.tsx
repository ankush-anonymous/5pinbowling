"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Gift, User } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function BirthdayEnquirySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    childAge: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    numberOfGuests: "",
    specialRequests: "",
  })

  useEffect(() => {
    if (sectionRef.current && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Birthday party enquiry:", formData)
  }

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-pink-100 px-4 py-2 rounded-full mb-6">
            <Gift className="w-5 h-5 text-pink-600" />
            <span className="text-pink-600 font-semibold">Birthday Party Planning</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Plan Your Perfect
            <span className="block text-pink-600">Birthday Party!</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let us help you create an unforgettable birthday celebration with our special party package
          </p>
        </div>

        <div ref={formRef} className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center space-x-3">
                <span className="text-4xl">🎂</span>
                <span>Birthday Party Enquiry</span>
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours to confirm your party details
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Contact Information</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                        Parent/Guardian Name *
                      </label>
                      <Input
                        id="parentName"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-2">
                        Birthday Child's Name *
                      </label>
                      <Input
                        id="childName"
                        name="childName"
                        value={formData.childName}
                        onChange={handleInputChange}
                        placeholder="Birthday child's name"
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>

                {/* Party Details */}
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Party Details</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="childAge" className="block text-sm font-medium text-gray-700 mb-2">
                        Child's Age *
                      </label>
                      <Input
                        id="childAge"
                        name="childAge"
                        type="number"
                        value={formData.childAge}
                        onChange={handleInputChange}
                        placeholder="Age"
                        required
                        className="h-12"
                        min="1"
                        max="18"
                      />
                    </div>
                    <div>
                      <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests *
                      </label>
                      <Input
                        id="numberOfGuests"
                        name="numberOfGuests"
                        type="number"
                        value={formData.numberOfGuests}
                        onChange={handleInputChange}
                        placeholder="Total guests (max 6 per lane)"
                        required
                        className="h-12"
                        min="1"
                        max="20"
                      />
                    </div>
                    <div>
                      <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <Input
                        id="preferredDate"
                        name="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <Input
                        id="preferredTime"
                        name="preferredTime"
                        type="time"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-green-600" />
                    <span>Special Requests</span>
                  </h3>
                  <div>
                    <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information or Special Requests
                    </label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any dietary restrictions, decorations, or special arrangements you'd like us to know about..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Package Summary */}
                <div className="bg-primary/5 p-6 rounded-xl border-2 border-primary/20">
                  <h3 className="text-xl font-semibold text-primary mb-4">Birthday Party Package Includes:</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>2 hours of bowling</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>XL Domino's Pizza (2 toppings)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>Jug of pop</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>Bowling shoes included</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>Up to 6 people per lane</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>All for just $120!</span>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto bg-primary hover:bg-burgundy-700 text-base lg:text-lg px-8 lg:px-12 py-3 lg:py-4 transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Submit Birthday Party Enquiry
                  </Button>
                  <p className="text-sm text-gray-500 mt-4 px-4">
                    We'll contact you within 24 hours to confirm availability and finalize your party details
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
