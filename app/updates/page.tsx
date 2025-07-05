import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { UpdatesSection } from "@/components/sections/updates-section"

export default function UpdatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <UpdatesSection />
      </main>
      <Footer />
    </div>
  )
}
