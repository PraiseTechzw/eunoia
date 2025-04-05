"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TagIcon } from "lucide-react"
import { mockEntries } from "@/lib/mock-data"

interface EntriesVisualizerProps {
  entries: typeof mockEntries
}

export function EntriesVisualizer({ entries }: EntriesVisualizerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map((entry) => (
        <Link key={entry.id} href={`/entries/${entry.id}`}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="line-clamp-2">{entry.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{new Date(entry.date).toLocaleDateString()}</span>
                <Badge variant="secondary">{entry.sentiment}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {entry.content}
              </p>
              <div className="flex gap-1 flex-wrap">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    <TagIcon className="h-3 w-3" /> {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
} 