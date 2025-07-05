"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users, Gift, Star, CheckCircle } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function PackagesHeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sectionRef.current && cardsRef.current.length > 0 && titleRef.current) {
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
        { y: 100, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.3,
          ease: "back.out(1.7)",
        },
        "-=0.4",
      )
    }
  }, [])

  return (
    <section
      id="packages"
      className="py-20 bg-gradient-to-br from-primary/5 via-white to-burgundy-50 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-burgundy-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20" ref={titleRef}>
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">Premium Bowling Packages</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Choose Your
            <span className="block text-primary">Perfect Package</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience authentic Canadian 5-pin bowling with our carefully crafted packages designed for every occasion
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Economical Package */}
          <Card
            className="overflow-hidden shadow-2xl border-0 hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 group cursor-pointer bg-gradient-to-br from-white to-gray-50 relative"
            ref={(el) => {
              if (el) cardsRef.current[0] = el
            }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-burgundy-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>

            <div className="relative z-10">
              <div className="relative overflow-hidden">
                <Image
                  src="/images/economical-package.png"
                  alt="Economical Public Bowling Package - $45 per lane per hour"
                  width={600}
                  height={300}
                  className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                  <span className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>Most Popular</span>
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">Economical Bowling</h3>
                  <div className="text-3xl font-bold">$45</div>
                  <div className="text-sm opacity-90">per lane per hour</div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Up to 6 people</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Hourly rate</span>
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
                  <Button className="w-full bg-primary hover:bg-burgundy-700 text-base py-3 transform hover:scale-105 transition-all duration-300 hover:shadow-xl group-hover:shadow-2xl">
                    Book Economical Package
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Birthday Package */}
          <Card
            className="overflow-hidden shadow-2xl border-0 hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 group cursor-pointer bg-gradient-to-br from-white to-green-50 relative"
            ref={(el) => {
              if (el) cardsRef.current[1] = el
            }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>

            <div className="relative z-10">
              <div className="relative overflow-hidden">
                <Image
                  src="/images/birthday-package.png"
                  alt="Birthday Party Package - $120 includes bowling, pizza, soft drinks"
                  width={600}
                  height={300}
                  className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                  <span className="flex items-center space-x-1">
                    <Gift className="w-4 h-4" />
                    <span>Great Value</span>
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">Birthday Party</h3>
                  <div className="text-3xl font-bold">$120</div>
                  <div className="text-sm opacity-90">complete package</div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 text-gray-700 bg-green-50 p-3 rounded-lg">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Party Package</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 bg-green-50 p-3 rounded-lg">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">2 Hours</span>
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
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-base py-3 transform hover:scale-105 transition-all duration-300 hover:shadow-xl group-hover:shadow-2xl">
                    Book Birthday Party
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Package Benefits */}
        <div className="mt-16 text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-5xl mx-auto border border-gray-200">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">Why Choose Our Packages?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl lg:text-3xl">🎳</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm lg:text-base">Authentic 5-Pin</span>
              <span className="text-xs lg:text-sm text-gray-600 text-center">True Canadian bowling experience</span>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl lg:text-3xl">🏆</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm lg:text-base">Premium Quality</span>
              <span className="text-xs lg:text-sm text-gray-600 text-center">Well-maintained lanes & equipment</span>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl lg:text-3xl">💰</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm lg:text-base">Great Value</span>
              <span className="text-xs lg:text-sm text-gray-600 text-center">HST included, no hidden fees</span>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl lg:text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm lg:text-base">Family Fun</span>
              <span className="text-xs lg:text-sm text-gray-600 text-center">Perfect for all ages</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
