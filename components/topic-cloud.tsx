"use client"

import { useEffect, useRef } from "react"

interface Topic {
  text: string
  value: number
}

export function TopicCloud() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Sample data - in a real app, this would come from NLP analysis of journal entries
    const topics: Topic[] = [
      { text: "Family", value: 25 },
      { text: "Work", value: 18 },
      { text: "Health", value: 15 },
      { text: "Relationships", value: 22 },
      { text: "Goals", value: 12 },
      { text: "Travel", value: 8 },
      { text: "Hobbies", value: 10 },
      { text: "Learning", value: 14 },
      { text: "Finances", value: 9 },
      { text: "Gratitude", value: 20 },
      { text: "Challenges", value: 16 },
      { text: "Growth", value: 17 },
    ]

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set up colors
    const colors = [
      "#14b8a6", // teal-500
      "#10b981", // emerald-500
      "#0ea5e9", // sky-500
      "#8b5cf6", // violet-500
      "#ec4899", // pink-500
    ]

    // Draw the topic cloud
    const centerX = canvasRef.current.width / 2
    const centerY = canvasRef.current.height / 2
    const maxRadius = Math.min(centerX, centerY) - 20

    // Sort topics by value (descending)
    const sortedTopics = [...topics].sort((a, b) => b.value - a.value)

    // Calculate positions in a spiral pattern
    let angle = 0
    let radius = 0
    const angleIncrement = 0.6 // Controls how tightly the spiral winds
    const radiusIncrement = 0.8 // Controls how quickly the spiral expands

    sortedTopics.forEach((topic, index) => {
      // Calculate font size based on topic value
      const minFontSize = 12
      const maxFontSize = 32
      const fontSize = minFontSize + (topic.value / sortedTopics[0].value) * (maxFontSize - minFontSize)

      // Set font and color
      ctx.font = `${fontSize}px sans-serif`
      ctx.fillStyle = colors[index % colors.length]

      // Calculate text width for positioning
      const textWidth = ctx.measureText(topic.text).width

      // Calculate position in spiral
      let x = centerX + radius * Math.cos(angle)
      let y = centerY + radius * Math.sin(angle)

      // Ensure text stays within canvas bounds
      x = Math.max(textWidth / 2, Math.min(canvasRef.current.width - textWidth / 2, x))
      y = Math.max(fontSize / 2, Math.min(canvasRef.current.height - fontSize / 2, y))

      // Draw text
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(topic.text, x, y)

      // Update angle and radius for next topic
      angle += angleIncrement
      radius += radiusIncrement

      // Reset radius if it gets too large
      if (radius > maxRadius) {
        radius = maxRadius / 3
      }
    })
  }, [])

  return (
    <div className="w-full h-[300px] relative">
      <canvas ref={canvasRef} width={500} height={300} className="w-full h-full" />
    </div>
  )
}

