"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table } from "lucide-react"

interface TableCreatorProps {
  onInsert: (markdown: string) => void
}

export function TableCreator({ onInsert }: TableCreatorProps) {
  const [rows, setRows] = useState(3)
  const [columns, setColumns] = useState(3)

  const handleInsert = () => {
    let markdown = "|"
    // Create header row
    for (let i = 0; i < columns; i++) {
      markdown += " Header |"
    }
    markdown += "\n|"
    // Create separator row
    for (let i = 0; i < columns; i++) {
      markdown += " --- |"
    }
    // Create data rows
    for (let i = 0; i < rows - 1; i++) {
      markdown += "\n|"
      for (let j = 0; j < columns; j++) {
        markdown += " Cell |"
      }
    }
    onInsert(markdown)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rows">Rows</Label>
          <Input
            id="rows"
            type="number"
            min="1"
            value={rows}
            onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="columns">Columns</Label>
          <Input
            id="columns"
            type="number"
            min="1"
            value={columns}
            onChange={(e) => setColumns(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
      </div>
      <Button onClick={handleInsert} className="w-full gap-2">
        <Table className="h-4 w-4" />
        Insert Table
      </Button>
    </div>
  )
} 