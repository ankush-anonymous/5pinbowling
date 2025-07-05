import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/placeholder-video.mp4" type="video/mp4" />
          {/* Fallback background */}
          <div className="w-full h-full bg-gradient-to-br from-primary to-burgundy-900"></div>
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white space-y-8 max-w-4xl mx-auto">
          {/* Content */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2 text-burgundy-200">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm">Rated #1 Bowling Zone</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Welcome to
              <span className="block text-burgundy-200">5pinbowlin</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Book Your Lane
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              View Packages
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/30 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-burgundy-200">Premium Lanes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm text-burgundy-200">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm text-burgundy-200">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
