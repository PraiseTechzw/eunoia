"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/hooks/use-translation"

enum RecoveryStep {
  EMAIL_ENTRY = 0,
  VERIFICATION_CODE = 1,
  NEW_PASSWORD = 2,
  SUCCESS = 3,
}

export default function ForgotPassword() {
  const [step, setStep] = useState<RecoveryStep>(RecoveryStep.EMAIL_ENTRY)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate sending recovery email
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: t("recovery.emailSent.title"),
        description: t("recovery.emailSent.description", { email }),
      })
      setStep(RecoveryStep.VERIFICATION_CODE)
    }, 1500)
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate verifying code
    setTimeout(() => {
      setIsLoading(false)
      if (verificationCode === "123456") {
        setStep(RecoveryStep.NEW_PASSWORD)
      } else {
        toast({
          title: t("recovery.invalidCode.title"),
          description: t("recovery.invalidCode.description"),
          variant: "destructive",
        })
      }
    }, 1000)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: t("recovery.passwordMismatch.title"),
        description: t("recovery.passwordMismatch.description"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false)
      setStep(RecoveryStep.SUCCESS)
    }, 1500)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        {step === RecoveryStep.EMAIL_ENTRY && (
          <>
            <CardHeader>
              <CardTitle>{t("recovery.title")}</CardTitle>
              <CardDescription>{t("recovery.emailDescription")}</CardDescription>
            </CardHeader>
            <form onSubmit={handleEmailSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("recovery.emailLabel")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="ghost" onClick={() => router.push("/auth/login")}>
                  {t("recovery.backToLogin")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      {t("recovery.sending")}
                    </>
                  ) : (
                    t("recovery.sendInstructions")
                  )}
                </Button>
              </CardFooter>
            </form>
          </>
        )}

        {step === RecoveryStep.VERIFICATION_CODE && (
          <>
            <CardHeader>
              <CardTitle>{t("recovery.verifyTitle")}</CardTitle>
              <CardDescription>{t("recovery.verifyDescription", { email })}</CardDescription>
            </CardHeader>
            <form onSubmit={handleVerificationSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">{t("recovery.codeLabel")}</Label>
                    <Input
                      id="code"
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground">{t("recovery.codeHint")}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="ghost" onClick={() => setStep(RecoveryStep.EMAIL_ENTRY)}>
                  {t("recovery.back")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      {t("recovery.verifying")}
                    </>
                  ) : (
                    t("recovery.verify")
                  )}
                </Button>
              </CardFooter>
            </form>
          </>
        )}

        {step === RecoveryStep.NEW_PASSWORD && (
          <>
            <CardHeader>
              <CardTitle>{t("recovery.resetTitle")}</CardTitle>
              <CardDescription>{t("recovery.resetDescription")}</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("recovery.newPassword")}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t("recovery.confirmPassword")}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      {t("recovery.resetting")}
                    </>
                  ) : (
                    t("recovery.resetPassword")
                  )}
                </Button>
              </CardFooter>
            </form>
          </>
        )}

        {step === RecoveryStep.SUCCESS && (
          <>
            <CardHeader>
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <Icons.check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>{t("recovery.successTitle")}</CardTitle>
                <CardDescription>{t("recovery.successDescription")}</CardDescription>
              </div>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/auth/login")}>
                {t("recovery.backToLogin")}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

