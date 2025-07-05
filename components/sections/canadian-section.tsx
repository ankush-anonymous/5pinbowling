"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function CanadianSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (sectionRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      tl.fromTo(textRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }).fromTo(
        cardsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.3",
      )
    }
  }, [])

  return (
    <section className="py-16 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Company Logo */}
          <div className="mb-8">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">🎳</span>
              </div>
              <h2 className="text-4xl font-bold text-primary">5pinbowlin</h2>
            </div>
          </div>

          {/* Main Text with Canadian Flag */}
          <div className="space-y-6" ref={textRef}>
            <div className="flex items-center justify-center space-x-4 text-2xl lg:text-3xl font-semibold text-gray-800">
              <span>proudly offers the great</span>
              <div className="inline-flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg border-2 border-red-200">
                <span className="text-3xl">🇨🇦</span>
                <span className="text-red-600 font-bold">Canadian</span>
              </div>
              <span>game of</span>
            </div>

            <h3 className="text-4xl lg:text-5xl font-bold text-primary">5 Pin Bowling !!!</h3>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the authentic Canadian bowling tradition that's been bringing families and friends together for
              generations.
            </p>
          </div>

          {/* Lottie Animation Space */}
          <div className="mt-12">
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
              <div className="text-center space-y-4">
                <p className="text-gray-500 font-medium">
                  <DotLottieReact
                    src="https://lottie.host/5980b509-7b16-4b82-b412-f6f992558ae5/2bzjN3sCSf.lottie"
                    loop
                    autoplay
                  />
                </p>
              </div>
            </div>
          </div>

          {/* Additional Canadian 5-Pin Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div
              className="text-center p-6 bg-red-50 rounded-lg hover:bg-red-100 transform hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              ref={(el) => (cardsRef.current[0] = el!)}
            >
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-semibold text-gray-800 mb-2">5 Pins</h4>
              <p className="text-sm text-gray-600">Unique Canadian setup with 5 pins instead of 10</p>
            </div>
            <div
              className="text-center p-6 bg-red-50 rounded-lg hover:bg-red-100 transform hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              ref={(el) => (cardsRef.current[1] = el!)}
            >
              <div className="text-3xl mb-3">⚾</div>
              <h4 className="font-semibold text-gray-800 mb-2">Smaller Ball</h4>
              <p className="text-sm text-gray-600">Hand-sized ball without finger holes</p>
            </div>
            <div
              className="text-center p-6 bg-red-50 rounded-lg hover:bg-red-100 transform hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              ref={(el) => (cardsRef.current[2] = el!)}
            >
              <div className="text-3xl mb-3">🏆</div>
              <h4 className="font-semibold text-gray-800 mb-2">Canadian Heritage</h4>
              <p className="text-sm text-gray-600">Invented in Toronto in 1909</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
