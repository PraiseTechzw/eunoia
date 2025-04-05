"use client"

import { useEffect, useRef } from "react"

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height

    // Animation variables
    let animationFrameId: number
    const particles: Particle[] = []
    const particleCount = 50

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.color = this.getRandomColor()
      }

      getRandomColor() {
        const colors = [
          "rgba(20, 184, 166, 0.5)", // teal-500
          "rgba(16, 185, 129, 0.5)", // emerald-500
          "rgba(6, 182, 212, 0.5)", // cyan-500
          "rgba(14, 165, 233, 0.5)", // sky-500
        ]
        return colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x > width || this.x < 0) {
          this.speedX = -this.speedX
        }
        if (this.y > height || this.y < 0) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        ctx!.fillStyle = this.color
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Draw notebook lines
    const drawNotebookLines = () => {
      ctx!.strokeStyle = "rgba(156, 163, 175, 0.2)" // gray-400 with transparency
      ctx!.lineWidth = 1

      // Horizontal lines
      for (let y = 40; y < height; y += 30) {
        ctx!.beginPath()
        ctx!.moveTo(0, y)
        ctx!.lineTo(width, y)
        ctx!.stroke()
      }

      // Vertical line (margin)
      ctx!.beginPath()
      ctx!.moveTo(50, 0)
      ctx!.lineTo(50, height)
      ctx!.stroke()
    }

    // Draw journal entries
    const drawJournalEntries = () => {
      ctx!.font = "12px sans-serif"
      ctx!.fillStyle = "rgba(107, 114, 128, 0.7)" // gray-500 with transparency

      const lines = [
        "Today I felt a sense of accomplishment...",
        "I'm grateful for the support of my friends...",
        "The challenge I'm facing with work is...",
        "My goals for the next month include...",
        "I noticed a pattern in my thinking today...",
        "The most important insight I had was...",
      ]

      lines.forEach((line, index) => {
        ctx!.fillText(line, 60, 60 + index * 30)
      })
    }

    // Draw data visualization elements
    const drawDataViz = () => {
      // Draw a simple bar chart
      const barWidth = 20
      const barSpacing = 10
      const barMaxHeight = 100
      const barValues = [0.7, 0.4, 0.9, 0.5, 0.6]
      const barColors = [
        "rgba(20, 184, 166, 0.7)", // teal-500
        "rgba(16, 185, 129, 0.7)", // emerald-500
        "rgba(6, 182, 212, 0.7)", // cyan-500
        "rgba(14, 165, 233, 0.7)", // sky-500
        "rgba(79, 70, 229, 0.7)", // indigo-500
      ]

      const startX = width - 180
      const startY = height - 50

      barValues.forEach((value, index) => {
        const barHeight = value * barMaxHeight
        ctx!.fillStyle = barColors[index]
        ctx!.fillRect(startX + index * (barWidth + barSpacing), startY - barHeight, barWidth, barHeight)
      })
    }

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx!.clearRect(0, 0, width, height)

      // Draw notebook background
      drawNotebookLines()
      drawJournalEntries()
      drawDataViz()

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx!.beginPath()
            ctx!.strokeStyle = `rgba(20, 184, 166, ${0.2 - distance / 500})`
            ctx!.lineWidth = 1
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} width={600} height={400} className="w-full h-full" />
}

