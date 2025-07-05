"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Mail } from "lucide-react"
import { gsap } from "gsap"

export function ContactHeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const graphicsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sectionRef.current && contentRef.current && graphicsRef.current) {
      const tl = gsap.timeline()

      tl.fromTo(
        contentRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
      ).fromTo(
        graphicsRef.current,
        { x: 100, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" },
        "-=0.5",
      )
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-primary/5 via-white to-burgundy-50 relative overflow-hidden min-h-screen flex items-center"
    >
      {/* Background Graphics */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-burgundy-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Content */}
          <div ref={contentRef} className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                <span className="text-primary font-semibold">Get In Touch</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Let's Connect
                <span className="block text-primary">& Bowl!</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Ready to experience authentic Canadian 5-pin bowling? We're here to help you plan the perfect visit.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Call Us</div>
                    <div className="text-primary font-bold">(555) 123-BOWL</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-green-600 font-bold text-sm">info@5pinbowlin.com</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-burgundy-700 transform hover:scale-105 transition-all">
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white transform hover:scale-105 transition-all bg-transparent"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </Button>
            </div>
          </div>

          {/* Graphics */}
          <div ref={graphicsRef} className="relative">
            <div className="relative">
              {/* Main Circle */}
              <div className="w-96 h-96 bg-gradient-to-br from-primary to-burgundy-600 rounded-full mx-auto relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

                {/* Floating Elements */}
                <div className="absolute top-8 left-8 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-2xl">🎳</span>
                </div>

                <div className="absolute top-16 right-12 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce delay-300">
                  <span className="text-xl">📞</span>
                </div>

                <div className="absolute bottom-16 left-12 w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-bounce delay-700">
                  <span className="text-xl">📧</span>
                </div>

                <div className="absolute bottom-8 right-8 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-bounce delay-500">
                  <span className="text-2xl">🏆</span>
                </div>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-2">5pin</div>
                    <div className="text-2xl">bowlin</div>
                    <div className="text-sm mt-2 opacity-80">Contact Us</div>
                  </div>
                </div>
              </div>

              {/* Orbiting Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-2xl">⭐</span>
              </div>

              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-pulse delay-1000">
                <span className="text-xl">✨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
