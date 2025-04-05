"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { mockEntries } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import { Calendar } from "lucide-react"
import Link from "next/link"

interface SearchResultsProps {
  results: typeof mockEntries
  isSearching: boolean
  searchQuery: string
}

export function SearchResults({ results, isSearching, searchQuery }: SearchResultsProps) {
  const { t } = useTranslation()

  if (isSearching) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (searchQuery.trim() === "") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground">{t("search.enterQuery")}</p>
        </CardContent>
      </Card>
    )
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">{t("search.noResults", { query: searchQuery })}</p>
        </CardContent>
      </Card>
    )
  }

  // Highlight matching text in search results
  const highlightMatches = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.trim()})`, "gi")
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900">$1</mark>')
  }

  return (
    <div className="grid gap-4">
      {results.map((entry) => (
        <Link key={entry.id} href={`/entries/${entry.id}`}>
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <h4
                  className="font-medium"
                  dangerouslySetInnerHTML={{
                    __html: highlightMatches(entry.title, searchQuery),
                  }}
                />
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(entry.date).toLocaleDateString()}
                </div>
              </div>
              <p
                className="text-sm text-muted-foreground line-clamp-2 mt-1"
                dangerouslySetInnerHTML={{
                  __html: highlightMatches(entry.content.replace(/<[^>]*>/g, ""), searchQuery),
                }}
              />
              <div className="flex gap-2 flex-wrap mt-2">
                {entry.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="flex items-center gap-1 text-xs"
                    dangerouslySetInnerHTML={{
                      __html: `<span class="h-3 w-3 mr-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg></span> ${highlightMatches(tag, searchQuery)}`,
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

