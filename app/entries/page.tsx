"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenLine, Search, TagIcon, Filter, SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockEntries } from "@/lib/mock-data"
import { DrawerTrigger, DrawerContent } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"
import { Drawer } from "vaul"
import { DateRangePicker } from "@/components/date-range-picker"


export default function EntriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")
  const [viewMode, setViewMode] = useState<"cards" | "table" | "visual">("cards")
  const [showFilters, setShowFilters] = useState(false)

  // Get unique tags from all entries
  const allTags = Array.from(new Set(mockEntries.flatMap((entry) => entry.tags)))

  // Filter entries based on search query and selected tag
  const filteredEntries = mockEntries.filter((entry) => {
    const matchesSearch =
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = selectedTag === "all" || entry.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Journal Entries</h2>
          <p className="text-muted-foreground">Browse, search, and analyze your journal entries.</p>
        </div>
        <Link href="/entries/new">
          <Button className="gap-2">
            <PenLine className="h-4 w-4" /> New Entry
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Newest First</DropdownMenuItem>
              <DropdownMenuItem>Oldest First</DropdownMenuItem>
              <DropdownMenuItem>Alphabetical (A-Z)</DropdownMenuItem>
              <DropdownMenuItem>Alphabetical (Z-A)</DropdownMenuItem>
              <DropdownMenuItem>Most Tags</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="cards" onValueChange={(value) => setViewMode(value as any)}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="visual">Visualize</TabsTrigger>
          </TabsList>

          <DateRangePicker />
        </div>

        <TabsContent value="cards" className="mt-6">
          <div className="grid gap-6">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <Link key={entry.id} href={`/entries/${entry.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{entry.title}</CardTitle>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="flex items-center gap-1">
                            <TagIcon className="h-3 w-3" /> {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-muted-foreground">{entry.content.replace(/<[^>]*>/g, "")}</p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {entry.sentiment}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground mb-4">No entries found matching your search.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedTag("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <DataTable entries={filteredEntries} />
        </TabsContent>

        <TabsContent value="visual" className="mt-6">
          <EntriesVisualizer entries={filteredEntries} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

