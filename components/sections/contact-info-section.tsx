"use client"

import { useEffect, useRef } from "react"
import { MapPin, Phone, Mail, Clock, Car, Bus } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function ContactInfoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (sectionRef.current && cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }
  }, [])

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      content: ["123 Bowling Lane", "Entertainment District", "Toronto, ON M5V 3A8"],
      color: "bg-red-500",
      bgColor: "bg-red-50",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: ["(555) 123-BOWL", "Available during business hours", "Quick response guaranteed"],
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: ["info@5pinbowlin.com", "corporate@5pinbowlin.com", "We reply within 24 hours"],
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: ["Thu-Fri: 12 PM - 9 PM", "Saturday: 11 AM - 10 PM", "Sunday: 11 AM - 7 PM"],
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Car,
      title: "Parking",
      content: ["Free parking available", "Large parking lot", "Wheelchair accessible"],
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: Bus,
      title: "Public Transit",
      content: ["TTC Bus Route 123", "5-minute walk from station", "Multiple transit options"],
      color: "bg-teal-500",
      bgColor: "bg-teal-50",
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Us & Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Multiple ways to connect with us - choose what works best for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon
            return (
              <div
                key={index}
                className={`${info.bgColor} p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group`}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el
                }}
              >
                <div className="text-center space-y-4">
                  <div
                    className={`w-16 h-16 ${info.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">{info.title}</h3>

                  <div className="space-y-2">
                    {info.content.map((line, lineIndex) => (
                      <p key={lineIndex} className="text-gray-600 text-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl mx-auto">
            <div className="text-4xl mb-4">🎳</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Bowl?</h3>
            <p className="text-gray-600 mb-6">
              Contact us today to book your lane or ask any questions about our packages and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-burgundy-700 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300">
                Call (555) 123-BOWL
              </button>
              <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300">
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
