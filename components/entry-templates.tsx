"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface Template {
  id: string
  title: string
  content: string
  description: string
}

const templates: Template[] = [
  {
    id: "daily-reflection",
    title: "Daily Reflection",
    description: "A template for daily journaling and reflection",
    content: `# Daily Reflection

## What went well today?
- 

## What could have gone better?
- 

## What did I learn?
- 

## Goals for tomorrow
- 

## Gratitude
- 
`
  },
  {
    id: "weekly-review",
    title: "Weekly Review",
    description: "A template for weekly review and planning",
    content: `# Weekly Review

## Highlights of the week
- 

## Challenges faced
- 

## Lessons learned
- 

## Goals for next week
- 

## Personal growth
- 
`
  },
  {
    id: "gratitude-journal",
    title: "Gratitude Journal",
    description: "A template for practicing gratitude",
    content: `# Gratitude Journal

## Today I am grateful for...
1. 
2. 
3. 

## Moments of joy
- 

## People I appreciate
- 

## Small wins
- 
`
  }
]

interface EntryTemplatesProps {
  onSelect: (template: Template) => void
}

export function EntryTemplates({ onSelect }: EntryTemplatesProps) {
  return (
    <div className="grid gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {template.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
            <Button
              variant="outline"
              onClick={() => onSelect(template)}
              className="w-full"
            >
              Use Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 