"use client"

import { useEffect } from "react"
import { Progress } from "@/components/ui/progress"

interface PasswordStrengthMeterProps {
  password: string
  onScoreChange: (score: number) => void
}

export function PasswordStrengthMeter({ password, onScoreChange }: PasswordStrengthMeterProps) {
  // Calculate password strength score (0-5)
  const calculateScore = (password: string): number => {
    if (!password) return 0

    let score = 0

    // Length check
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1 // Has uppercase
    if (/[0-9]/.test(password)) score += 1 // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1 // Has special char

    return score
  }

  const score = calculateScore(password)
  const percentage = (score / 5) * 100

  useEffect(() => {
    onScoreChange(score)
  }, [score, onScoreChange])

  const getStrengthLabel = (score: number): string => {
    if (score === 0) return "Very Weak"
    if (score === 1) return "Weak"
    if (score === 2) return "Fair"
    if (score === 3) return "Good"
    if (score === 4) return "Strong"
    return "Very Strong"
  }

  const getStrengthColor = (score: number): string => {
    if (score <= 1) return "bg-red-500"
    if (score === 2) return "bg-orange-500"
    if (score === 3) return "bg-yellow-500"
    if (score === 4) return "bg-green-500"
    return "bg-emerald-500"
  }

  return (
    <div className="space-y-2">
      <Progress value={percentage} className={`h-2 ${password ? getStrengthColor(score) : ""}`} />
      {password && (
        <div className="flex justify-between text-xs">
          <span>{getStrengthLabel(score)}</span>
          {score < 3 && <span className="text-muted-foreground">Add uppercase, numbers, and special characters</span>}
        </div>
      )}
    </div>
  )
}

