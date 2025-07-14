"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { businessHoursApi, type BusinessHour, handleApiError } from "@/lib/api"

const Footer = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const footerRef = useRef<HTMLElement>(null)
  const hoursRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)
    }
  }, [])

  useEffect(() => {
    const fetchBusinessHours = async () => {
      try {
        setIsLoading(true)
        const hours = await businessHoursApi.getAllBusinessHours()
        // Sort by day_no to ensure correct order
        const sortedHours = hours.sort((a, b) => a.day_no - b.day_no)
        setBusinessHours(sortedHours)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        console.error("Failed to fetch business hours:", errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBusinessHours()
  }, [])

  useEffect(() => {
    if (footerRef.current && hoursRef.current) {
      gsap.fromTo(
        hoursRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: hoursRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }
  }, [])

  function HoursBar({ day_name, starttime, endtime, offday }: BusinessHour) {
    const barRef = useRef<HTMLDivElement>(null)

    // Convert time format from "HH:MM:SS" to hour number
    const timeToHour = (timeString: string) => {
      const [hours] = timeString.split(":").map(Number)
      return hours
    }

    const startHour = offday ? 0 : timeToHour(starttime)
    const endHour = offday ? 0 : timeToHour(endtime)

    // Calculate percentage based on 11AM (11) to 11PM (23) scale
    const scaleStart = 11
    const scaleEnd = 23
    const totalHours = scaleEnd - scaleStart

    const startPercent = offday ? 0 : ((startHour - scaleStart) / totalHours) * 100
    const widthPercent = offday ? 0 : ((endHour - startHour) / totalHours) * 100

    // Format display time
    const formatTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(":")
      const hour = Number.parseInt(hours)
      const ampm = hour >= 12 ? "PM" : "AM"
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      return `${displayHour}:${minutes} ${ampm}`
    }

    const displayHours = offday ? "CLOSED" : `${formatTime(starttime)} - ${formatTime(endtime)}`

    useEffect(() => {
      if (barRef.current && !offday) {
        gsap.fromTo(
          barRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power2.out",
            delay: Math.random() * 0.5,
            scrollTrigger: {
              trigger: barRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    }, [offday])

    return (
      <div className="flex items-center justify-between py-3 group hover:bg-white/5 rounded-lg px-2 lg:px-4 transition-all duration-300">
        <span className="text-white font-medium w-16 lg:w-20 text-left text-xs lg:text-base">
          {day_name.slice(0, 3)}
        </span>

        <div className="flex-1 mx-2 lg:mx-6 relative">
          {/* Background track */}
          <div className="h-4 lg:h-8 bg-gray-700/50 rounded-full relative overflow-hidden">
            {!offday && (
              <div
                ref={barRef}
                className="absolute h-full bg-gradient-to-r from-primary to-burgundy-600 rounded-full border border-primary/30 lg:border-2 shadow-lg origin-left"
                style={{
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`,
                }}
              />
            )}
            {offday && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-400 text-xs font-medium">CLOSED</span>
              </div>
            )}
          </div>

          {/* Time markers */}
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>11AM</span>
            <span>11PM</span>
          </div>
        </div>

        <span className="text-gray-300 text-xs lg:text-sm w-24 lg:w-40 text-right">{displayHours}</span>
      </div>
    )
  }

  return (
    <footer
      ref={footerRef}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Business Hours Section */}
        <div ref={hoursRef} className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Business Hours</h3>
            <p className="text-gray-300">Visit us during these times for the best 5-pin bowling experience</p>
          </div>

          <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-700/50">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-300">Loading business hours...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-400 mb-4">Error loading business hours: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-primary hover:text-burgundy-200 underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {businessHours.map((schedule) => (
                  <HoursBar key={schedule.id} {...schedule} />
                ))}
              </div>
            )}

            {/* Special Arrangements Note */}
            <div className="mt-8 pt-6 border-t border-gray-600/50">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 lg:p-6">
                <h4 className="text-primary font-bold text-lg mb-3">NOTE</h4>
                <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
                  <strong>SPECIAL ARRANGEMENTS</strong> for groups at times outside of the published hours can be made
                  by pre-booking <strong>RESERVATIONS</strong>. Please call ahead during business hours OR complete the
                  above <strong>RESERVATION FORM</strong> to make those arrangements with the bowling centre.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content - Simplified */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-lg mb-6 text-white">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div className="text-gray-300 text-sm lg:text-base">
                  <p>123 Bowling Lane</p>
                  <p>Entertainment District</p>
                  <p>Toronto, ON M5V 3A8</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+15551232695"
                  className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
                >
                  (555) 123-BOWL
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@5pinbowlin.com"
                  className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
                >
                  info@5pinbowlin.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Bowling Packages", href: "/packages" },
                { name: "Our Leagues", href: "/leagues" },
                { name: "Updates", href: "/updates" },
                { name: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block text-sm lg:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand & Social Media */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎳</span>
              </div>
              <span className="text-2xl font-bold">5pinbowlin</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 text-sm lg:text-base">
              Your premier Canadian 5-pin bowling destination. Creating memorable experiences and bringing families
              together since 2008.
            </p>

            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Follow Us</h4>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Youtube, href: "#", label: "YouTube" },
                ].map(({ icon: Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all duration-300 hover:scale-110"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left text-sm">
              &copy; {new Date().getFullYear()} 5pinbowlin. All rights reserved. | Proudly Canadian 🇨🇦
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
