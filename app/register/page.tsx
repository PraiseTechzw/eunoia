"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
import { PasswordStrengthMeter } from "@/components/password-strength-meter"
import { Checkbox } from "@/components/ui/checkbox"

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordScore, setPasswordScore] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const name = formData.get("name") as string

    // This would normally connect to a real authentication system
    // For demo purposes, we'll simulate a successful registration
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Account created!",
        description: "Welcome to Eunoia Journal. Let's set up your MFA.",
      })
      router.push("/mfa-setup")
    }, 1500)
  }

  return (
    <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-screen">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-emerald-600" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="mr-2 h-6 w-6" />
          Eunoia Journal
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Eunoia has transformed how I reflect on my life. The insights I've gained through the AI analysis have
              been truly eye-opening."
            </p>
            <footer className="text-sm">Dr. Maya Richardson</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your information to create your Eunoia account</p>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="sso">SSO</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <Card>
                <form onSubmit={onSubmit}>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" placeholder="Enter your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <PasswordStrengthMeter password={password} onScoreChange={setPasswordScore} />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox id="terms" required />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Link href="/terms" className="text-teal-500 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-teal-500 hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading || passwordScore < 3}>
                      {isLoading ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="sso">
              <Card>
                <CardHeader>
                  <CardTitle>Single Sign-On</CardTitle>
                  <CardDescription>Connect with your organization's identity provider.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full" onClick={() => router.push("/mfa-setup")}>
                    <Icons.google className="mr-2 h-4 w-4" />
                    Continue with Google
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/mfa-setup")}>
                    <Icons.microsoft className="mr-2 h-4 w-4" />
                    Continue with Microsoft
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/mfa-setup")}>
                    <Icons.apple className="mr-2 h-4 w-4" />
                    Continue with Apple
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

