"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Paperclip,
  Maximize2,
  Minimize2,
  Eye,
  Edit3,
  Check,
  Map,
  Music,
  Video,
  FileText,
  Sparkles,
} from "lucide-react"

interface ToolbarProps {
  onCommand: (command: string, value?: string) => void
  isFullscreen: boolean
  showSpellCheck: boolean
  setShowSpellCheck: (show: boolean) => void
  distractionFree: boolean
  setMode: (mode: "write" | "preview") => void
  mode: "write" | "preview"
}

export function Toolbar({
  onCommand,
  isFullscreen,
  showSpellCheck,
  setShowSpellCheck,
  distractionFree,
  setMode,
  mode,
}: ToolbarProps) {
  const { t } = useTranslation()

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50 items-center">
        <ToolbarButton
          tooltip={t("editor.toolbar.bold")}
          shortcut="Ctrl+B"
          onClick={() => onCommand("bold", "**Bold text**")}
          icon={<Bold className="h-4 w-4" />}
        />
        <ToolbarButton
          tooltip={t("editor.toolbar.italic")}
          shortcut="Ctrl+I"
          onClick={() => onCommand("italic", "*Italic text*")}
          icon={<Italic className="h-4 w-4" />}
        />
        <ToolbarButton
          tooltip={t("editor.toolbar.underline")}
          shortcut="Ctrl+U"
          onClick={() => onCommand("underline", "__Underlined text__")}
          icon={<Underline className="h-4 w-4" />}
        />

        <ToolbarSeparator />

        <ToolbarButton
          tooltip={t("editor.toolbar.heading1")}
          onClick={() => onCommand("h1", "# Heading 1")}
          icon={<Heading1 className="h-4 w-4" />}
        />
        <ToolbarButton
          tooltip={t("editor.toolbar.heading2")}
          onClick={() => onCommand("h2", "## Heading 2")}
          icon={<Heading2 className="h-4 w-4" />}
        />

        <ToolbarSeparator />

        <ToolbarButton
          tooltip={t("editor.toolbar.bulletList")}
          onClick={() => onCommand("ul", "- List item\n- Another item")}
          icon={<List className="h-4 w-4" />}
        />
        <ToolbarButton
          tooltip={t("editor.toolbar.numberedList")}
          onClick={() => onCommand("ol", "1. First item\n2. Second item")}
          icon={<ListOrdered className="h-4 w-4" />}
        />
        <ToolbarButton
          tooltip={t("editor.toolbar.quote")}
          onClick={() => onCommand("quote", "> Quoted text")}
          icon={<Quote className="h-4 w-4" />}
        />

        <ToolbarSeparator />

        <ToolbarButton
          tooltip={t("editor.toolbar.code")}
          onClick={() => onCommand("code")}
          icon={<Code className="h-4 w-4" />}
        />
        <ToolbarButton
          tooltip={t("editor.toolbar.table")}
          onClick={() => onCommand("table")}
          icon={<Table className="h-4 w-4" />}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">{t("editor.toolbar.embed")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="grid grid-cols-3 gap-1">
              <ToolbarButton
                tooltip={t("editor.toolbar.image")}
                onClick={() => onCommand("media", "image")}
                icon={<Image className="h-4 w-4" />}
              />
              <ToolbarButton
                tooltip={t("editor.toolbar.video")}
                onClick={() => onCommand("media", "video")}
                icon={<Video className="h-4 w-4" />}
              />
              <ToolbarButton
                tooltip={t("editor.toolbar.audio")}
                onClick={() => onCommand("media", "audio")}
                icon={<Music className="h-4 w-4" />}
              />
              <ToolbarButton
                tooltip={t("editor.toolbar.map")}
                onClick={() => onCommand("media", "map")}
                icon={<Map className="h-4 w-4" />}
              />
              <ToolbarButton
                tooltip={t("editor.toolbar.file")}
                onClick={() => onCommand("media", "file")}
                icon={<FileText className="h-4 w-4" />}
              />
              <ToolbarButton
                tooltip={t("editor.toolbar.link")}
                onClick={() => onCommand("link", "[Link text](https://example.com)")}
                icon={<LinkIcon className="h-4 w-4" />}
              />
            </div>
          </PopoverContent>
        </Popover>

        <ToolbarSeparator />

        <ToolbarButton
          tooltip={t("editor.toolbar.alignLeft")}
          onClick={() => onCommand("align", "left")}
          icon={<AlignLeft className="h-4 w-4" />}
        />
        <ToolbarButton
          tooltip={t("editor.toolbar.alignCenter")}
          onClick={() => onCommand("align", "center")}
          icon={<AlignCenter className="h-4 w-4" />}
        />
        <ToolbarButton
          tooltip={t("editor.toolbar.alignRight")}
          onClick={() => onCommand("align", "right")}
          icon={<AlignRight className="h-4 w-4" />}
        />

        <ToolbarSeparator />

        <ToolbarButton
          tooltip={t("editor.toolbar.spellCheck")}
          isActive={showSpellCheck}
          onClick={() => onCommand("spellcheck")}
          icon={<Check className="h-4 w-4" />}
        />

        <ToolbarButton
          tooltip={t("editor.toolbar.aiAssist")}
          onClick={() => onCommand("ai-assist")}
          icon={<Sparkles className="h-4 w-4" />}
        />

        <div className="ml-auto flex items-center gap-2">
          <ToolbarButton
            tooltip={isFullscreen ? t("editor.toolbar.exitFullscreen") : t("editor.toolbar.fullscreen")}
            shortcut="F11"
            onClick={() => onCommand("fullscreen")}
            icon={isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          />

          <ToolbarButton
            tooltip={t("editor.toolbar.distractionFree")}
            shortcut="Ctrl+Shift+F"
            onClick={() => onCommand("distraction-free")}
            icon={<Type className="h-4 w-4" />}
          />

          <ToolbarSeparator />

          <Tabs defaultValue={mode} onValueChange={(value) => setMode(value as "write" | "preview")}>
            <TabsList className="h-8">
              <TabsTrigger value="write" className="text-xs px-2 py-1">
                <Edit3 className="h-3 w-3 mr-1" />
                {t("editor.toolbar.write")}
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-xs px-2 py-1">
                <Eye className="h-3 w-3 mr-1" />
                {t("editor.toolbar.preview")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  )
}

interface ToolbarButtonProps {
  tooltip: string
  icon: React.ReactNode
  onClick: () => void
  shortcut?: string
  isActive?: boolean
}

function ToolbarButton({ tooltip, icon, onClick, shortcut, isActive }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${isActive ? "bg-muted" : ""}`}
          onClick={onClick}
        >
          {icon}
          <span className="sr-only">{tooltip}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltip}</p>
        {shortcut && <p className="text-xs text-muted-foreground">{shortcut}</p>}
      </TooltipContent>
    </Tooltip>
  )
}

function ToolbarSeparator() {
  return <div className="w-px h-8 bg-border mx-1" />
}

