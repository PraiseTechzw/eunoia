"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { DateRangePicker } from "@/components/date-range-picker"
import { mockTags } from "@/lib/mock-data"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function FilterPanel() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sentimentRange, setSentimentRange] = useState([0, 100])
  const [wordCountRange, setWordCountRange] = useState([0, 500])
  const [filters, setFilters] = useState({
    hasMedia: false,
    hasCode: false,
  })

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setDateRange({})
    setSelectedTags([])
    setSentimentRange([0, 100])
    setWordCountRange([0, 500])
    setFilters({
      hasMedia: false,
      hasCode: false,
    })
  }

  // Apply filters
  const applyFilters = () => {
    // In a real app, this would apply the filters to the entries
    console.log("Applying filters:", {
      dateRange,
      selectedTags,
      sentimentRange,
      wordCountRange,
      ...filters,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Date Range</h3>
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Tags</h3>
        <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-1">
          {mockTags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.name) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag.name)}
            >
              {tag.name} ({tag.count})
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Sentiment</h3>
        <div className="px-2">
          <Slider value={sentimentRange} min={0} max={100} step={5} onValueChange={setSentimentRange} />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Negative</span>
            <span>Neutral</span>
            <span>Positive</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Word Count</h3>
        <div className="px-2">
          <Slider value={wordCountRange} min={0} max={1000} step={50} onValueChange={setWordCountRange} />
          <div className="flex justify-between mt-1 text-xs">
            <span>{wordCountRange[0]} words</span>
            <span>{wordCountRange[1]} words</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Content Type</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="has-media" className="cursor-pointer">
              Contains Media
            </Label>
            <Switch
              id="has-media"
              checked={filters.hasMedia}
              onCheckedChange={(checked) => setFilters({ ...filters, hasMedia: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="has-code" className="cursor-pointer">
              Contains Code
            </Label>
            <Switch
              id="has-code"
              checked={filters.hasCode}
              onCheckedChange={(checked) => setFilters({ ...filters, hasCode: checked })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={resetFilters} className="gap-1">
          <X className="h-4 w-4" />
          Reset
        </Button>
        <Button size="sm" onClick={applyFilters} className="gap-1">
          <Check className="h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

