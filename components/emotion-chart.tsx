"use client"

import { useEffect, useRef } from "react"

export function EmotionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Sample data - in a real app, this would come from analyzing journal entries
    const emotions = ["Joy", "Sadness", "Anger", "Fear", "Surprise", "Disgust", "Trust"]
    const lastMonth = [65, 20, 15, 30, 25, 10, 70]
    const thisMonth = [75, 15, 10, 20, 35, 5, 80]

    // Set up colors
    const lastMonthColor = "rgba(20, 184, 166, 0.5)" // teal with transparency
    const thisMonthColor = "rgba(16, 185, 129, 0.8)" // emerald with transparency

    // Draw the chart
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const chartWidth = canvasRef.current.width - 60
    const chartHeight = canvasRef.current.height - 60
    const barWidth = chartWidth / (emotions.length * 2 + emotions.length - 1)
    const spacing = barWidth / 2

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(40, 20)
    ctx.lineTo(40, chartHeight + 30)
    ctx.lineTo(canvasRef.current.width - 20, chartHeight + 30)
    ctx.strokeStyle = "#9ca3af" // gray-400
    ctx.stroke()

    // Draw y-axis labels
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "#6b7280" // gray-500
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    for (let i = 0; i <= 100; i += 20) {
      const y = chartHeight + 30 - (i / 100) * chartHeight
      ctx.fillText(i.toString(), 35, y)

      // Draw horizontal grid lines
      ctx.beginPath()
      ctx.moveTo(40, y)
      ctx.lineTo(canvasRef.current.width - 20, y)
      ctx.strokeStyle = "rgba(156, 163, 175, 0.2)" // gray-400 with transparency
      ctx.stroke()
    }

    // Draw bars and x-axis labels
    emotions.forEach((emotion, index) => {
      const x1 = 40 + index * (2 * barWidth + spacing) + spacing
      const x2 = x1 + barWidth

      // Last month bar
      const lastMonthHeight = (lastMonth[index] / 100) * chartHeight
      ctx.fillStyle = lastMonthColor
      ctx.fillRect(x1, chartHeight + 30 - lastMonthHeight, barWidth, lastMonthHeight)

      // This month bar
      const thisMonthHeight = (thisMonth[index] / 100) * chartHeight
      ctx.fillStyle = thisMonthColor
      ctx.fillRect(x2, chartHeight + 30 - thisMonthHeight, barWidth, thisMonthHeight)

      // X-axis label
      ctx.fillStyle = "#6b7280" // gray-500
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(emotion, x1 + barWidth / 2 + spacing / 2, chartHeight + 35)
    })

    // Draw legend
    ctx.fillStyle = lastMonthColor
    ctx.fillRect(canvasRef.current.width - 100, 20, 10, 10)
    ctx.fillStyle = thisMonthColor
    ctx.fillRect(canvasRef.current.width - 100, 40, 10, 10)

    ctx.fillStyle = "#6b7280" // gray-500
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillText("Last Month", canvasRef.current.width - 85, 25)
    ctx.fillText("This Month", canvasRef.current.width - 85, 45)
  }, [])

  return (
    <div className="w-full h-[300px] relative">
      <canvas ref={canvasRef} width={500} height={300} className="w-full h-full" />
    </div>
  )
}

