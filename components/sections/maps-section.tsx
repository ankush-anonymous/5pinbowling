"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function MapsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && mapRef.current && infoRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        infoRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      ).fromTo(
        mapRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Located in the heart of the city, easy to find and plenty of parking
            available
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Location Info */}
          <div ref={infoRef} className="w-full grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            <div className="bg-gradient-to-br from-primary/5 to-burgundy-50 p-6 lg:p-8 rounded-2xl h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Visit 5pinbowlin
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Address
                    </h4>
                    <p className="text-gray-600 text-sm lg:text-base">
                      123 Bowling Lane
                      <br />
                      Entertainment District
                      <br />
                      Toronto, ON M5V 3A8
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Parking
                    </h4>
                    <p className="text-gray-600 text-sm lg:text-base">
                      Free parking available
                      <br />
                      Large parking lot
                      <br />
                      Wheelchair accessible
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🚌</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Public Transit
                    </h4>
                    <p className="text-gray-600 text-sm lg:text-base">
                      TTC Bus Route 123
                      <br />
                      5-minute walk from station
                      <br />
                      Multiple transit options
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg h-full min-h-[300px]">
              <img 
                src="/images/map_image.jpeg" 
                alt="Bowling Alley Interior" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Google Maps */}
          <div ref={mapRef} className="w-full">
            <div className="bg-gray-200 rounded-2xl overflow-hidden shadow-2xl h-96 lg:h-[500px] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.1234567890123!2d-79.3831843!3d43.6532260!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDM5JzExLjYiTiA3OcKwMjInNTkuNSJX!5e0!3m2!1sen!2sca!4v1234567890123!5m2!1sen!2sca"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="5pinbowlin Location"
                className="hover:grayscale-0 grayscale transition-all duration-300"
              ></iframe>

              {/* Overlay with business info */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 lg:p-4 rounded-lg shadow-lg max-w-[200px]">
                <h4 className="font-bold text-primary text-base lg:text-lg">
                  5pinbowlin
                </h4>
                <p className="text-xs lg:text-sm text-gray-600">
                  Canadian 5-Pin Bowling
                </p>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="text-yellow-400 text-xs lg:text-sm"
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 ml-1">4.9 (150+)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
