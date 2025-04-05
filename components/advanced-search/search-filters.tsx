"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { Slider } from "@/components/ui/slider"
import { mockTags } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function SearchFilters() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sentimentRange, setSentimentRange] = useState([0, 100])
  const { t } = useTranslation()

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSentimentRange([0, 100])
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>{t("search.filters.dateRange")}</Label>
            <DatePickerWithRange className="mt-1.5" />
          </div>

          <div>
            <Label>{t("search.filters.sentiment")}</Label>
            <div className="pt-6 px-2">
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={sentimentRange}
                onValueChange={setSentimentRange}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{t("search.filters.negative")}</span>
                <span>{t("search.filters.neutral")}</span>
                <span>{t("search.filters.positive")}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("search.filters.contentType")}</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="has-images" />
                <label
                  htmlFor="has-images"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("search.filters.hasImages")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="has-code" />
                <label
                  htmlFor="has-code"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("search.filters.hasCode")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="has-links" />
                <label
                  htmlFor="has-links"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("search.filters.hasLinks")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="has-tables" />
                <label
                  htmlFor="has-tables"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("search.filters.hasTables")}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>{t("search.filters.tags")}</Label>
            <div className="border rounded-md p-2 h-[200px] overflow-y-auto mt-1.5">
              <div className="flex flex-wrap gap-2">
                {mockTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag.name)}
                  >
                    {tag.name}
                    <span className="ml-1 text-xs">({tag.count})</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>{t("search.filters.excludeWords")}</Label>
            <Input placeholder={t("search.filters.excludeWordsPlaceholder")} className="mt-1.5" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          {t("search.filters.clearAll")}
        </Button>

        <Button>{t("search.filters.applyFilters")}</Button>
      </div>
    </div>
  )
}

