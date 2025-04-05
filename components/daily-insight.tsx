"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const insights = [
  {
    text: "Your entries show a positive trend in emotional well-being over the past month. Keep up the good work!",
    type: "positive",
  },
  {
    text: "You've mentioned 'work stress' in 7 entries this month. Consider exploring stress management techniques.",
    type: "suggestion",
  },
  {
    text: "Your language patterns indicate increased self-compassion compared to last month.",
    type: "positive",
  },
  {
    text: "You tend to journal more productively in the morning. Consider making it part of your morning routine.",
    type: "suggestion",
  },
  {
    text: "Your entries mentioning 'family' are consistently associated with positive emotions.",
    type: "positive",
  },
]

export function DailyInsight() {
  const [insight, setInsight] = useState(insights[0])
  const [feedbackGiven, setFeedbackGiven] = useState(false)
  const { toast } = useToast()

  const getRandomInsight = () => {
    const randomIndex = Math.floor(Math.random() * insights.length)
    setInsight(insights[randomIndex])
    setFeedbackGiven(false)
  }

  const handleFeedback = (isHelpful: boolean) => {
    setFeedbackGiven(true)
    toast({
      title: isHelpful ? "Feedback received" : "We'll improve our insights",
      description: isHelpful
        ? "We're glad you found this insight helpful!"
        : "Thank you for your feedback. We'll use it to improve future insights.",
      variant: isHelpful ? "default" : "destructive",
    })
  }

  return (
    <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border-teal-100 dark:border-teal-900">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-teal-100 dark:bg-teal-900 rounded-full p-2 mt-1">
            <Brain className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">AI Insight</h3>
            <p className="text-muted-foreground">{insight.text}</p>

            {!feedbackGiven && (
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => handleFeedback(true)}>
                  <ThumbsUp className="h-3 w-3 mr-1" /> Helpful
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => handleFeedback(false)}>
                  <ThumbsDown className="h-3 w-3 mr-1" /> Not Helpful
                </Button>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={getRandomInsight}
            className="text-teal-600 hover:text-teal-700 hover:bg-teal-100 dark:text-teal-400 dark:hover:text-teal-300 dark:hover:bg-teal-900"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">New insight</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

