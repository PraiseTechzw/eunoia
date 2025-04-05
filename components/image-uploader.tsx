"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

interface ImageUploaderProps {
  onInsert: (markdown: string) => void
}

export function ImageUploader({ onInsert }: ImageUploaderProps) {
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")

  const handleInsert = () => {
    if (url) {
      const markdown = `![${description || "Image"}](${url})`
      onInsert(markdown)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">Image URL</Label>
        <Input
          id="url"
          placeholder="https://example.com/image.jpg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          placeholder="Image description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Button onClick={handleInsert} className="w-full gap-2">
        <Upload className="h-4 w-4" />
        Insert Image
      </Button>
    </div>
  )
} 