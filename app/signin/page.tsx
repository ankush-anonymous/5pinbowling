import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SignInSection } from "@/components/sections/signin-section"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <SignInSection />
      </main>
      <Footer />
    </div>
  )
}
