"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, ArrowRight } from "lucide-react"
import Link from "next/link"

const prompts = [
  "What are three things you're grateful for today?",
  "Describe a challenge you're facing and three potential solutions.",
  "What's something you're looking forward to, and why does it excite you?",
  "Reflect on a recent interaction that affected you emotionally. What did you learn?",
  "What's one small step you can take today toward a long-term goal?",
  "Describe a moment when you felt proud of yourself recently.",
  "What boundaries do you need to establish or reinforce in your life?",
  "If you could give advice to your younger self, what would it be?",
  "What's something you've been avoiding, and what's one small step to address it?",
  "Describe your ideal day. What elements can you incorporate into your life now?",
]

export function JournalPrompts() {
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0])

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length)
    setCurrentPrompt(prompts[randomIndex])
  }

  return (
    <div className="space-y-4">
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm italic">{currentPrompt}</p>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={getRandomPrompt} className="text-xs flex items-center gap-1">
          <RefreshCw className="h-3 w-3" /> New Prompt
        </Button>

        <Link
          href={{
            pathname: "/entries/new",
            query: { prompt: encodeURIComponent(currentPrompt) },
          }}
        >
          <Button size="sm" className="text-xs flex items-center gap-1">
            Write <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

