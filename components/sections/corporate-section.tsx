"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, Calendar, FileText, Phone, Mail } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function CorporateSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sectionRef.current && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-semibold">Corporate Events</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Corporate & Team Events</h2>
          </div>

          <Card
            ref={cardRef}
            className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-500"
          >
            <CardContent className="p-8 lg:p-12">
              <div className="text-center space-y-8">
                {/* Main Message */}
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <div className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">LOOKING TO DO A</div>

                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="text-2xl lg:text-3xl font-bold text-blue-600">CORPORATE</div>
                      </div>

                      <div className="text-xl text-gray-600 font-medium">or</div>

                      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                        <div className="text-2xl lg:text-3xl font-bold text-green-600">OFFICE PARTY</div>
                      </div>

                      <div className="text-xl text-gray-600 font-medium">or</div>

                      <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                        <div className="text-2xl lg:text-3xl font-bold text-purple-600">TEAM FUNDRAISER</div>
                      </div>
                    </div>

                    <div className="text-3xl font-bold text-gray-900 mt-6">???</div>
                  </div>
                </div>

                {/* PDF Download Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 lg:p-8 rounded-2xl border-2 border-blue-200">
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center space-x-3 text-lg lg:text-xl font-semibold text-gray-800">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <span className="text-center">
                          Click on the PDF File below for more info and helpful hints!
                        </span>
                      </div>

                      <Button
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                        onClick={() => {
                          console.log("Download corporate info PDF")
                        }}
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Download Corporate Info PDF
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-8 rounded-2xl">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      PLEASE CONTACT OUR CENTRE FOR PRICING AND DATE AVAILABILITY.
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-center space-x-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <Phone className="w-6 h-6 text-primary" />
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">Call Us</div>
                          <div className="text-primary font-bold">(555) 123-BOWL</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <Mail className="w-6 h-6 text-primary" />
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">Email Us</div>
                          <div className="text-primary font-bold">corporate@5pinbowlin.com</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 pt-8">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Team Building</h4>
                    <p className="text-sm text-gray-600">Perfect for corporate team building activities</p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Calendar className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Flexible Scheduling</h4>
                    <p className="text-sm text-gray-600">Available outside regular business hours</p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <Building2 className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Custom Packages</h4>
                    <p className="text-sm text-gray-600">Tailored to your group size and budget</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
