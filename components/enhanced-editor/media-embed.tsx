"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft, Upload, Image, Video, Music, Map, Link } from "lucide-react"

interface MediaEmbedProps {
  onInsert: (mediaContent: string) => void
  onCancel: () => void
}

export function MediaEmbed({ onInsert, onCancel }: MediaEmbedProps) {
  const [mediaType, setMediaType] = useState<"image" | "video" | "audio" | "map" | "file">("image")
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [embedCode, setEmbedCode] = useState("")
  const { t } = useTranslation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)

    // Create preview URL
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    // Set title to filename if not already set
    if (!title) {
      setTitle(selectedFile.name)
    }

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }

  const generateMarkdown = () => {
    switch (mediaType) {
      case "image":
        return `![${title || "Image"}](${url || previewUrl || ""})`
      case "video":
        if (embedCode) {
          return embedCode
        }
        return `<video controls src="${url || previewUrl || ""}" title="${title || "Video"}"></video>`
      case "audio":
        return `<audio controls src="${url || previewUrl || ""}" title="${title || "Audio"}"></audio>`
      case "map":
        if (embedCode) {
          return embedCode
        }
        return `<iframe width="100%" height="300" frameborder="0" src="${url}" title="${title || "Map"}"></iframe>`
      case "file":
        return `[${title || "File"}](${url || previewUrl || ""})`
      default:
        return ""
    }
  }

  const handleInsert = () => {
    const markdown = generateMarkdown()
    onInsert(markdown)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("editor.mediaEmbed.back")}
          </Button>
          <h3 className="text-lg font-medium">{t("editor.mediaEmbed.title")}</h3>
        </div>
      </div>

      <Tabs defaultValue="image" onValueChange={(value) => setMediaType(value as any)}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="image">
            <Image className="h-4 w-4 mr-1" />
            {t("editor.mediaEmbed.image")}
          </TabsTrigger>
          <TabsTrigger value="video">
            <Video className="h-4 w-4 mr-1" />
            {t("editor.mediaEmbed.video")}
          </TabsTrigger>
          <TabsTrigger value="audio">
            <Music className="h-4 w-4 mr-1" />
            {t("editor.mediaEmbed.audio")}
          </TabsTrigger>
          <TabsTrigger value="map">
            <Map className="h-4 w-4 mr-1" />
            {t("editor.mediaEmbed.map")}
          </TabsTrigger>
          <TabsTrigger value="file">
            <Link className="h-4 w-4 mr-1" />
            {t("editor.mediaEmbed.file")}
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("editor.mediaEmbed.title")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("editor.mediaEmbed.titlePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">{t("editor.mediaEmbed.url")}</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("editor.mediaEmbed.urlPlaceholder")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">{t("editor.mediaEmbed.uploadFile")}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="flex-1"
                accept={
                  mediaType === "image"
                    ? "image/*"
                    : mediaType === "video"
                      ? "video/*"
                      : mediaType === "audio"
                        ? "audio/*"
                        : "*/*"
                }
              />
              <Button variant="outline" size="sm" onClick={() => document.getElementById("file")?.click()}>
                <Upload className="h-4 w-4 mr-1" />
                {t("editor.mediaEmbed.upload")}
              </Button>
            </div>
          </div>

          {(mediaType === "video" || mediaType === "map") && (
            <div className="space-y-2">
              <Label htmlFor="embed">{t("editor.mediaEmbed.embedCode")}</Label>
              <textarea
                id="embed"
                className="w-full min-h-[100px] p-2 border rounded-md"
                value={embedCode}
                onChange={(e) => setEmbedCode(e.target.value)}
                placeholder={t("editor.mediaEmbed.embedPlaceholder")}
              />
              <p className="text-xs text-muted-foreground">{t("editor.mediaEmbed.embedHelp")}</p>
            </div>
          )}

          {/* Preview */}
          {(url || previewUrl) && (
            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">{t("editor.mediaEmbed.preview")}</h4>
              <div className="flex justify-center">
                {mediaType === "image" && (
                  <img
                    src={url || previewUrl || ""}
                    alt={title || "Preview"}
                    className="max-h-[200px] object-contain"
                  />
                )}
                {mediaType === "video" && !embedCode && (
                  <video src={url || previewUrl || ""} controls className="max-h-[200px]" />
                )}
                {mediaType === "audio" && <audio src={url || previewUrl || ""} controls />}
                {mediaType === "map" && !embedCode && url && (
                  <iframe src={url} title={title || "Map"} width="100%" height="200" frameBorder="0" />
                )}
                {embedCode && <div dangerouslySetInnerHTML={{ __html: embedCode }} />}
              </div>
            </div>
          )}
        </div>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          {t("editor.mediaEmbed.cancel")}
        </Button>
        <Button onClick={handleInsert} disabled={!url && !previewUrl && !embedCode}>
          {t("editor.mediaEmbed.insert")}
        </Button>
      </div>
    </div>
  )
}

