"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { EnhancedEditor } from "@/components/enhanced-editor"
import { TagInput } from "@/components/tag-input"
import { useToast } from "@/hooks/use-toast"
import { useSimulation } from "@/hooks/use-simulation"
import { Save, X, ArrowLeft } from "lucide-react"

export default function NewEntryPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Simulate saving entry
  const {
    execute: saveEntry,
    isLoading: isSaving,
    isSuccess,
  } = useSimulation<any, [any]>("entries", "createEntry", false)

  // Handle content change
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setHasChanges(true)
  }

  // Handle save
  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your journal entry.",
        variant: "destructive",
      })
      return
    }

    // Prepare entry data
    const entryData = {
      title,
      content,
      tags,
      date: new Date().toISOString(),
    }

    try {
      // Save entry
      await saveEntry(entryData)

      // Show success toast
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully.",
      })

      // Navigate back to entries list
      router.push("/entries")
    } catch (error) {
      // Error is handled by useSimulation
    }
  }

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges) {
      // In a real app, show a confirmation dialog
      if (confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        router.back()
      }
    } else {
      router.back()
    }
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">New Journal Entry</h1>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setHasChanges(true)
            }}
            placeholder="Entry title"
            className="text-xl font-medium border-none px-0 focus-visible:ring-0"
          />
        </CardHeader>
        <CardContent>
          <EnhancedEditor
            value={content}
            onChange={handleContentChange}
            autoFocus
            minHeight="400px"
            onSave={handleSave}
          />

          <div className="mt-6">
            <TagInput
              tags={tags}
              setTags={(newTags: string[]) => {
                setTags(newTags)
                setHasChanges(true)
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Entry
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

