"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const reminders = [
  "You're worthy of love, even when it feels far away.",
  "Healing isn't linear. Be patient with yourself.",
  "You are enough, exactly as you are.",
  "Pain is temporary. Growth is permanent.",
  "One day, someone will choose you freely and fully.",
  "Your feelings are valid, but they don't define you.",
  "Every day is a new opportunity to love yourself better.",
  "The right person will never make you question your worth.",
  "You deserve someone who is certain about you.",
  "Trust the journey, even when you can't see the path ahead.",
]

export function DailyReminder() {
  const [reminder, setReminder] = useState("")

  const getRandomReminder = () => {
    const randomIndex = Math.floor(Math.random() * reminders.length)
    setReminder(reminders[randomIndex])
  }

  useEffect(() => {
    getRandomReminder()
  }, [])

  return (
    <Card className="bg-rose-50 border-rose-100">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-rose-100 rounded-full p-2 mt-1">
            <Heart className="h-5 w-5 text-rose-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Daily Reminder</h3>
            <p className="text-gray-700 italic">{reminder}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={getRandomReminder}
            className="text-rose-500 hover:text-rose-600 hover:bg-rose-100"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">New reminder</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

