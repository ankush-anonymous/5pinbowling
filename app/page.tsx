import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero-section"
import { ContactSection } from "@/components/sections/contact-section"
import { Footer } from "@/components/layout/footer"
import { CanadianSection } from "@/components/sections/canadian-section"
import { PackagesSection } from "@/components/sections/packages-section"
import { ComingSoonSection } from "@/components/sections/coming-soon-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { MapsSection } from "@/components/sections/maps-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CanadianSection />
        <PackagesSection />
        <ComingSoonSection />
        <TestimonialsSection />
        <ContactSection />
        <MapsSection />
      </main>
      <Footer />
    </div>
  )
}
