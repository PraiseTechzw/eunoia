"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
import { QRCode } from "@/components/qr-code"

export default function MFASetup() {
  const [step, setStep] = useState<"method" | "setup" | "verify">("method")
  const [method, setMethod] = useState<"app" | "sms" | "email">("app")
  const [isLoading, setIsLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleMethodSelect = () => {
    setStep("setup")
  }

  const handleSetupComplete = () => {
    setStep("verify")
  }

  const handleVerify = () => {
    setIsLoading(true)

    // Simulate verification
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "MFA Setup Complete",
        description: "Your account is now secured with multi-factor authentication.",
      })
      router.push("/dashboard")
    }, 1500)
  }

  const handleSkip = () => {
    toast({
      title: "MFA Setup Skipped",
      description: "You can set up MFA later in your account settings.",
      variant: "destructive",
    })
    router.push("/dashboard")
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Multi-Factor Authentication</CardTitle>
          <CardDescription>Enhance your account security with an additional verification step.</CardDescription>
        </CardHeader>

        {step === "method" && (
          <>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    Multi-factor authentication adds an extra layer of security to your account by requiring a second
                    verification method in addition to your password.
                  </p>
                </div>

                <RadioGroup value={method} onValueChange={(value) => setMethod(value as "app" | "sms" | "email")}>
                  <div className="flex items-start space-x-2 border rounded-md p-4 mb-3">
                    <RadioGroupItem value="app" id="app" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="app" className="font-medium">
                        Authenticator App (Recommended)
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Use an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 border rounded-md p-4 mb-3">
                    <RadioGroupItem value="sms" id="sms" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="sms" className="font-medium">
                        SMS Verification
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive verification codes via text message to your phone.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="email" id="email" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="email" className="font-medium">
                        Email Verification
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive verification codes via email.</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleSkip}>
                Skip for now
              </Button>
              <Button onClick={handleMethodSelect}>Continue</Button>
            </CardFooter>
          </>
        )}

        {step === "setup" && (
          <>
            <CardContent>
              <div className="space-y-4">
                {method === "app" && (
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Download an authenticator app if you don't have one already</li>
                        <li>Scan the QR code below with your authenticator app</li>
                        <li>Enter the 6-digit code from the app to verify</li>
                      </ol>
                    </div>

                    <div className="flex justify-center py-4">
                      <QRCode value="otpauth://totp/Eunoia:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Eunoia" />
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-center text-muted-foreground">
                        Can't scan the QR code? Use this code instead:
                      </p>
                      <p className="text-sm font-mono text-center mt-1 select-all">JBSWY3DPEHPK3PXP</p>
                    </div>
                  </div>
                )}

                {method === "sms" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+1 (555) 123-4567" />
                      <p className="text-xs text-muted-foreground">Standard message and data rates may apply.</p>
                    </div>
                  </div>
                )}

                {method === "email" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value="user@example.com" disabled />
                      <p className="text-xs text-muted-foreground">
                        We'll send verification codes to this email address.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("method")}>
                Back
              </Button>
              <Button onClick={handleSetupComplete}>{method === "app" ? "Continue" : "Send Code"}</Button>
            </CardFooter>
          </>
        )}

        {step === "verify" && (
          <>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {method === "app"
                      ? "Enter the 6-digit code from your authenticator app."
                      : `Enter the verification code sent to your ${method === "sms" ? "phone" : "email"}.`}
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
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("setup")}>
                Back
              </Button>
              <Button onClick={handleVerify} disabled={verificationCode.length !== 6 || isLoading}>
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Complete"
                )}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

