"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { mockEmotions } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Plus, Save, Smile, Frown } from "lucide-react"
import { useSimulation } from "@/hooks/use-simulation"

export function MoodTracker() {
  const [currentMood, setCurrentMood] = useState<number | null>(null)
  const [moodNote, setMoodNote] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [moodHistory, setMoodHistory] = useState(mockEmotions.dailyMood)
  const { t } = useTranslation()
  const { toast } = useToast()

  // Simulate saving mood
  const {
    execute: saveMood,
    isLoading: isSaving,
    isSuccess,
  } = useSimulation<any, [any]>("entries", "createEntry", false)

  // Reset form after successful save
  useEffect(() => {
    if (isSuccess) {
      setIsEditing(false)
      setCurrentMood(null)
      setMoodNote("")
    }
  }, [isSuccess])

  // Get mood emoji and color
  const getMoodEmoji = (value: number) => {
    if (value >= 8) return { emoji: "😄", color: "text-emerald-500" }
    if (value >= 6) return { emoji: "🙂", color: "text-teal-500" }
    if (value >= 4) return { emoji: "😐", color: "text-amber-500" }
    if (value >= 2) return { emoji: "😕", color: "text-orange-500" }
    return { emoji: "😞", color: "text-red-500" }
  }

  // Handle mood save
  const handleSaveMood = () => {
    if (currentMood === null) return

    // Prepare mood data
    const moodData = {
      mood: currentMood,
      note: moodNote,
      date: new Date().toISOString(),
    }

    // Save mood
    saveMood(moodData)

    // Show success toast
    toast({
      title: t("moodTracker.saved"),
      description: t("moodTracker.savedDescription"),
    })

    // Update mood history (in a real app, this would come from the API)
    setMoodHistory((prev) => [
      {
        date: new Date().toISOString().split("T")[0],
        value: currentMood,
      },
      ...prev.slice(0, 29), // Keep last 30 days
    ])
  }

  // Start tracking mood
  const startTracking = () => {
    setIsEditing(true)
    setCurrentMood(5) // Default to neutral
  }

  // Cancel tracking
  const cancelTracking = () => {
    setIsEditing(false)
    setCurrentMood(null)
    setMoodNote("")
  }

  // Render mood history calendar
  const renderMoodHistory = () => {
    const today = new Date()
    const days = []

    // Create array of last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(today.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      // Find mood for this date
      const moodEntry = moodHistory.find((m) => m.date === dateString)

      days.push({
        date: dateString,
        day: date.getDate(),
        mood: moodEntry?.value || null,
      })
    }

    return (
      <div className="grid grid-cols-7 gap-1 mt-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={`header-${i}`} className="text-center text-xs text-muted-foreground">
            {day}
          </div>
        ))}

        {/* Fill in empty cells at the beginning */}
        {Array.from({ length: new Date(days[0].date).getDay() }).map((_, i) => (
          <div key={`empty-start-${i}`} className="h-8" />
        ))}

        {/* Render days */}
        {days.map((day) => {
          const isToday = day.date === today.toISOString().split("T")[0]
          const { emoji, color } = day.mood ? getMoodEmoji(day.mood) : { emoji: "", color: "" }

          return (
            <div
              key={day.date}
              className={`h-8 flex items-center justify-center text-xs rounded-full ${
                isToday ? "border-2 border-primary" : ""
              }`}
            >
              {day.mood ? (
                <div className={`w-full h-full flex items-center justify-center ${color}`}>
                  <span>{emoji}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">{day.day}</span>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("moodTracker.title")}</CardTitle>
            <CardDescription>{t("moodTracker.description")}</CardDescription>
          </div>

          {!isEditing && (
            <Button variant="outline" size="sm" onClick={startTracking} className="gap-1">
              <Plus className="h-4 w-4" />
              {t("moodTracker.track")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t("moodTracker.howAreYou")}</span>
                {currentMood !== null && <span className="text-xl">{getMoodEmoji(currentMood).emoji}</span>}
              </div>

              <div className="flex items-center gap-2">
                <Frown className="h-4 w-4 text-red-500" />
                <Slider
                  value={currentMood !== null ? [currentMood] : [5]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setCurrentMood(value[0])}
                  className="flex-1"
                />
                <Smile className="h-4 w-4 text-emerald-500" />
              </div>

              <div className="pt-2">
                <textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder={t("moodTracker.notePlaceholder")}
                  className="w-full h-20 p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={cancelTracking}>
                {t("moodTracker.cancel")}
              </Button>

              <Button size="sm" onClick={handleSaveMood} disabled={currentMood === null || isSaving} className="gap-1">
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {t("moodTracker.save")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">{t("moodTracker.history")}</h3>
            </div>

            {renderMoodHistory()}

            <div className="flex justify-between text-xs text-muted-foreground pt-2">
              <span>{t("moodTracker.lastMonth")}</span>
              <span>{t("moodTracker.today")}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

