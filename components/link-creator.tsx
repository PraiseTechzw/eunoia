"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LinkIcon } from "lucide-react"

interface LinkCreatorProps {
  onInsert: (markdown: string) => void
}

export function LinkCreator({ onInsert }: LinkCreatorProps) {
  const [text, setText] = useState("")
  const [url, setUrl] = useState("")

  const handleInsert = () => {
    if (url) {
      const markdown = `[${text || url}](${url})`
      onInsert(markdown)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Link Text</Label>
        <Input
          id="text"
          placeholder="Link text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <Button onClick={handleInsert} className="w-full gap-2">
        <LinkIcon className="h-4 w-4" />
        Insert Link
      </Button>
    </div>
  )
} 