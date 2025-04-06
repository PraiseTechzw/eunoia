"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash,
  Copy,
  Check,
  Star,
  Calendar,
  ListChecks,
  Brain,
  Heart,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Sample template data
const sampleTemplates = [
  {
    id: "1",
    name: "Daily Reflection",
    description: "A simple template for daily journaling with prompts for gratitude and reflection.",
    content:
      "# Daily Reflection\n\n## Three things I'm grateful for today:\n1. \n2. \n3. \n\n## What went well today:\n\n\n## What could have gone better:\n\n\n## One thing I learned today:\n\n\n## Tomorrow's focus:",
    category: "daily",
    isDefault: true,
    usageCount: 42,
    lastUsed: "2023-07-10T12:00:00Z",
  },
  {
    id: "2",
    name: "Weekly Review",
    description: "End-of-week reflection to review progress, challenges, and set goals for next week.",
    content:
      "# Weekly Review\n\n## Highlights of the week:\n\n\n## Challenges faced:\n\n\n## Progress on goals:\n\n\n## What I learned:\n\n\n## Focus for next week:\n1. \n2. \n3. ",
    category: "weekly",
    isDefault: true,
    usageCount: 18,
    lastUsed: "2023-07-09T12:00:00Z",
  },
  {
    id: "3",
    name: "Gratitude Practice",
    description: "Focus on gratitude with prompts to reflect on what you're thankful for.",
    content:
      "# Gratitude Practice\n\n## I'm grateful for these people:\n\n\n## I'm grateful for these experiences:\n\n\n## I'm grateful for these things:\n\n\n## I'm grateful for these opportunities:\n\n\n## One small thing I appreciated today:",
    category: "mindfulness",
    isDefault: true,
    usageCount: 27,
    lastUsed: "2023-07-08T12:00:00Z",
  },
  {
    id: "4",
    name: "Problem Solving",
    description: "Structure your thoughts around a problem and explore potential solutions.",
    content:
      "# Problem Solving\n\n## The problem I'm facing:\n\n\n## Why this matters to me:\n\n\n## Potential causes:\n\n\n## Possible solutions:\n1. \n2. \n3. \n\n## Next steps:",
    category: "productivity",
    isDefault: true,
    usageCount: 15,
    lastUsed: "2023-07-07T12:00:00Z",
  },
  {
    id: "5",
    name: "Goal Setting",
    description: "Define your goals with clear actions and timelines.",
    content:
      "# Goal Setting\n\n## Goal:\n\n\n## Why this goal matters:\n\n\n## Specific actions to take:\n1. \n2. \n3. \n\n## Potential obstacles:\n\n\n## Resources needed:\n\n\n## Timeline and milestones:",
    category: "productivity",
    isDefault: true,
    usageCount: 22,
    lastUsed: "2023-07-06T12:00:00Z",
  },
  {
    id: "6",
    name: "Emotional Check-in",
    description: "Explore and process your emotions with guided prompts.",
    content:
      "# Emotional Check-in\n\n## How I'm feeling right now:\n\n\n## What triggered these feelings:\n\n\n## Physical sensations I notice:\n\n\n## Thoughts associated with these feelings:\n\n\n## What I need right now:",
    category: "mindfulness",
    isDefault: true,
    usageCount: 31,
    lastUsed: "2023-07-05T12:00:00Z",
  },
]

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [templates, setTemplates] = useState(sampleTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    content: "",
    category: "daily",
  })
  const router = useRouter()
  const { toast } = useToast()

  // Filter templates based on search and category
  const getFilteredTemplates = () => {
    let filtered = [...templates]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (activeTab !== "all") {
      filtered = filtered.filter((template) => template.category === activeTab)
    }

    return filtered
  }

  // Handle template selection
  const selectTemplate = (template: any) => {
    setSelectedTemplate(template)
    setIsEditing(false)
  }

  // Start creating new template
  const startCreatingTemplate = () => {
    setSelectedTemplate(null)
    setIsCreating(true)
    setNewTemplate({
      name: "",
      description: "",
      content: "",
      category: "daily",
    })
  }

  // Start editing template
  const startEditingTemplate = (template: any) => {
    setSelectedTemplate(template)
    setIsEditing(true)
    setNewTemplate({
      name: template.name,
      description: template.description,
      content: template.content,
      category: template.category,
    })
  }

  // Cancel creating/editing
  const cancelCreateEdit = () => {
    if (isCreating) {
      setIsCreating(false)
    }
    if (isEditing) {
      setIsEditing(false)
    }
  }

  // Save template
  const saveTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name and content for your template.",
        variant: "destructive",
      })
      return
    }

    if (isCreating) {
      // Create new template
      const newTemplateObj = {
        id: `template-${Date.now()}`,
        ...newTemplate,
        isDefault: false,
        usageCount: 0,
        lastUsed: new Date().toISOString(),
      }

      setTemplates([...templates, newTemplateObj])
      setSelectedTemplate(newTemplateObj)
      setIsCreating(false)

      toast({
        title: "Template created",
        description: `Template "${newTemplate.name}" has been created successfully.`,
      })
    } else if (isEditing) {
      // Update existing template
      const updatedTemplates = templates.map((template) =>
        template.id === selectedTemplate.id ? { ...template, ...newTemplate } : template,
      )

      setTemplates(updatedTemplates)
      setSelectedTemplate({ ...selectedTemplate, ...newTemplate })
      setIsEditing(false)

      toast({
        title: "Template updated",
        description: `Template "${newTemplate.name}" has been updated successfully.`,
      })
    }
  }

  // Delete template
  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter((template) => template.id !== templateId)
    setTemplates(updatedTemplates)

    if (selectedTemplate && selectedTemplate.id === templateId) {
      setSelectedTemplate(null)
    }

    toast({
      title: "Template deleted",
      description: "The template has been deleted successfully.",
    })
  }

  // Use template to create new entry
  const useTemplate = (templateId: string) => {
    // In a real app, this would pre-fill the new entry form with the template content
    router.push(`/entries/new?template=${templateId}`)
  }

  const filteredTemplates = getFilteredTemplates()

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "daily":
        return <Calendar className="h-4 w-4" />
      case "weekly":
        return <ListChecks className="h-4 w-4" />
      case "mindfulness":
        return <Brain className="h-4 w-4" />
      case "productivity":
        return <CheckIcon className="h-4 w-4" />
      case "personal":
        return <Heart className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Custom check icon component
  const CheckIcon = (props: any) => <Check {...props} />

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex flex-col space-y-2 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Templates</h1>
            <p className="text-muted-foreground">Create and manage templates for your journal entries</p>
          </div>

          <Button onClick={startCreatingTemplate} className="gap-1">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Template Library</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pb-1">
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
                  <TabsTrigger value="productivity">Productivity</TabsTrigger>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>

            <div className="px-6 pb-4 max-h-[500px] overflow-y-auto">
              {filteredTemplates.length > 0 ? (
                <div className="space-y-2">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 rounded-md cursor-pointer border ${
                        selectedTemplate?.id === template.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                      onClick={() => selectTemplate(template)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(template.category)}
                          <span className="font-medium">{template.name}</span>
                        </div>
                        {template.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>Used {template.usageCount} times</span>
                        <span>{new Date(template.lastUsed).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="rounded-full bg-muted p-3 inline-flex mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No templates found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? `No templates matching "${searchQuery}"` : "No templates in this category"}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>AI Template Generator</CardTitle>
              <CardDescription>Let AI create a custom template based on your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Describe your template needs</label>
                  <Textarea
                    placeholder="E.g., I need a template for tracking my fitness progress with sections for workouts, nutrition, and goals."
                    className="min-h-[100px]"
                  />
                </div>

                <Button className="w-full gap-1">
                  <Sparkles className="h-4 w-4" />
                  Generate Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {isCreating || isEditing ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{isCreating ? "Create New Template" : "Edit Template"}</CardTitle>
                <CardDescription>
                  {isCreating ? "Create a new template for your journal entries" : "Edit your existing template"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Template Name</label>
                      <Input
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        placeholder="E.g., Daily Reflection"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={newTemplate.category}
                        onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="mindfulness">Mindfulness</option>
                        <option value="productivity">Productivity</option>
                        <option value="personal">Personal</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                      placeholder="Brief description of the template"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Template Content</label>
                    <div className="border rounded-md">
                      <Textarea
                        value={newTemplate.content}
                        onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                        placeholder="# Template Title

## Section 1
Your content here...

## Section 2
More content here..."
                        className="min-h-[300px] font-mono text-sm border-0 resize-none focus-visible:ring-0"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use Markdown formatting for headings, lists, and other formatting.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={cancelCreateEdit}>
                  Cancel
                </Button>
                <Button onClick={saveTemplate}>{isCreating ? "Create Template" : "Save Changes"}</Button>
              </CardFooter>
            </Card>
          ) : selectedTemplate ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(selectedTemplate.category)}
                      <CardTitle>{selectedTemplate.name}</CardTitle>
                    </div>
                    <CardDescription>{selectedTemplate.description}</CardDescription>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => startEditingTemplate(selectedTemplate)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive">
                          <Trash className="h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Template</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the template "{selectedTemplate.name}"? This action cannot
                            be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteTemplate(selectedTemplate.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Template
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Category:</span> {selectedTemplate.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Last used:</span>{" "}
                        {new Date(selectedTemplate.lastUsed).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500" />
                      Used {selectedTemplate.usageCount} times
                    </span>
                  </div>

                  <div className="border rounded-md p-4 bg-muted/30 min-h-[300px] whitespace-pre-wrap font-mono text-sm">
                    {selectedTemplate.content}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  className="gap-1"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTemplate.content)
                    toast({
                      title: "Copied to clipboard",
                      description: "Template content has been copied to your clipboard.",
                    })
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Copy Content
                </Button>

                <Button onClick={() => useTemplate(selectedTemplate.id)} className="gap-1">
                  <FileText className="h-4 w-4" />
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <div className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-2">Select a Template</h2>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Choose a template from the library or create a new one to get started with your journal entry.
                </p>
                <Button onClick={startCreatingTemplate} className="gap-1">
                  <Plus className="h-4 w-4" />
                  Create New Template
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

