import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    review:
      "Amazing 5-pin bowling experience! The staff was incredibly friendly and the lanes were in perfect condition. My family had such a great time at the birthday party package. Highly recommend!",
    date: "2 weeks ago",
    verified: true,
  },
  {
    name: "Mike Chen",
    rating: 5,
    review:
      "Been coming here for years and it never disappoints. The authentic Canadian 5-pin bowling is exactly what you'd expect. Great value for money and the pizza from the birthday package was delicious!",
    date: "1 month ago",
    verified: true,
  },
  {
    name: "Jennifer Smith",
    rating: 5,
    review:
      "Perfect place for a fun evening out! The economical package is great value and the atmosphere is fantastic. Clean facilities and well-maintained equipment. Will definitely be back!",
    date: "3 weeks ago",
    verified: true,
  },
  {
    name: "David Wilson",
    rating: 4,
    review:
      "Great local bowling alley with that classic 5-pin Canadian feel. Staff is helpful and the prices are reasonable. Looking forward to the new computer scoring system!",
    date: "1 week ago",
    verified: true,
  },
  {
    name: "Lisa Thompson",
    rating: 5,
    review:
      "Hosted my daughter's 10th birthday here and it was perfect! The birthday package included everything we needed. Kids had a blast and the parents enjoyed it too. Excellent service!",
    date: "2 months ago",
    verified: true,
  },
  {
    name: "Robert Martinez",
    rating: 5,
    review:
      "Authentic 5-pin bowling at its finest! As a Canadian living abroad, this place brings back so many memories. The lanes are well-maintained and the whole experience is top-notch.",
    date: "3 weeks ago",
    verified: true,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/google.png" alt="Google" className="w-10 h-10" />
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Google Reviews</h2>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-800">4.9</span>
            <span className="text-gray-600">out of 5 stars</span>
          </div>
          <p className="text-xl text-gray-600">Based on 150+ verified Google reviews</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.date}</p>
                    </div>
                    {testimonial.verified && (
                      <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <span>✓</span>
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gray-300" />
                    ))}
                  </div>

                  {/* Review */}
                  <p className="text-gray-700 leading-relaxed">{testimonial.review}</p>

                  {/* Google Badge */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                    <img src="/google.png" alt="Google" className="w-4 h-4" />
                    <span className="text-xs text-gray-500">Posted on Google</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-4">Join our happy customers and leave your own review!</p>
          <a
            href="https://www.google.com/search?q=5pinbowlin+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-burgundy-700 transition-colors"
          >
            <img src="/google.png" alt="Google" className="w-5 h-5" />
            <span>Write a Google Review</span>
          </a>
        </div>
      </div>
    </section>
  )
}
