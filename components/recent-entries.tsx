import Link from "next/link"
import { mockEntries } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Tag, Calendar } from "lucide-react"

export function RecentEntries() {
  // Get the 5 most recent entries
  const recentEntries = [...mockEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {recentEntries.length > 0 ? (
        recentEntries.map((entry) => (
          <Link key={entry.id} href={`/entries/${entry.id}`}>
            <div className="flex flex-col space-y-1 border-b pb-4 last:border-0 hover:bg-muted/50 p-2 rounded-md transition-colors">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{entry.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(entry.date).toLocaleDateString()}
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{entry.content.replace(/<[^>]*>/g, "")}</p>
              <div className="flex items-center justify-between mt-1">
                <div className="flex gap-2 flex-wrap">
                  {entry.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1 text-xs">
                      <Tag className="h-3 w-3" /> {tag}
                    </Badge>
                  ))}
                  {entry.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{entry.tags.length - 2} more
                    </Badge>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {entry.sentiment}
                </Badge>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No entries yet. Start journaling!</p>
        </div>
      )}
    </div>
  )
}

