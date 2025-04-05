"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, Tag, FileText, Filter, SlidersHorizontal, Sparkles } from "lucide-react"
import { mockEntries } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import { SearchResults } from "./search-results"
import { SearchFilters } from "./search-filters"
import { SentimentTimeline } from "./sentiment-timeline"
import { WordCloud } from "./word-cloud"
import { TopicModeling } from "./topic-modeling"
import { RelatedEntries } from "./related-entries"

interface AdvancedSearchProps {
  initialQuery?: string
  initialEntryId?: string
}

export function AdvancedSearch({ initialQuery = "", initialEntryId }: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState<typeof mockEntries>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState<"results" | "insights" | "related">("results")
  const [showFilters, setShowFilters] = useState(false)
  const { t } = useTranslation()

  // Perform search when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const performSearch = () => {
      setIsSearching(true)

      // Simulate search delay
      setTimeout(() => {
        // Simple search implementation
        const results = mockEntries.filter(
          (entry) =>
            entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
        )

        setSearchResults(results)
        setIsSearching(false)
      }, 500)
    }

    performSearch()
  }, [searchQuery])

  // If initialEntryId is provided, show related entries
  useEffect(() => {
    if (initialEntryId) {
      setActiveTab("related")
    }
  }, [initialEntryId])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search.placeholder")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
            <span className="sr-only">{t("search.filters")}</span>
          </Button>

          <Button variant="outline" size="icon" className="h-10 w-10">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">{t("search.sort")}</span>
          </Button>

          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            {t("search.aiSearch")}
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("search.advancedFilters")}</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchFilters />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="results">
            <FileText className="h-4 w-4 mr-1" />
            {t("search.results")}
            {searchResults.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {searchResults.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Sparkles className="h-4 w-4 mr-1" />
            {t("search.insights")}
          </TabsTrigger>
          <TabsTrigger value="related">
            <Tag className="h-4 w-4 mr-1" />
            {t("search.related")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="mt-4">
          <SearchResults results={searchResults} isSearching={isSearching} searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="insights" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("search.sentimentTimeline")}</CardTitle>
              </CardHeader>
              <CardContent>
                <SentimentTimeline entries={searchResults.length > 0 ? searchResults : mockEntries} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("search.wordCloud")}</CardTitle>
              </CardHeader>
              <CardContent>
                <WordCloud entries={searchResults.length > 0 ? searchResults : mockEntries} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t("search.topicModeling")}</CardTitle>
              </CardHeader>
              <CardContent>
                <TopicModeling entries={searchResults.length > 0 ? searchResults : mockEntries} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="related" className="mt-4">
          <RelatedEntries entryId={initialEntryId} searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

