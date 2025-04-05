"use client"

import { useEffect, useRef } from "react"

interface QRCodeProps {
  value: string
  size?: number
}

export function QRCode({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // This is a simplified QR code rendering for demonstration
    // In a real app, you would use a proper QR code library

    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, size, size)

    // Draw a fake QR code pattern
    ctx.fillStyle = "black"

    // Draw positioning squares
    ctx.fillRect(10, 10, 30, 30)
    ctx.fillRect(size - 40, 10, 30, 30)
    ctx.fillRect(10, size - 40, 30, 30)

    // Draw white inner squares for the positioning markers
    ctx.fillStyle = "white"
    ctx.fillRect(15, 15, 20, 20)
    ctx.fillRect(size - 35, 15, 20, 20)
    ctx.fillRect(15, size - 35, 20, 20)

    // Draw black inner squares
    ctx.fillStyle = "black"
    ctx.fillRect(20, 20, 10, 10)
    ctx.fillRect(size - 30, 20, 10, 10)
    ctx.fillRect(20, size - 30, 10, 10)

    // Draw random dots to simulate QR code data
    const blockSize = 5
    for (let y = 0; y < size; y += blockSize) {
      for (let x = 0; x < size; x += blockSize) {
        // Skip the positioning marker areas
        if ((x < 50 && y < 50) || (x > size - 50 && y < 50) || (x < 50 && y > size - 50)) {
          continue
        }

        // Randomly fill some blocks
        if (Math.random() > 0.75) {
          ctx.fillRect(x, y, blockSize, blockSize)
        }
      }
    }
  }, [value, size])

  return <canvas ref={canvasRef} width={size} height={size} className="border rounded-md" />
}

