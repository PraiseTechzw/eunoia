"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered, Quote } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [text, setText] = useState(value)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    onChange(text)
  }, [text, onChange])

  const handleCommand = (command: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    let newText = textarea.value
    let newCursorPos = end

    switch (command) {
      case "bold":
        newText = textarea.value.substring(0, start) + `**${selectedText}**` + textarea.value.substring(end)
        newCursorPos = end + 4
        break
      case "italic":
        newText = textarea.value.substring(0, start) + `*${selectedText}*` + textarea.value.substring(end)
        newCursorPos = end + 2
        break
      case "underline":
        newText = textarea.value.substring(0, start) + `__${selectedText}__` + textarea.value.substring(end)
        newCursorPos = end + 4
        break
      case "h1":
        newText = textarea.value.substring(0, start) + `# ${selectedText}` + textarea.value.substring(end)
        newCursorPos = end + 2
        break
      case "h2":
        newText = textarea.value.substring(0, start) + `## ${selectedText}` + textarea.value.substring(end)
        newCursorPos = end + 3
        break
      case "ul":
        newText = textarea.value.substring(0, start) + `- ${selectedText}` + textarea.value.substring(end)
        newCursorPos = end + 2
        break
      case "ol":
        newText = textarea.value.substring(0, start) + `1. ${selectedText}` + textarea.value.substring(end)
        newCursorPos = end + 3
        break
      case "quote":
        newText = textarea.value.substring(0, start) + `> ${selectedText}` + textarea.value.substring(end)
        newCursorPos = end + 2
        break
      default:
        break
    }

    setText(newText)

    // Set cursor position after state update
    setTimeout(() => {
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <Button type="button" variant="ghost" size="sm" onClick={() => handleCommand("bold")} className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleCommand("italic")} className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleCommand("underline")}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
          <span className="sr-only">Underline</span>
        </Button>
        <div className="w-px h-8 bg-gray-300 mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => handleCommand("h1")} className="h-8 w-8 p-0">
          <Heading1 className="h-4 w-4" />
          <span className="sr-only">Heading 1</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleCommand("h2")} className="h-8 w-8 p-0">
          <Heading2 className="h-4 w-4" />
          <span className="sr-only">Heading 2</span>
        </Button>
        <div className="w-px h-8 bg-gray-300 mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => handleCommand("ul")} className="h-8 w-8 p-0">
          <List className="h-4 w-4" />
          <span className="sr-only">Bullet List</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleCommand("ol")} className="h-8 w-8 p-0">
          <ListOrdered className="h-4 w-4" />
          <span className="sr-only">Numbered List</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleCommand("quote")} className="h-8 w-8 p-0">
          <Quote className="h-4 w-4" />
          <span className="sr-only">Quote</span>
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your thoughts here..."
        className="min-h-[300px] border-0 focus-visible:ring-0 resize-none"
      />
    </div>
  )
}

