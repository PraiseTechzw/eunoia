"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  SearchIcon,
  Tag,
  FileText,
  Filter,
  SlidersHorizontal,
  Sparkles,
  Calendar,
  Clock,
  ArrowUpDown,
} from "lucide-react"
import { useSimulation } from "@/hooks/use-simulation"
import { DateRangePicker } from "@/components/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { FilterPanel } from "@/components/filter-panel"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("basic")
  const [sortBy, setSortBy] = useState("date")
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const router = useRouter()
  const { toast } = useToast()

  // Simulate search
  const {
    execute: performSearch,
    isLoading,
    data: searchResults,
    error,
  } = useSimulation<any, [any]>("entries", "getEntries", false)

  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const filters = {
        search: searchQuery,
        sortBy,
        dateRange,
      }
      performSearch(filters)
    }
  }, [searchQuery, sortBy, dateRange, performSearch])

  // Handle AI search
  const handleAISearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter a search query",
        description: "Please enter what you're looking for to use AI search.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "AI Search activated",
      description: "Analyzing your journal entries with advanced AI...",
    })

    // Simulate AI processing
    setTimeout(() => {
      performSearch({
        search: searchQuery,
        sortBy,
        dateRange,
        useAI: true,
      })

      toast({
        title: "AI Analysis complete",
        description: "Found semantic matches based on context and meaning.",
      })
    }, 2000)
  }

  // Handle entry click
  const handleEntryClick = (entryId: string) => {
    router.push(`/entries/${entryId}`)
  }

  return (
    <div className="container py-6 max-w-5xl">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Search & Analysis</h1>
        <p className="text-muted-foreground">Search your journal entries, analyze patterns, and discover insights</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic" className="flex items-center gap-1">
            <SearchIcon className="h-4 w-4" />
            Basic Search
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            Advanced Search
          </TabsTrigger>
          <TabsTrigger value="semantic" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Semantic Search
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries by content, title, or tags..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4 max-w-md mx-auto">
                  <h3 className="text-lg font-medium mb-4">Filter Entries</h3>
                  <FilterPanel />
                </div>
              </DrawerContent>
            </Drawer>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                <SelectItem value="sentiment">Sentiment</SelectItem>
              </SelectContent>
            </Select>

            <DateRangePicker date={dateRange} onDateChange={setDateRange} />

            {activeTab === "semantic" && (
              <Button onClick={handleAISearch} className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Search
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="basic" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium">Searching...</p>
              </div>
            </div>
          ) : searchResults?.entries?.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Found {searchResults.entries.length} entries</p>
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Sort
                </Button>
              </div>

              {searchResults.entries.map((entry: any) => (
                <Card
                  key={entry.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleEntryClick(entry.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{entry.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(entry.date).toLocaleDateString()}
                        <Clock className="h-3.5 w-3.5 ml-2" />
                        {new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {entry.content.replace(/<[^>]*>/g, "")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : searchQuery.length > 2 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <SearchIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No results found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  We couldn't find any entries matching "{searchQuery}". Try adjusting your search terms or filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setDateRange({})
                  }}
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <SearchIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">Search your journal</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Enter at least 3 characters to search through your entries by title, content, or tags.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Date Range</label>
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Sentiment</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any sentiment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tags</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tags" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="relationships">Relationships</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Contains Words</label>
                    <Input placeholder="Words that must be included" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Excludes Words</label>
                    <Input placeholder="Words that must not be included" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <SearchIcon className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground py-4">
            Use advanced search to find specific entries with precise criteria
          </div>
        </TabsContent>

        <TabsContent value="semantic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Semantic Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Semantic search uses AI to understand the meaning behind your search, not just matching keywords. Try
                  searching for concepts, emotions, or themes.
                </p>

                <div className="bg-muted/50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Example searches:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSearchQuery("times I felt overwhelmed")}>
                        Try this
                      </Button>
                      <span>"times I felt overwhelmed"</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery("positive experiences with friends")}
                      >
                        Try this
                      </Button>
                      <span>"positive experiences with friends"</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSearchQuery("insights about my career")}>
                        Try this
                      </Button>
                      <span>"insights about my career"</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={handleAISearch}
                    disabled={!searchQuery.trim() || isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Search with AI
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

