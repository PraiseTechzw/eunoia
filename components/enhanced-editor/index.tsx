"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Toolbar } from "./toolbar"
import { CodeBlock } from "./code-block"
import { TableEditor } from "./table-editor"
import { MediaEmbed } from "./media-embed"
import { SpellChecker } from "./spell-checker"
import { AIAssistant } from "./ai-assistant"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"
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
} from "@/components/ui/alert-dialog"
import { Save } from "lucide-react"

interface EnhancedEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  minHeight?: string
  distractionFree?: boolean
  onSave?: () => void
}

export function EnhancedEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  autoFocus = false,
  minHeight = "300px",
  distractionFree = false,
  onSave,
}: EnhancedEditorProps) {
  const [mode, setMode] = useState<"write" | "preview">("write")
  const [showToolbar, setShowToolbar] = useState(!distractionFree)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSpellCheck, setShowSpellCheck] = useState(false)
  const [activeElement, setActiveElement] = useState<"text" | "code" | "table" | "media" | "ai">("text")
  const [localValue, setLocalValue] = useState(value)
  const [hasChanges, setHasChanges] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [readTime, setReadTime] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [showExitPrompt, setShowExitPrompt] = useState(false)

  const editorRef = useRef<HTMLDivElement>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { t } = useTranslation()
  const { toast } = useToast()

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Calculate word count, character count, and read time
  useEffect(() => {
    const text = localValue.replace(/<[^>]*>/g, "")
    const words = text.trim().split(/\s+/).filter(Boolean)
    const wordCount = words.length
    const charCount = text.length
    const readTime = Math.max(1, Math.ceil(wordCount / 200)) // Assuming 200 words per minute

    setWordCount(wordCount)
    setCharCount(charCount)
    setReadTime(readTime)

    // Check if content has changed
    setHasChanges(localValue !== value)
  }, [localValue, value])

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && hasChanges) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }

      autoSaveTimerRef.current = setTimeout(() => {
        handleSave()
      }, 30000) // Auto-save after 30 seconds of inactivity
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [localValue, hasChanges, autoSaveEnabled])

  // Handle fullscreen mode
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false)
        } else if (activeElement !== "text") {
          setActiveElement("text")
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle distraction-free mode with Ctrl+Shift+F
      if (e.ctrlKey && e.shiftKey && e.key === "F") {
        e.preventDefault()
        setShowToolbar(!showToolbar)
      }

      // Save with Ctrl+S
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        handleSave()
      }

      // Toggle fullscreen with F11
      if (e.key === "F11") {
        e.preventDefault()
        setIsFullscreen(!isFullscreen)
      }
    }

    window.addEventListener("keydown", handleEsc)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleEsc)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isFullscreen, showToolbar, activeElement])

  // Focus editor on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus()
    }
  }, [autoFocus])

  // Prompt before exit if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ""
        return ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasChanges])

  // Handle saving content
  const handleSave = useCallback(() => {
    onChange(localValue)
    setHasChanges(false)
    setLastSaved(new Date())

    if (onSave) {
      onSave()
    }

    toast({
      title: t("editor.saved"),
      description: t("editor.savedDescription"),
      duration: 2000,
    })
  }, [localValue, onChange, onSave, toast, t])

  // Handle command from toolbar
  const handleCommand = (command: string, value?: string) => {
    // This is a simplified implementation
    // In a real app, this would use a proper rich text editor library
    const newText = localValue

    switch (command) {
      case "bold":
        insertAtCursor("**", "**", "Bold text")
        break
      case "italic":
        insertAtCursor("*", "*", "Italic text")
        break
      case "underline":
        insertAtCursor("__", "__", "Underlined text")
        break
      case "h1":
        insertAtCursor("# ", "", "Heading 1")
        break
      case "h2":
        insertAtCursor("## ", "", "Heading 2")
        break
      case "ul":
        insertAtCursor("- ", "", "List item")
        break
      case "ol":
        insertAtCursor("1. ", "", "List item")
        break
      case "quote":
        insertAtCursor("> ", "", "Quoted text")
        break
      case "code":
        setActiveElement("code")
        break
      case "table":
        setActiveElement("table")
        break
      case "media":
        setActiveElement("media")
        break
      case "ai-assist":
        setActiveElement("ai")
        break
      case "spellcheck":
        setShowSpellCheck(!showSpellCheck)
        break
      case "fullscreen":
        setIsFullscreen(!isFullscreen)
        break
      case "distraction-free":
        setShowToolbar(!showToolbar)
        break
      case "save":
        handleSave()
        break
      case "insert":
        if (value) {
          setLocalValue((prev) => prev + value)
        }
        break
      default:
        // For direct text insertion
        if (value) {
          setLocalValue(value)
        }
        break
    }
  }

  // Insert text at cursor position
  const insertAtCursor = (prefix: string, suffix: string, placeholder: string) => {
    if (!editorRef.current) return

    const selection = window.getSelection()
    if (!selection || !selection.rangeCount) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString() || placeholder

    // Create a new text node with the formatted text
    const formattedText = `${prefix}${selectedText}${suffix}`

    // Get cursor position
    const startOffset = range.startOffset
    const startContainer = range.startContainer

    // Insert the formatted text
    range.deleteContents()
    range.insertNode(document.createTextNode(formattedText))

    // Update the editor content
    if (editorRef.current.textContent !== null) {
      setLocalValue(editorRef.current.textContent)
    }

    // Set cursor position after the inserted text
    const newRange = document.createRange()
    newRange.setStart(startContainer, startOffset + formattedText.length)
    newRange.setEnd(startContainer, startOffset + formattedText.length)
    selection.removeAllRanges()
    selection.addRange(newRange)
  }

  // Handle content changes from contentEditable
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || ""
    setLocalValue(content)
  }

  // Handle exit with unsaved changes
  const handleExit = () => {
    if (hasChanges) {
      setShowExitPrompt(true)
    } else {
      setIsFullscreen(false)
    }
  }

  // Confirm exit without saving
  const confirmExit = () => {
    setShowExitPrompt(false)
    setIsFullscreen(false)
  }

  // Save and exit
  const saveAndExit = () => {
    handleSave()
    setShowExitPrompt(false)
    setIsFullscreen(false)
  }

  return (
    <div
      className={cn(
        "border rounded-md flex flex-col transition-all",
        isFullscreen && "fixed inset-0 z-50 bg-background",
        distractionFree && "border-transparent",
      )}
      style={{ minHeight }}
    >
      {showToolbar && (
        <Toolbar
          onCommand={handleCommand}
          isFullscreen={isFullscreen}
          showSpellCheck={showSpellCheck}
          setShowSpellCheck={setShowSpellCheck}
          distractionFree={distractionFree}
          setMode={setMode}
          mode={mode}
          hasChanges={hasChanges}
          onSave={handleSave}
        />
      )}

      <div className="flex-1 flex flex-col">
        {activeElement === "text" && (
          <div className="flex-1 flex flex-col">
            {mode === "write" ? (
              <div
                ref={editorRef}
                className={cn("flex-1 p-4 focus:outline-none overflow-auto", distractionFree && "max-w-3xl mx-auto")}
                contentEditable
                suppressContentEditableWarning
                onInput={handleContentChange}
                dangerouslySetInnerHTML={{ __html: localValue || placeholder }}
                style={{ minHeight: showToolbar ? "calc(300px - 40px)" : "300px" }}
              />
            ) : (
              <div
                className={cn(
                  "flex-1 p-4 prose dark:prose-invert max-w-none overflow-auto",
                  distractionFree && "max-w-3xl mx-auto",
                )}
                style={{ minHeight: showToolbar ? "calc(300px - 40px)" : "300px" }}
              >
                {/* In a real app, this would render Markdown as HTML */}
                <div className="whitespace-pre-wrap">{localValue || t("editor.noContent")}</div>
              </div>
            )}

            {/* Editor stats footer */}
            <div className="border-t p-2 flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex gap-3">
                <span>
                  {wordCount} {t("editor.words")}
                </span>
                <span>
                  {charCount} {t("editor.characters")}
                </span>
                <span>
                  {readTime} {t("editor.minuteRead")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {lastSaved && (
                  <span>
                    {t("editor.lastSaved")}: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="autoSave"
                    checked={autoSaveEnabled}
                    onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                    className="h-3 w-3"
                  />
                  <label htmlFor="autoSave">{t("editor.autoSave")}</label>
                </div>
                {hasChanges && (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleSave}>
                    <Save className="h-3 w-3 mr-1" />
                    {t("editor.save")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeElement === "code" && (
          <CodeBlock value={localValue} onChange={setLocalValue} onBack={() => setActiveElement("text")} />
        )}

        {activeElement === "table" && (
          <TableEditor
            onInsert={(tableContent) => {
              setLocalValue((prev) => prev + tableContent)
              setActiveElement("text")
            }}
            onCancel={() => setActiveElement("text")}
          />
        )}

        {activeElement === "media" && (
          <MediaEmbed
            onInsert={(mediaContent) => {
              setLocalValue((prev) => prev + mediaContent)
              setActiveElement("text")
            }}
            onCancel={() => setActiveElement("text")}
          />
        )}

        {activeElement === "ai" && (
          <AIAssistant
            currentText={localValue}
            onInsert={(aiContent) => {
              setLocalValue((prev) => prev + aiContent)
              setActiveElement("text")
            }}
            onCancel={() => setActiveElement("text")}
          />
        )}
      </div>

      {showSpellCheck && <SpellChecker text={localValue} onCorrect={(correctedText) => setLocalValue(correctedText)} />}

      {!showToolbar && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-20 hover:opacity-100 transition-opacity"
          onClick={() => setShowToolbar(true)}
        >
          {t("editor.showToolbar")}
        </Button>
      )}

      {/* Exit confirmation dialog */}
      <AlertDialog open={showExitPrompt} onOpenChange={setShowExitPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("editor.unsavedChanges")}</AlertDialogTitle>
            <AlertDialogDescription>{t("editor.unsavedChangesDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("editor.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="bg-destructive text-destructive-foreground">
              {t("editor.exitWithoutSaving")}
            </AlertDialogAction>
            <AlertDialogAction onClick={saveAndExit}>{t("editor.saveAndExit")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

