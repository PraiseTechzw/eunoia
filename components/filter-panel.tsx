"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockEntries } from "@/lib/mock-data"

export function FilterPanel() {
  const [minWordCount, setMinWordCount] = useState("")
  const [maxWordCount, setMaxWordCount] = useState("")
  const [sentiment, setSentiment] = useState("all")

  // Get unique sentiments from entries
  const sentiments = Array.from(new Set(mockEntries.map(entry => entry.sentiment)))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minWords">Min Words</Label>
          <Input
            id="minWords"
            type="number"
            placeholder="0"
            value={minWordCount}
            onChange={(e) => setMinWordCount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxWords">Max Words</Label>
          <Input
            id="maxWords"
            type="number"
            placeholder="1000"
            value={maxWordCount}
            onChange={(e) => setMaxWordCount(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sentiment">Sentiment</Label>
        <Select value={sentiment} onValueChange={setSentiment}>
          <SelectTrigger>
            <SelectValue placeholder="Select sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiments</SelectItem>
            {sentiments.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button className="w-full">Apply Filters</Button>
    </div>
  )
} 