import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const pricingPlans = [
  {
    name: "Casual Play",
    price: "$25",
    period: "per hour",
    description: "Perfect for casual bowling with friends and family",
    features: ["Up to 6 players per lane", "Shoe rental included", "Standard lane time", "Access to snack bar"],
    popular: false,
  },
  {
    name: "Party Package",
    price: "$199",
    period: "for 2 hours",
    description: "Ideal for birthday parties and celebrations",
    features: [
      "Up to 8 players per lane",
      "Shoe rental included",
      "2 hours of bowling",
      "Party room access",
      "Food & drink packages",
      "Dedicated party host",
    ],
    popular: true,
  },
  {
    name: "Corporate Events",
    price: "Custom",
    period: "pricing",
    description: "Tailored packages for corporate team building",
    features: [
      "Multiple lanes reserved",
      "Catering options available",
      "Team building activities",
      "Private event space",
      "Audio/visual equipment",
      "Event coordination",
    ],
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Pricing & Packages</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect package for your bowling experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : "border-gray-200"}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <CardDescription className="mt-4 text-gray-600">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  <Button
                    className={`w-full ${plan.popular ? "bg-primary hover:bg-burgundy-700" : "bg-gray-900 hover:bg-gray-800"}`}
                    size="lg"
                  >
                    {plan.price === "Custom" ? "Get Quote" : "Book Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
