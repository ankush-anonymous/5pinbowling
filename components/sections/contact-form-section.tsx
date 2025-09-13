"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, User, Mail, MessageSquare } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { mailApi, handleApiError } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function ContactFormSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const graphicsRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (sectionRef.current && formRef.current && graphicsRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      })

      tl.fromTo(
        formRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      ).fromTo(
        graphicsRef.current,
        { x: 80, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
        "-=0.4",
      )
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await mailApi.sendContactForm(formData)
      toast({
        title: "Message Sent!",
        description: "We have received your message and will get back to you shortly.",
      })
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch (err) {
      const errorMessage = handleApiError(err)
      toast({
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Contact Form */}
          <div ref={formRef}>
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center space-x-3">
                  <MessageSquare className="w-8 h-8 text-primary" />
                  <span>Send us a Message</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          className="pl-10 h-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="pl-10 h-12"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-burgundy-700 transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Graphics */}
          <div ref={graphicsRef} className="relative">
            <div className="space-y-8">
              {/* Floating Cards */}
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl rotate-12 shadow-lg flex items-center justify-center">
                  <span className="text-white text-2xl">📧</span>
                </div>

                <div className="absolute top-8 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl -rotate-12 shadow-lg flex items-center justify-center">
                  <span className="text-white text-xl">📞</span>
                </div>

                <div className="absolute bottom-0 left-8 w-28 h-28 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl rotate-6 shadow-lg flex items-center justify-center">
                  <span className="text-white text-2xl">💬</span>
                </div>

                {/* Main Graphic */}
                <div className="bg-gradient-to-br from-primary/10 to-burgundy-50 rounded-3xl p-12 text-center relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-6xl mb-6">🎳</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">We're Here to Help!</h3>
                    <p className="text-gray-600 mb-6">
                      Whether you're planning a party, need information about our packages, or just want to say hello -
                      we'd love to hear from you!
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/50 p-3 rounded-lg">
                        <div className="font-semibold text-primary">Quick Response</div>
                        <div className="text-gray-600">Within 24 hours</div>
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg">
                        <div className="font-semibold text-primary">Friendly Service</div>
                        <div className="text-gray-600">Personal touch</div>
                      </div>
                    </div>
                  </div>

                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 left-4 w-8 h-8 bg-primary rounded-full"></div>
                    <div className="absolute top-12 right-8 w-6 h-6 bg-burgundy-600 rounded-full"></div>
                    <div className="absolute bottom-8 left-12 w-10 h-10 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}