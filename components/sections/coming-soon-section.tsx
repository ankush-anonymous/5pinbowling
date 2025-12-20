"use client"

import { useState, useEffect } from "react"
import { Sparkles, Monitor, Zap } from "lucide-react"

export function ComingSoonSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/main_banner2.jpeg')" }}
      >
        {/* Red overlay with less opacity */}
        <div className="absolute inset-0 bg-red-800 bg-opacity-50"></div>
      </div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          {/* Sparkle Icons */}
          <div className="flex justify-center space-x-4 mb-8">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-bounce" />
            <Monitor className="w-10 h-10 text-white" />
            <Sparkles className="w-8 h-8 text-yellow-300 animate-bounce delay-200" />
          </div>

          {/* Main Announcement */}
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              <span className="inline-block animate-pulse">Exciting</span>
              <br />
              <span className="text-yellow-300 inline-block transform hover:scale-105 transition-transform">
                New Computer
              </span>
              <br />
              <span className="inline-block animate-pulse delay-300">Scoring System</span>
            </h2>

            <div className="flex items-center justify-center space-x-4 text-3xl lg:text-4xl font-bold text-yellow-300">
              <Zap className="w-8 h-8 animate-bounce" />
              <span className="animate-pulse">Coming Soon!!!</span>
              <Zap className="w-8 h-8 animate-bounce delay-300" />
            </div>

            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Get ready for the ultimate bowling experience with our state-of-the-art digital scoring system!
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="text-lg font-semibold text-white mb-2">Digital Displays</h3>
              <p className="text-white/80 text-sm">Crystal clear HD screens for every lane</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="text-lg font-semibold text-white mb-2">Interactive Fun</h3>
              <p className="text-white/80 text-sm">Games, animations, and celebrations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Tracking</h3>
              <p className="text-white/80 text-sm">Automatic scoring and statistics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
