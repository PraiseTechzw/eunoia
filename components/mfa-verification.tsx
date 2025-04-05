"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

interface MFAVerificationProps {
  onSuccess: () => void
}

export function MFAVerification({ onSuccess }: MFAVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleVerify = () => {
    setIsLoading(true)

    // Simulate verification
    setTimeout(() => {
      setIsLoading(false)
      onSuccess()
    }, 1500)
  }

  const handleResendCode = () => {
    setTimeLeft(30)
    // In a real app, this would trigger sending a new code
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verification Required</CardTitle>
          <CardDescription>Enter the verification code to complete sign-in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                A verification code has been sent to your authentication app. Enter the code to continue.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                placeholder="123456"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>

            <div className="text-sm text-center">
              {timeLeft > 0 ? (
                <p className="text-muted-foreground">
                  Didn't receive a code? You can request a new one in {timeLeft} seconds.
                </p>
              ) : (
                <Button variant="link" className="p-0 h-auto text-sm" onClick={handleResendCode}>
                  Resend verification code
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleVerify} disabled={verificationCode.length !== 6 || isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Sign In"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

