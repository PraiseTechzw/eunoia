"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { type mockEntries, mockWordFrequency } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useTranslation } from "@/hooks/use-translation"
import { RefreshCw, ZoomIn, ZoomOut, Download, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface WordCloudProps {
  entries: typeof mockEntries
}

interface Word {
  text: string
  value: number
  x?: number
  y?: number
  size?: number
  color?: string
  angle?: number
}

export function WordCloud({ entries }: WordCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [words, setWords] = useState<Word[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [scale, setScale] = useState(1)
  const [hoveredWord, setHoveredWord] = useState<Word | null>(null)
  const [wordCount, setWordCount] = useState(30)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["emotions", "activities", "topics", "people"])
  const [isGenerating, setIsGenerating] = useState(false)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { toast } = useToast()

  // Process entries to extract words on mount
  useEffect(() => {
    // In a real app, this would analyze the entries to extract word frequencies
    // For this demo, we'll use mock data
    processEntries()
  }, [entries, wordCount, selectedCategories])

  // Draw word cloud when words change or theme changes
  useEffect(() => {
    if (!canvasRef.current || words.length === 0) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Set animation flag
    setIsAnimating(true)

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Calculate positions for words
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const centerX = width / 2
    const centerY = height / 2

    // Calculate word positions using spiral layout
    const positionedWords = calculateWordPositions(words, width, height)

    // Draw words with animation
    drawWords(ctx, positionedWords, scale)

    // Reset animation flag after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 1000)
  }, [words, theme, scale])

  // Handle mouse move for hover effects
  useEffect(() => {
    if (!canvasRef.current || isAnimating) return

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (canvas.width / rect.width)
      const y = (e.clientY - rect.top) * (canvas.height / rect.height)

      // Check if mouse is over a word
      let found = false
      for (const word of words) {
        if (!word.x || !word.y || !word.size) continue

        // Calculate word dimensions
        const ctx = canvas.getContext("2d")
        if (!ctx) continue

        ctx.font = `${word.size}px sans-serif`
        const metrics = ctx.measureText(word.text)
        const wordWidth = metrics.width
        const wordHeight = word.size

        // Check if mouse is over this word
        if (
          x >= word.x - wordWidth / 2 &&
          x <= word.x + wordWidth / 2 &&
          y >= word.y - wordHeight / 2 &&
          y <= word.y + wordHeight / 2
        ) {
          setHoveredWord(word)
          found = true
          break
        }
      }

      if (!found) {
        setHoveredWord(null)
      }
    }

    const handleMouseLeave = () => {
      setHoveredWord(null)
    }

    canvasRef.current.addEventListener("mousemove", handleMouseMove)
    canvasRef.current.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("mousemove", handleMouseMove)
        canvasRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [words, isAnimating])

  // Process entries to extract words
  const processEntries = () => {
    // In a real app, this would analyze the entries to extract word frequencies
    // For this demo, we'll use mock data
    const wordData = [...mockWordFrequency].sort((a, b) => b.value - a.value).slice(0, wordCount)

    setWords(wordData)
  }

  // Calculate word positions using spiral layout
  const calculateWordPositions = (words: Word[], width: number, height: number): Word[] => {
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(centerX, centerY) - 20

    // Calculate max and min values for scaling
    const maxValue = Math.max(...words.map((w) => w.value))
    const minValue = Math.min(...words.map((w) => w.value))

    // Calculate positions in a spiral pattern
    let angle = 0
    let radius = 0
    const angleIncrement = 0.6 // Controls how tightly the spiral winds
    const radiusIncrement = 0.8 // Controls how quickly the spiral expands

    // Set up colors
    const colors = [
      "#14b8a6", // teal-500
      "#10b981", // emerald-500
      "#0ea5e9", // sky-500
      "#8b5cf6", // violet-500
      "#ec4899", // pink-500
    ]

    return words.map((word, index) => {
      // Calculate font size based on word frequency
      const minFontSize = 12
      const maxFontSize = 48
      const fontSize = minFontSize + ((word.value - minValue) / (maxValue - minValue)) * (maxFontSize - minFontSize)

      // Calculate position in spiral
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      // Update angle and radius for next word
      angle += angleIncrement
      radius += radiusIncrement

      // Reset radius if it gets too large
      if (radius > maxRadius) {
        radius = maxRadius / 3
      }

      // Random angle for some words to make it look more natural
      const wordAngle = Math.random() > 0.7 ? (Math.random() > 0.5 ? 90 : -90) : 0

      return {
        ...word,
        x,
        y,
        size: fontSize * scale,
        color: colors[index % colors.length],
        angle: wordAngle,
      }
    })
  }

  // Draw words with animation
  const drawWords = (ctx: CanvasRenderingContext2D, words: Word[], scale: number) => {
    // Animation progress
    let animationFrame = 0
    const totalFrames = 60

    // Animation function
    const animate = () => {
      // Calculate current progress
      const currentProgress = isAnimating ? animationFrame / totalFrames : 1

      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      // Draw words
      words.forEach((word, index) => {
        if (!word.x || !word.y || !word.size || !word.color) return

        // Calculate animation properties
        const animatedSize = word.size * Math.min(1, currentProgress * 3 - index * 0.03)
        const animatedAlpha = Math.min(1, currentProgress * 5 - index * 0.05)

        if (animatedSize <= 0 || animatedAlpha <= 0) return

        // Set font and color
        ctx.font = `${animatedSize}px sans-serif`
        ctx.fillStyle =
          word.color +
          Math.floor(animatedAlpha * 255)
            .toString(16)
            .padStart(2, "0")

        // Save context for rotation
        ctx.save()

        // Translate to word position
        ctx.translate(word.x, word.y)

        // Rotate if needed
        if (word.angle) {
          ctx.rotate((word.angle * Math.PI) / 180)
        }

        // Draw text
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // Highlight hovered word
        if (hoveredWord && hoveredWord.text === word.text) {
          // Draw highlight
          const metrics = ctx.measureText(word.text)
          const width = metrics.width + 10
          const height = word.size + 10

          ctx.fillStyle = theme === "dark" ? "rgba(31, 41, 55, 0.7)" : "rgba(243, 244, 246, 0.7)"
          ctx.fillRect(-width / 2, -height / 2, width, height)

          // Draw text with original color but slightly larger
          ctx.fillStyle = word.color
          ctx.font = `bold ${animatedSize * 1.1}px sans-serif`
        }

        ctx.fillText(word.text, 0, 0)

        // Restore context
        ctx.restore()
      })

      // Continue animation if not complete
      if (isAnimating && animationFrame < totalFrames) {
        animationFrame++
        requestAnimationFrame(animate)
      }
    }

    // Start animation
    animate()
  }

  // Regenerate word cloud
  const regenerate = () => {
    setIsGenerating(true)

    // Simulate processing time
    setTimeout(() => {
      processEntries()
      setIsGenerating(false)

      toast({
        title: t("wordCloud.regenerated"),
        description: t("wordCloud.regeneratedDescription"),
      })
    }, 1000)
  }

  // Download word cloud as image
  const downloadImage = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const image = canvas.toDataURL("image/png")

    const link = document.createElement("a")
    link.href = image
    link.download = "word-cloud.png"
    link.click()

    toast({
      title: t("wordCloud.downloaded"),
      description: t("wordCloud.downloadedDescription"),
    })
  }

  // Toggle word category
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  // Word categories
  const categories = [
    { id: "emotions", label: t("wordCloud.categories.emotions") },
    { id: "activities", label: t("wordCloud.categories.activities") },
    { id: "topics", label: t("wordCloud.categories.topics") },
    { id: "people", label: t("wordCloud.categories.people") },
    { id: "places", label: t("wordCloud.categories.places") },
  ]

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={regenerate} disabled={isGenerating} className="h-8">
            {isGenerating ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
            )}
            {t("wordCloud.regenerate")}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-3.5 w-3.5 mr-1" />
                {t("wordCloud.filter")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{t("wordCloud.categories.title")}</h4>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <Label htmlFor={`category-${category.id}`}>{category.label}</Label>
                    </div>
                  ))}
                </div>

                <h4 className="font-medium text-sm mt-4">{t("wordCloud.wordCount")}</h4>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[wordCount]}
                    min={10}
                    max={100}
                    step={5}
                    onValueChange={(value) => setWordCount(value[0])}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{wordCount}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScale(Math.max(0.5, scale - 0.1))}
              className="h-8 w-8 p-0"
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-3.5 w-3.5" />
              <span className="sr-only">{t("wordCloud.zoomOut")}</span>
            </Button>

            <span className="w-12 text-center text-xs">{Math.round(scale * 100)}%</span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScale(Math.min(2, scale + 0.1))}
              className="h-8 w-8 p-0"
              disabled={scale >= 2}
            >
              <ZoomIn className="h-3.5 w-3.5" />
              <span className="sr-only">{t("wordCloud.zoomIn")}</span>
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={downloadImage} className="h-8">
            <Download className="h-3.5 w-3.5 mr-1" />
            {t("wordCloud.download")}
          </Button>
        </div>
      </div>

      {/* Word cloud canvas */}
      <div className="relative border rounded-md bg-card overflow-hidden">
        <canvas ref={canvasRef} width={800} height={500} className="w-full h-[400px]" />

        {/* Loading overlay */}
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">{t("wordCloud.generating")}</p>
            </div>
          </div>
        )}

        {/* Hover info */}
        {hoveredWord && (
          <div className="absolute bottom-2 left-2 bg-card p-2 rounded-md shadow-md text-sm border">
            <p className="font-medium">{hoveredWord.text}</p>
            <p className="text-xs text-muted-foreground">
              {t("wordCloud.frequency")}: {hoveredWord.value}
            </p>
          </div>
        )}
      </div>

      {/* Word cloud info */}
      <div className="text-xs text-muted-foreground">
        <p>{t("wordCloud.info")}</p>
      </div>
    </div>
  )
}

