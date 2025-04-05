"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AdvancedEditor } from "@/components/advanced-editor"
import { TagInput } from "@/components/tag-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { AIAssistant } from "@/components/ai-assistant"
import { EntryTemplates } from "@/components/entry-templates"

export default function NewEntryPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("write")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, this would save to a database
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully.",
      })
      router.push("/entries")
    }, 1000)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>New Journal Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your entry a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <TagInput tags={tags} setTags={setTags} />
              <p className="text-sm text-muted-foreground">Press enter to add a tag</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="ai-assist">AI Assistant</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="pt-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Journal Entry</Label>
                  <AdvancedEditor value={content} onChange={setContent} />
                </div>
              </TabsContent>
              <TabsContent value="templates" className="pt-4">
                <EntryTemplates
                  onSelect={(template) => {
                    setContent(template.content)
                    setActiveTab("write")
                  }}
                />
              </TabsContent>
              <TabsContent value="ai-assist" className="pt-4">
                <AIAssistant
                  onSuggestionApply={(suggestion) => {
                    setContent(content + suggestion)
                    setActiveTab("write")
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Entry"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

