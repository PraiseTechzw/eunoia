"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft, Plus, Trash } from "lucide-react"

interface TableEditorProps {
  onInsert: (tableContent: string) => void
  onCancel: () => void
}

export function TableEditor({ onInsert, onCancel }: TableEditorProps) {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [tableData, setTableData] = useState<string[][]>([])
  const [headerRow, setHeaderRow] = useState(true)
  const { t } = useTranslation()

  // Initialize table data when rows or cols change
  const initializeTable = () => {
    const newData: string[][] = []
    for (let i = 0; i < rows; i++) {
      const row: string[] = []
      for (let j = 0; j < cols; j++) {
        row.push("")
      }
      newData.push(row)
    }
    setTableData(newData)
  }

  // Update cell value
  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData]
    if (!newData[rowIndex]) {
      newData[rowIndex] = []
    }
    newData[rowIndex][colIndex] = value
    setTableData(newData)
  }

  // Generate markdown table
  const generateMarkdownTable = () => {
    if (tableData.length === 0) return ""

    let markdown = ""

    // Header row
    for (let j = 0; j < cols; j++) {
      markdown += `| ${headerRow && tableData[0] ? tableData[0][j] || "" : `Column ${j + 1}`} `
    }
    markdown += "|\n"

    // Separator row
    for (let j = 0; j < cols; j++) {
      markdown += "| --- "
    }
    markdown += "|\n"

    // Data rows
    const startRow = headerRow ? 1 : 0
    for (let i = startRow; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        markdown += `| ${tableData[i] ? tableData[i][j] || "" : ""} `
      }
      markdown += "|\n"
    }

    return markdown
  }

  // Handle insert
  const handleInsert = () => {
    const markdown = generateMarkdownTable()
    onInsert(markdown)
  }

  // Add row
  const addRow = () => {
    setRows(rows + 1)
    const newData = [...tableData]
    const newRow: string[] = []
    for (let j = 0; j < cols; j++) {
      newRow.push("")
    }
    newData.push(newRow)
    setTableData(newData)
  }

  // Add column
  const addColumn = () => {
    setCols(cols + 1)
    const newData = tableData.map((row) => {
      return [...row, ""]
    })
    setTableData(newData)
  }

  // Remove row
  const removeRow = (index: number) => {
    if (rows <= 1) return
    setRows(rows - 1)
    const newData = [...tableData]
    newData.splice(index, 1)
    setTableData(newData)
  }

  // Remove column
  const removeColumn = (index: number) => {
    if (cols <= 1) return
    setCols(cols - 1)
    const newData = tableData.map((row) => {
      const newRow = [...row]
      newRow.splice(index, 1)
      return newRow
    })
    setTableData(newData)
  }

  // Initialize table if empty
  if (tableData.length === 0 || tableData.length !== rows || (tableData[0] && tableData[0].length !== cols)) {
    initializeTable()
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("editor.tableEditor.back")}
          </Button>
          <h3 className="text-lg font-medium">{t("editor.tableEditor.title")}</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rows">{t("editor.tableEditor.rows")}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="rows"
              type="number"
              min="1"
              max="10"
              value={rows}
              onChange={(e) => setRows(Number.parseInt(e.target.value) || 1)}
            />
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">{t("editor.tableEditor.addRow")}</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cols">{t("editor.tableEditor.columns")}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="cols"
              type="number"
              min="1"
              max="10"
              value={cols}
              onChange={(e) => setCols(Number.parseInt(e.target.value) || 1)}
            />
            <Button variant="outline" size="sm" onClick={addColumn}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">{t("editor.tableEditor.addColumn")}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-auto max-h-[400px]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-8"></th>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <th key={colIndex} className="p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeColumn(colIndex)}
                    disabled={cols <= 1}
                  >
                    <Trash className="h-3 w-3" />
                    <span className="sr-only">{t("editor.tableEditor.removeColumn")}</span>
                  </Button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeRow(rowIndex)}
                    disabled={rows <= 1}
                  >
                    <Trash className="h-3 w-3" />
                    <span className="sr-only">{t("editor.tableEditor.removeRow")}</span>
                  </Button>
                </td>
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <td key={colIndex} className="p-1">
                    <Input
                      value={tableData[rowIndex] ? tableData[rowIndex][colIndex] || "" : ""}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="h-8 text-sm"
                      placeholder={
                        rowIndex === 0 && headerRow ? `Header ${colIndex + 1}` : `Cell ${rowIndex + 1},${colIndex + 1}`
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          {t("editor.tableEditor.cancel")}
        </Button>
        <Button onClick={handleInsert}>{t("editor.tableEditor.insert")}</Button>
      </div>
    </div>
  )
}

