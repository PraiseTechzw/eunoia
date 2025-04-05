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
import { MFAVerification } from "@/components/auth/mfa-verification"
import { BiometricAuth } from "@/components/auth/biometric-auth"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslation } from "@/hooks/use-translation"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [showMFA, setShowMFA] = useState(false)
  const [showBiometric, setShowBiometric] = useState(false)
  const [authMethod, setAuthMethod] = useState<"password" | "social" | "biometric">("password")
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()

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

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true)
    setAuthMethod("social")

    // Simulate social login
    setTimeout(() => {
      setIsLoading(false)
      // Some social logins might still require MFA depending on security settings
      if (Math.random() > 0.5) {
        setShowMFA(true)
      } else {
        handleLoginSuccess()
      }
    }, 1500)
  }

  const handleBiometricLogin = () => {
    setAuthMethod("biometric")
    setShowBiometric(true)
  }

  const handleBiometricSuccess = () => {
    // Biometric auth successful, proceed to dashboard
    handleLoginSuccess()
  }

  const handleBiometricCancel = () => {
    setShowBiometric(false)
  }

  const handleMFASuccess = () => {
    handleLoginSuccess()
  }

  const handleLoginSuccess = () => {
    toast({
      title: t("login.success.title"),
      description: t("login.success.description"),
    })
    router.push("/dashboard")
  }

  if (showBiometric) {
    return <BiometricAuth onSuccess={handleBiometricSuccess} onCancel={handleBiometricCancel} />
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
          {t("app.name")}
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">{t("login.testimonial.quote")}</p>
            <footer className="text-sm">{t("login.testimonial.author")}</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{t("login.welcome")}</h1>
            <p className="text-sm text-muted-foreground">{t("login.subtitle")}</p>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">{t("login.tabs.email")}</TabsTrigger>
              <TabsTrigger value="sso">{t("login.tabs.sso")}</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <Card>
                <form onSubmit={onSubmit}>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("login.form.email")}</Label>
                      <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">{t("login.form.password")}</Label>
                        <Link href="/auth/forgot-password" className="text-sm text-teal-500 hover:underline">
                          {t("login.form.forgot")}
                        </Link>
                      </div>
                      <Input id="password" name="password" type="password" placeholder="••••••••" required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t("login.form.remember")}
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          {t("login.form.signingIn")}
                        </>
                      ) : (
                        t("login.form.signIn")
                      )}
                    </Button>

                    <Button type="button" variant="outline" className="w-full" onClick={handleBiometricLogin}>
                      <Icons.fingerprint className="mr-2 h-4 w-4" />
                      {t("login.form.biometric")}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="sso">
              <Card>
                <CardHeader>
                  <CardTitle>{t("login.social.title")}</CardTitle>
                  <CardDescription>{t("login.social.description")}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLogin("google")}
                    disabled={isLoading}
                  >
                    <Icons.google className="mr-2 h-4 w-4" />
                    {t("login.social.google")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLogin("microsoft")}
                    disabled={isLoading}
                  >
                    <Icons.microsoft className="mr-2 h-4 w-4" />
                    {t("login.social.microsoft")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLogin("apple")}
                    disabled={isLoading}
                  >
                    <Icons.apple className="mr-2 h-4 w-4" />
                    {t("login.social.apple")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLogin("facebook")}
                    disabled={isLoading}
                  >
                    <Icons.facebook className="mr-2 h-4 w-4" />
                    {t("login.social.facebook")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLogin("twitter")}
                    disabled={isLoading}
                  >
                    <Icons.twitter className="mr-2 h-4 w-4" />
                    {t("login.social.twitter")}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="px-8 text-center text-sm text-muted-foreground">
            {t("login.noAccount")}{" "}
            <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
              {t("login.signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

