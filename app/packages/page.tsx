import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PackagesHeroSection } from "@/components/sections/packages-hero-section"
import { BirthdayEnquirySection } from "@/components/sections/birthday-enquiry-section"
import { DominosSection } from "@/components/sections/dominos-section"
import { CorporateSection } from "@/components/sections/corporate-section"

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PackagesHeroSection />
        <BirthdayEnquirySection />
        <DominosSection />
        <CorporateSection />
      </main>
      <Footer />
    </div>
  )
}
