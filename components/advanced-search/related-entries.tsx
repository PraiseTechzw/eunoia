"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockEntries } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import { Tag, Calendar } from "lucide-react"
import Link from "next/link"

interface RelatedEntriesProps {
  entryId?: string
  searchQuery?: string
}

export function RelatedEntries({ entryId, searchQuery }: RelatedEntriesProps) {
  const [relatedEntries, setRelatedEntries] = useState<typeof mockEntries>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sourceEntry, setSourceEntry] = useState<(typeof mockEntries)[0] | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    setIsLoading(true)

    // Find source entry if entryId is provided
    if (entryId) {
      const entry = mockEntries.find((e) => e.id === entryId) || null
      setSourceEntry(entry)

      if (entry) {
        // Find related entries based on tags and topics
        const related = mockEntries
          .filter((e) => e.id !== entryId)
          .map((e) => {
            // Calculate similarity score
            let score = 0

            // Tag overlap
            const tagOverlap = e.tags.filter((tag) => entry.tags.includes(tag)).length
            score += tagOverlap * 2

            // Topic overlap
            const topicOverlap = e.topics.filter((topic) => entry.topics.includes(topic)).length
            score += topicOverlap * 3

            // Content similarity (simplified)
            if (e.content.toLowerCase().includes(entry.title.toLowerCase())) {
              score += 2
            }

            return { entry: e, score }
          })
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map((item) => item.entry)

        setRelatedEntries(related)
      }
    } else if (searchQuery) {
      // Find related entries based on search query
      const results = mockEntries
        .filter(
          (entry) =>
            entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
        )
        .slice(0, 5)

      setRelatedEntries(results)
    }

    setIsLoading(false)
  }, [entryId, searchQuery])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (relatedEntries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">
            {sourceEntry ? t("search.noRelatedEntries") : t("search.noEntriesFound")}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sourceEntry && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">{t("search.relatedTo")}</h3>
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{sourceEntry.title}</h4>
              <span className="text-sm text-muted-foreground">{new Date(sourceEntry.date).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              {sourceEntry.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1 text-xs">
                  <Tag className="h-3 w-3" /> {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {relatedEntries.map((entry) => (
          <Link key={entry.id} href={`/entries/${entry.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{entry.title}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {entry.content.replace(/<[^>]*>/g, "")}
                </p>
                <div className="flex gap-2 flex-wrap mt-2">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1 text-xs">
                      <Tag className="h-3 w-3" /> {tag}
                    </Badge>
                  ))}
                </div>

                {sourceEntry && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    <span className="font-medium">{t("search.commonTopics")}: </span>
                    {entry.topics.filter((topic) => sourceEntry.topics.includes(topic)).join(", ")}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

