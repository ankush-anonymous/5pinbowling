"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function DominosSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const lottieRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sectionRef.current && textRef.current && lottieRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      tl.fromTo(
        textRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      ).fromTo(
        lottieRef.current,
        { x: 100, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.4",
      )
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Text Content */}
          <div ref={textRef} className="space-y-8">
            <div className="space-y-6">
              {/* Domino's Logo Placeholder */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-20 h-20 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">D</span>
                </div>
                <div className="text-red-600 font-bold text-3xl">DOMINO'S</div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  We proudly serve
                  <span className="block text-red-600">Domino's Pizza!</span>
                </h2>

               
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-600">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Included:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">🍕</span>
                    </div>
                    <span className="text-gray-700">Fresh XL Domino's Pizza</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">🎯</span>
                    </div>
                    <span className="text-gray-700">Choice of 2 toppings</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">🥤</span>
                    </div>
                    <span className="text-gray-700">Jug of pop included</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">⚡</span>
                    </div>
                    <span className="text-gray-700">Served hot and fresh</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <div className="flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full">
                  <span className="text-red-600 font-semibold">Quality Guaranteed</span>
                  <span className="text-red-600">✓</span>
                </div>
                <div className="flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full">
                  <span className="text-orange-600 font-semibold">Fresh Ingredients</span>
                  <span className="text-orange-600">✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lottie Animation Space */}
          <div ref={lottieRef} className="flex justify-center">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-red-100 max-w-lg w-full">
              <div className="text-center space-y-4">
                <div className="bg-red-50 rounded-2xl p-8 min-h-[400px] flex items-center justify-center border-2 border-dashed border-red-200">
                  <div className="text-center space-y-4 w-full">
                    <div className="w-full h-80">
                      <DotLottieReact
                        src="https://lottie.host/f0c29add-8cbf-490f-a5ac-6cda87f7f815/L7tep28Hn9.lottie"
                        loop
                        autoplay
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
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
