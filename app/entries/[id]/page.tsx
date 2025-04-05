"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, TagIcon, Trash } from "lucide-react"
import Link from "next/link"
import { mockEntries } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function EntryPage({ params }: { params: { id: string } }) {
  const [entry, setEntry] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, this would fetch from an API
    const foundEntry = mockEntries.find((e) => e.id === params.id)
    setEntry(foundEntry)
    setIsLoading(false)
  }, [params.id])

  const handleDelete = () => {
    // In a real app, this would delete from a database
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been deleted.",
    })
    router.push("/entries")
  }

  if (isLoading) {
    return (
      <div className="container py-6 max-w-4xl">
        <Card>
          <CardContent className="p-8">
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="container py-6 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Entry Not Found</h2>
            <p className="mb-6">The journal entry you're looking for doesn't exist.</p>
            <Link href="/entries">
              <Button>Back to Entries</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{entry.title}</CardTitle>
            <span className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {entry.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="flex items-center gap-1">
                <TagIcon className="h-3 w-3" /> {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: entry.content }} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash className="h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your journal entry.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Link href={`/entries/${entry.id}/edit`}>
            <Button className="gap-2">
              <Edit className="h-4 w-4" /> Edit
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

