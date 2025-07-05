import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContactHeroSection } from "@/components/sections/contact-hero-section"
import { ContactFormSection } from "@/components/sections/contact-form-section"
import { ContactInfoSection } from "@/components/sections/contact-info-section"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ContactHeroSection />
        <ContactFormSection />
        <ContactInfoSection />
      </main>
      <Footer />
    </div>
  )
}
