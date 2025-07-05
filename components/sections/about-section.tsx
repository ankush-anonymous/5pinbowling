import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

const features = [
  "24 state-of-the-art bowling lanes",
  "Professional-grade equipment",
  "Full-service restaurant & bar",
  "Private party rooms available",
  "Arcade and entertainment area",
  "Professional bowling instruction",
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="Strike Zone interior"
              width={600}
              height={500}
              className="rounded-lg shadow-lg"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-lg shadow-lg">
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm">Years of Excellence</div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">About Strike Zone</h2>
              <p className="text-lg text-gray-600 mb-6">
                For over 15 years, Strike Zone has been the premier bowling destination, providing exceptional
                entertainment experiences for bowlers of all skill levels. Our modern facility combines classic bowling
                fun with contemporary amenities.
              </p>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Button size="lg" className="bg-primary hover:bg-burgundy-700">
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
