"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users, Gift, CheckCircle } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function PackagesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (sectionRef.current && cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { y: 100, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }
  }, [])

  return (
    <section id="packages" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Bowling Packages</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect package for your 5-pin bowling experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Economical Package */}
          <Card
            className="overflow-hidden shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 group cursor-pointer"
            ref={(el) => {
              if (el) cardsRef.current[0] = el
            }}
          >
            <div className="relative">
              <Image
                src="/images/economical-package.png"
                alt="Economical Public Bowling Package - $45 per lane per hour"
                width={600}
                height={300}
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-2xl font-bold">$45</div>
                <div className="text-sm opacity-90">per lane per hour</div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Economical Bowling</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 p-2 rounded-lg">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">Up to 6 people</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm">Hourly rate</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Professional 5-pin bowling lanes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Quality bowling balls provided</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Shoe rental: $2.50/pair (required)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">HST included in pricing</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button className="w-full bg-primary hover:bg-burgundy-700 text-base py-3 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                  Book Economical Bowling
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Birthday Package */}
          <Card
            className="overflow-hidden shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 group cursor-pointer"
            ref={(el) => {
              if (el) cardsRef.current[1] = el
            }}
          >
            <div className="relative">
              <Image
                src="/images/birthday-package.png"
                alt="Birthday Party Package - $120 includes bowling, pizza, soft drinks"
                width={600}
                height={300}
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Great Value
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-2xl font-bold">$120</div>
                <div className="text-sm opacity-90">complete package</div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Birthday Party</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 text-gray-700 bg-green-50 p-2 rounded-lg">
                    <Gift className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Party Package</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 bg-green-50 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm">2 Hours</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">2 hours of bowling fun</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">XL Domino's Pizza (2 toppings)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Jug of pop included</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Bowling shoes included</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Up to 6 people per lane</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-base py-3 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                  Book Birthday Party
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Package Info */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">All Packages Include</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎳</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm">5-Pin Bowling</span>
              <span className="text-xs text-gray-600 text-center">Authentic Canadian experience</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm">Quality Equipment</span>
              <span className="text-xs text-gray-600 text-center">Well-maintained lanes & balls</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm">HST Included</span>
              <span className="text-xs text-gray-600 text-center">No hidden fees</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm">Family Fun</span>
              <span className="text-xs text-gray-600 text-center">Perfect for all ages</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
