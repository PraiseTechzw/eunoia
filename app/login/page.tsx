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
import { MFAVerification } from "@/components/mfa-verification"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [showMFA, setShowMFA] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // This would normally connect to a real authentication system
    // For demo purposes, we'll simulate a successful login with MFA
    setTimeout(() => {
      setIsLoading(false)
      setShowMFA(true)
    }, 1000)
  }

  const handleMFASuccess = () => {
    toast({
      title: "Logged in successfully",
      description: "Welcome back to Eunoia Journal!",
    })
    router.push("/dashboard")
  }

  if (showMFA) {
    return <MFAVerification onSuccess={handleMFASuccess} />
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
              "Eunoia Journal has become an essential part of my daily routine. The insights I gain from my entries have
              been transformative."
            </p>
            <footer className="text-sm">Alex Chen, Product Designer</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your Eunoia Journal account</p>
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
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/forgot-password" className="text-sm text-teal-500 hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input id="password" name="password" type="password" placeholder="••••••••" required />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
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
                  <Button variant="outline" className="w-full" onClick={() => setShowMFA(true)}>
                    <Icons.google className="mr-2 h-4 w-4" />
                    Continue with Google
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setShowMFA(true)}>
                    <Icons.microsoft className="mr-2 h-4 w-4" />
                    Continue with Microsoft
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setShowMFA(true)}>
                    <Icons.apple className="mr-2 h-4 w-4" />
                    Continue with Apple
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

