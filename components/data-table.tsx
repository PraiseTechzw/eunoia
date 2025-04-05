"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TagIcon } from "lucide-react"
import { mockEntries } from "@/lib/mock-data"

interface DataTableProps {
  entries: typeof mockEntries
}

export function DataTable({ entries }: DataTableProps) {
  const [sortBy, setSortBy] = useState<"date" | "title" | "sentiment">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    }
    return sortOrder === "asc"
      ? a.sentiment.localeCompare(b.sentiment)
      : b.sentiment.localeCompare(a.sentiment)
  })

  const toggleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  return (
    <div className="border rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("date")}
                  className="font-medium"
                >
                  Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("title")}
                  className="font-medium"
                >
                  Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("sentiment")}
                  className="font-medium"
                >
                  Sentiment {sortBy === "sentiment" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
              </th>
              <th className="text-left p-4">Tags</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry) => (
              <tr key={entry.id} className="border-b hover:bg-muted/50">
                <td className="p-4">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Link href={`/entries/${entry.id}`} className="hover:underline">
                    {entry.title}
                  </Link>
                </td>
                <td className="p-4">
                  <Badge variant="secondary">{entry.sentiment}</Badge>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 flex-wrap">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        <TagIcon className="h-3 w-3" /> {tag}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/entries/${entry.id}`}>View</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 