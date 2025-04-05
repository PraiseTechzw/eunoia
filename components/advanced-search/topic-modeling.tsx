"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { mockEntries } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"

interface TopicModelingProps {
  entries: typeof mockEntries
}

interface Topic {
  id: string
  name: string
  keywords: string[]
  entries: string[]
}

export function TopicModeling({ entries }: TopicModelingProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    // Simulate topic modeling analysis
    setIsLoading(true)

    setTimeout(() => {
      // This is a mock implementation
      // In a real app, this would use a proper NLP library or API
      const mockTopics: Topic[] = [
        {
          id: "1",
          name: "Work and Career",
          keywords: ["work", "project", "deadline", "team", "productivity"],
          entries: entries
            .filter(
              (entry) =>
                entry.content.toLowerCase().includes("work") ||
                entry.content.toLowerCase().includes("project") ||
                entry.tags.some((tag) => tag === "work"),
            )
            .map((entry) => entry.id),
        },
        {
          id: "2",
          name: "Personal Growth",
          keywords: ["growth", "learning", "progress", "goals", "improvement"],
          entries: entries
            .filter(
              (entry) =>
                entry.content.toLowerCase().includes("growth") ||
                entry.content.toLowerCase().includes("goals") ||
                entry.tags.some((tag) => tag === "personal growth" || tag === "goals"),
            )
            .map((entry) => entry.id),
        },
        {
          id: "3",
          name: "Health and Wellness",
          keywords: ["health", "exercise", "sleep", "energy", "nutrition"],
          entries: entries
            .filter(
              (entry) =>
                entry.content.toLowerCase().includes("health") ||
                entry.content.toLowerCase().includes("exercise") ||
                entry.tags.some((tag) => tag === "health"),
            )
            .map((entry) => entry.id),
        },
        {
          id: "4",
          name: "Relationships",
          keywords: ["relationships", "communication", "boundaries", "support", "connection"],
          entries: entries
            .filter(
              (entry) =>
                entry.content.toLowerCase().includes("relationship") ||
                entry.content.toLowerCase().includes("communication") ||
                entry.tags.some((tag) => tag === "relationships"),
            )
            .map((entry) => entry.id),
        },
        {
          id: "5",
          name: "Finances",
          keywords: ["finances", "budget", "saving", "spending", "investment"],
          entries: entries
            .filter(
              (entry) =>
                entry.content.toLowerCase().includes("finance") ||
                entry.content.toLowerCase().includes("budget") ||
                entry.tags.some((tag) => tag === "finances"),
            )
            .map((entry) => entry.id),
        },
      ]

      setTopics(mockTopics)
      setIsLoading(false)

      if (mockTopics.length > 0) {
        setSelectedTopic(mockTopics[0].id)
      }
    }, 1500)
  }, [entries])

  const selectedTopicData = topics.find((topic) => topic.id === selectedTopic)
  const topicEntries = selectedTopicData ? entries.filter((entry) => selectedTopicData.entries.includes(entry.id)) : []

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Button
                key={topic.id}
                variant={selectedTopic === topic.id ? "default" : "outline"}
                onClick={() => setSelectedTopic(topic.id)}
                className="flex items-center gap-2"
              >
                {topic.name}
                <Badge variant="secondary" className="ml-1">
                  {topic.entries.length}
                </Badge>
              </Button>
            ))}
          </div>

          {selectedTopicData && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedTopicData.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">{t("search.topicEntries")}</h3>
                {topicEntries.length > 0 ? (
                  <div className="grid gap-2">
                    {topicEntries.map((entry) => (
                      <div key={entry.id} className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{entry.title}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {entry.content.replace(/<[^>]*>/g, "")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{t("search.noEntriesForTopic")}</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

