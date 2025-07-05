"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎳</span>
            </div>
            <span className="text-xl font-bold text-primary">5pinbowlin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/packages" className="text-gray-700 hover:text-primary transition-colors">
              Bowling Packages
            </Link>
            <Link href="#leagues" className="text-gray-700 hover:text-primary transition-colors">
              Our Leagues
            </Link>
            <Link href="/updates" className="text-gray-700 hover:text-primary transition-colors">
              Updates
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>(555) 123-BOWL</span>
            </div>
            <Button className="bg-primary hover:bg-burgundy-700">Book Now</Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/packages" className="text-gray-700 hover:text-primary transition-colors">
                Bowling Packages
              </Link>
              <Link href="#leagues" className="text-gray-700 hover:text-primary transition-colors">
                Our Leagues
              </Link>
              <Link href="/updates" className="text-gray-700 hover:text-primary transition-colors">
                Updates
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary transition-colors">
                Contact Us
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-BOWL</span>
                </div>
                <Button className="w-full bg-primary hover:bg-burgundy-700">Book Now</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
