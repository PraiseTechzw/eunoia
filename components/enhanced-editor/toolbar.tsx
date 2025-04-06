"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/hooks/use-translation"
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Table,
  Image,
  Sparkles,
  Maximize,
  Minimize,
  Eye,
  Edit,
  Save,
  SpellCheck,
  X,
} from "lucide-react"

interface ToolbarProps {
  onCommand: (command: string, value?: string) => void
  isFullscreen: boolean
  showSpellCheck: boolean
  setShowSpellCheck: (show: boolean) => void
  distractionFree: boolean
  setMode: (mode: "write" | "preview") => void
  mode: "write" | "preview"
  hasChanges?: boolean
  onSave?: () => void
}

export function Toolbar({
  onCommand,
  isFullscreen,
  showSpellCheck,
  setShowSpellCheck,
  distractionFree,
  setMode,
  mode,
  hasChanges,
  onSave,
}: ToolbarProps) {
  const { t } = useTranslation()

  return (
    <div className="border-b p-1 flex items-center justify-between flex-wrap gap-1">
      <div className="flex items-center flex-wrap gap-1">
        <Tabs value={mode} onValueChange={(value) => setMode(value as "write" | "preview")}>
          <TabsList className="h-8">
            <TabsTrigger value="write" className="h-8 px-2 text-xs gap-1">
              <Edit className="h-3.5 w-3.5" />
              {t("editor.write")}
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-8 px-2 text-xs gap-1">
              <Eye className="h-3.5 w-3.5" />
              {t("editor.preview")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="h-8 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("bold")}
          title={t("editor.bold")}
        >
          <Bold className="h-4 w-4" />
          <span className="sr-only">{t("editor.bold")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("italic")}
          title={t("editor.italic")}
        >
          <Italic className="h-4 w-4" />
          <span className="sr-only">{t("editor.italic")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("underline")}
          title={t("editor.underline")}
        >
          <Underline className="h-4 w-4" />
          <span className="sr-only">{t("editor.underline")}</span>
        </Button>

        <div className="h-8 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("h1")}
          title={t("editor.heading1")}
        >
          <Heading1 className="h-4 w-4" />
          <span className="sr-only">{t("editor.heading1")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("h2")}
          title={t("editor.heading2")}
        >
          <Heading2 className="h-4 w-4" />
          <span className="sr-only">{t("editor.heading2")}</span>
        </Button>

        <div className="h-8 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("ul")}
          title={t("editor.bulletList")}
        >
          <List className="h-4 w-4" />
          <span className="sr-only">{t("editor.bulletList")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("ol")}
          title={t("editor.numberedList")}
        >
          <ListOrdered className="h-4 w-4" />
          <span className="sr-only">{t("editor.numberedList")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("quote")}
          title={t("editor.quote")}
        >
          <Quote className="h-4 w-4" />
          <span className="sr-only">{t("editor.quote")}</span>
        </Button>

        <div className="h-8 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("code")}
          title={t("editor.code")}
        >
          <Code className="h-4 w-4" />
          <span className="sr-only">{t("editor.code")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("table")}
          title={t("editor.table")}
        >
          <Table className="h-4 w-4" />
          <span className="sr-only">{t("editor.table")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("media")}
          title={t("editor.media")}
        >
          <Image className="h-4 w-4" />
          <span className="sr-only">{t("editor.media")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("ai-assist")}
          title={t("editor.aiAssist")}
        >
          <Sparkles className="h-4 w-4" />
          <span className="sr-only">{t("editor.aiAssist")}</span>
        </Button>
      </div>

      <div className="flex items-center gap-1">
        {hasChanges && onSave && (
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={onSave}>
            <Save className="h-3.5 w-3.5" />
            {t("editor.save")}
          </Button>
        )}

        <Button
          variant={showSpellCheck ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowSpellCheck(!showSpellCheck)}
          title={t("editor.spellCheck")}
        >
          <SpellCheck className="h-4 w-4" />
          <span className="sr-only">{t("editor.spellCheck")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("distraction-free")}
          title={t("editor.distractionFree")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{t("editor.distractionFree")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCommand("fullscreen")}
          title={isFullscreen ? t("editor.exitFullscreen") : t("editor.fullscreen")}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          <span className="sr-only">{isFullscreen ? t("editor.exitFullscreen") : t("editor.fullscreen")}</span>
        </Button>
      </div>
    </div>
  )
}

