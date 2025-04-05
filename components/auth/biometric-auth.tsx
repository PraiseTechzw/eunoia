"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/hooks/use-translation"
import { useToast } from "@/hooks/use-toast"

interface BiometricAuthProps {
  onSuccess: () => void
  onCancel: () => void
}

export function BiometricAuth({ onSuccess, onCancel }: BiometricAuthProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [fingerPosition, setFingerPosition] = useState({ x: 0, y: 0 })
  const scannerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { toast } = useToast()

  // Simulate fingerprint scanning with realistic progress
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isScanning) {
      // Reset progress
      setProgress(0)

      // Simulate scanning with variable speed to appear more realistic
      interval = setInterval(() => {
        setProgress((prev) => {
          // Simulate scanning phases with different speeds
          const increment =
            prev < 30
              ? 2
              : // Initial scan phase
                prev < 60
                ? 1
                : // Middle scan phase (slower)
                  prev < 85
                  ? 3
                  : // Processing phase (faster)
                    1 // Final verification phase (slower again)

          const newProgress = prev + increment

          // Simulate occasional scan pauses for realism
          if ((prev === 45 || prev === 75) && Math.random() > 0.7) {
            return prev
          }

          if (newProgress >= 100) {
            clearInterval(interval)
            setIsScanning(false)

            // Simulate success or failure based on finger position
            const isGoodPosition =
              fingerPosition.x > 0.3 && fingerPosition.x < 0.7 && fingerPosition.y > 0.3 && fingerPosition.y < 0.7

            if (isGoodPosition || attempts >= 2) {
              // Success after 2 attempts or good position
              toast({
                title: t("biometric.successTitle"),
                description: t("biometric.successDescription"),
                variant: "default",
              })
              setTimeout(() => onSuccess(), 500)
            } else {
              // Failure on first attempt with bad position
              setError(t("biometric.positionError"))
              setAttempts((prev) => prev + 1)
            }
            return 100
          }

          return newProgress
        })
      }, 50) // Faster interval for smoother animation
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isScanning, fingerPosition, attempts, onSuccess, t, toast])

  // Track mouse/touch position for fingerprint simulation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!scannerRef.current || !isScanning) return

      const rect = scannerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      setFingerPosition({ x, y })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!scannerRef.current || !isScanning || !e.touches[0]) return

      const rect = scannerRef.current.getBoundingClientRect()
      const x = (e.touches[0].clientX - rect.left) / rect.width
      const y = (e.touches[0].clientY - rect.top) / rect.height

      setFingerPosition({ x, y })
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("touchmove", handleTouchMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isScanning])

  const startScan = () => {
    setIsScanning(true)
    setError(null)

    // Provide user guidance
    toast({
      title: t("biometric.scanStarted"),
      description: t("biometric.moveFingerTip"),
      variant: "default",
    })
  }

  const handleCancel = () => {
    setIsScanning(false)
    setProgress(0)
    setError(null)
    onCancel()
  }

  const simulateError = () => {
    setIsScanning(false)
    setProgress(0)
    setError(t("biometric.error"))

    // Provide detailed error feedback
    toast({
      title: t("biometric.errorTitle"),
      description: t("biometric.errorDescription"),
      variant: "destructive",
    })
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("biometric.title")}</CardTitle>
          <CardDescription>{t("biometric.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-6">
          <div
            ref={scannerRef}
            className={`relative w-40 h-40 rounded-full border-2 flex items-center justify-center cursor-pointer ${
              isScanning ? "border-teal-500 animate-pulse" : error ? "border-red-500" : "border-muted-foreground"
            }`}
            onClick={isScanning ? undefined : startScan}
          >
            {isScanning ? (
              <Icons.fingerprint
                className={`h-24 w-24 text-teal-500 transition-all duration-300 ${
                  fingerPosition.x > 0 && fingerPosition.y > 0
                    ? `opacity-${Math.floor((fingerPosition.x + fingerPosition.y) * 5)}0`
                    : "opacity-50"
                }`}
              />
            ) : error ? (
              <Icons.xCircle className="h-24 w-24 text-red-500" />
            ) : (
              <Icons.fingerprint className="h-24 w-24 text-muted-foreground" />
            )}

            {isScanning && (
              <>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="4"
                    fill="transparent"
                    r="48"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-teal-500 stroke-current"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="transparent"
                    r="48"
                    cx="50"
                    cy="50"
                    style={{
                      strokeDasharray: 300,
                      strokeDashoffset: 300 - (progress / 100) * 300,
                      transformOrigin: "center",
                      transform: "rotate(-90deg)",
                    }}
                  />
                </svg>

                {/* Scanning animation */}
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div
                    className="absolute inset-0 bg-teal-500/10"
                    style={{
                      top: `${progress}%`,
                      boxShadow: "0 0 10px rgba(20, 184, 166, 0.5)",
                      transition: "top 0.1s ease-out",
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-center">
              <p>{error}</p>
            </div>
          )}

          <div className="text-center">
            {isScanning ? (
              <p className="animate-pulse">{t("biometric.scanning")}</p>
            ) : error ? (
              <p>{attempts > 1 ? t("biometric.tryAgainCarefully") : t("biometric.tryAgain")}</p>
            ) : (
              <p>{t("biometric.instructions")}</p>
            )}

            {/* Progress indicator */}
            {isScanning && (
              <p className="text-sm text-muted-foreground mt-2">
                {progress < 30
                  ? t("biometric.initializing")
                  : progress < 60
                    ? t("biometric.analyzing")
                    : progress < 85
                      ? t("biometric.processing")
                      : t("biometric.verifying")}
                ... {progress}%
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={handleCancel}>
            {t("biometric.cancel")}
          </Button>

          {error ? (
            <Button onClick={startScan}>{t("biometric.retry")}</Button>
          ) : isScanning ? (
            <Button variant="destructive" onClick={simulateError}>
              {t("biometric.simulateError")}
            </Button>
          ) : (
            <Button onClick={startScan}>{t("biometric.scan")}</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

