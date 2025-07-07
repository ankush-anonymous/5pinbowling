"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User, Eye, EyeOff } from "lucide-react"

export function SignInSection() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple authentication check (in real app, this would be server-side)
    if (formData.username === "admin" && formData.password === "bowling123") {
      // Simulate API call delay
      setTimeout(() => {
        localStorage.setItem("isAdminAuthenticated", "true")
        router.push("/admin")
      }, 1000)
    } else {
      setTimeout(() => {
        setError("Invalid username or password")
        setIsLoading(false)
      }, 1000)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Admin Sign In</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className="pl-10 pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-burgundy-700 h-12 text-lg"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Demo credentials: <br />
                  Username: <strong>admin</strong> <br />
                  Password: <strong>bowling123</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
