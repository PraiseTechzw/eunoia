"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, Calendar, Tag, FileText, X } from "lucide-react"
import { mockEntries } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function Search() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEntries =
    searchQuery.length > 0
      ? mockEntries.filter(
          (entry) =>
            entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      : []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-9 px-0 md:w-60 md:px-3 md:justify-start">
          <SearchIcon className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline-flex">Search journal...</span>
          <kbd className="hidden md:inline-flex ml-auto pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-2 border rounded-md px-3 py-2">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <Input
              className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Search by keywords, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setSearchQuery("")}>
                <X className="h-3 w-3" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {searchQuery.length > 0 ? (
            filteredEntries.length > 0 ? (
              <div className="space-y-4 py-2">
                {filteredEntries.map((entry) => (
                  <Link key={entry.id} href={`/entries/${entry.id}`} onClick={() => setOpen(false)}>
                    <div className="flex flex-col space-y-1 border-b pb-3 last:border-0 hover:bg-muted/50 p-2 rounded-md transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-medium">{entry.title}</h3>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 pl-6">
                        {entry.content.replace(/<[^>]*>/g, "")}
                      </p>
                      <div className="flex gap-2 flex-wrap pl-6">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="flex items-center gap-1 text-xs">
                            <Tag className="h-3 w-3" /> {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-muted-foreground">No entries found matching your search.</p>
              </div>
            )
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">Start typing to search your journal entries.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

