"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Table,
  Image,
  LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smile,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ImageUploader } from "@/components/image-uploader"
import { TableCreator } from "@/components/table-creator"
import { LinkCreator } from "@/components/link-creator"
import { EmojiPicker } from "@/components/emoji-picker"


interface AdvancedEditorProps {
  value: string
  onChange: (value: string) => void
}

export function AdvancedEditor({ value, onChange }: AdvancedEditorProps) {
  const [text, setText] = useState(value)
  const [mode, setMode] = useState<"write" | "preview">("write")
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onChange(text)
  }, [text, onChange])

  const handleCommand = (command: string, value?: string) => {
    // This is a simplified implementation
    // In a real app, this would use a proper rich text editor library
    let newText = text

    switch (command) {
      case "bold":
        newText += "**Bold text**"
        break
      case "italic":
        newText += "*Italic text*"
        break
      case "underline":
        newText += "__Underlined text__"
        break
      case "h1":
        newText += "\n# Heading 1\n"
        break
      case "h2":
        newText += "\n## Heading 2\n"
        break
      case "ul":
        newText += "\n- List item\n- Another item\n"
        break
      case "ol":
        newText += "\n1. First item\n2. Second item\n"
        break
      case "quote":
        newText += "\n> Quoted text\n"
        break
      case "emoji":
        newText += value || ""
        break
      case "link":
        newText += value || "[Link text](https://example.com)"
        break
      case "image":
        newText += value || "![Image description](https://example.com/image.jpg)"
        break
      case "table":
        newText += value || "\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n"
        break
      default:
        break
    }

    setText(newText)
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
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
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => handleCommand("h1")} className="h-8 w-8 p-0">
          <Heading1 className="h-4 w-4" />
          <span className="sr-only">Heading 1</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => handleCommand("h2")} className="h-8 w-8 p-0">
          <Heading2 className="h-4 w-4" />
          <span className="sr-only">Heading 2</span>
        </Button>
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
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
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Table className="h-4 w-4" />
              <span className="sr-only">Insert Table</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <TableCreator onInsert={(tableMarkdown) => handleCommand("table", tableMarkdown)} />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <LinkIcon className="h-4 w-4" />
              <span className="sr-only">Insert Link</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <LinkCreator onInsert={(linkMarkdown) => handleCommand("link", linkMarkdown)} />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Image className="h-4 w-4" />
              <span className="sr-only">Insert Image</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <ImageUploader onInsert={(imageMarkdown) => handleCommand("image", imageMarkdown)} />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Smile className="h-4 w-4" />
              <span className="sr-only">Insert Emoji</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <EmojiPicker onEmojiSelect={(emoji) => handleCommand("emoji", emoji)} />
          </PopoverContent>
        </Popover>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />

        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignLeft className="h-4 w-4" />
          <span className="sr-only">Align Left</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignCenter className="h-4 w-4" />
          <span className="sr-only">Align Center</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignRight className="h-4 w-4" />
          <span className="sr-only">Align Right</span>
        </Button>

        <div className="ml-auto flex items-center gap-1">
          <Tabs defaultValue="write" onValueChange={(value) => setMode(value as "write" | "preview")}>
            <TabsList className="h-8">
              <TabsTrigger value="write" className="text-xs px-2 py-1">
                Write
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-xs px-2 py-1">
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {mode === "write" ? (
        <div
          ref={editorRef}
          className="min-h-[400px] p-4 focus:outline-none"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setText(e.currentTarget.textContent || "")}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ) : (
        <div className="min-h-[400px] p-4 prose dark:prose-invert max-w-none">
          {/* In a real app, this would render Markdown as HTML */}
          <div className="whitespace-pre-wrap">{text}</div>
        </div>
      )}
    </div>
  )
}

