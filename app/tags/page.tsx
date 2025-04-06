"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockTags } from "@/lib/mock-data"
import { useSimulation } from "@/hooks/use-simulation"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { TagIcon, Plus, Search, Edit, Trash, X, Check, ArrowUpDown, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "count">("count")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [newTagName, setNewTagName] = useState("")
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [editingTagName, setEditingTagName] = useState("")
  const [tagToDelete, setTagToDelete] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Simulate loading tags
  const { execute: loadTags, isLoading, data: tagsData } = useSimulation<any, [void]>("tags", "getTags", true)

  // Simulate creating a tag
  const { execute: createTag, isLoading: isCreating } = useSimulation<any, [string]>("tags", "createTag", false)

  // Simulate updating a tag
  const { execute: updateTag, isLoading: isUpdating } = useSimulation<any, [string, string]>("tags", "updateTag", false)

  // Simulate deleting a tag
  const { execute: deleteTag, isLoading: isDeleting } = useSimulation<any, [string]>("tags", "deleteTag", false)

  // Handle create tag
  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast({
        title: "Tag name required",
        description: "Please enter a name for the new tag.",
        variant: "destructive",
      })
      return
    }

    try {
      await createTag(newTagName)
      setNewTagName("")
      toast({
        title: "Tag created",
        description: `Tag "${newTagName}" has been created successfully.`,
      })
    } catch (error) {
      // Error is handled by useSimulation
    }
  }

  // Handle update tag
  const handleUpdateTag = async (id: string) => {
    if (!editingTagName.trim()) {
      toast({
        title: "Tag name required",
        description: "Please enter a name for the tag.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateTag(id, editingTagName)
      setEditingTagId(null)
      setEditingTagName("")
      toast({
        title: "Tag updated",
        description: `Tag has been updated successfully.`,
      })
    } catch (error) {
      // Error is handled by useSimulation
    }
  }

  // Handle delete tag
  const handleDeleteTag = async (id: string) => {
    try {
      await deleteTag(id)
      setTagToDelete(null)
      toast({
        title: "Tag deleted",
        description: `Tag has been deleted successfully.`,
      })
    } catch (error) {
      // Error is handled by useSimulation
    }
  }

  // Start editing tag
  const startEditingTag = (tag: any) => {
    setEditingTagId(tag.id)
    setEditingTagName(tag.name)
  }

  // Cancel editing tag
  const cancelEditingTag = () => {
    setEditingTagId(null)
    setEditingTagName("")
  }

  // Filter and sort tags
  const getFilteredAndSortedTags = () => {
    let filteredTags = [...mockTags]

    // Filter by search query
    if (searchQuery) {
      filteredTags = filteredTags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Sort tags
    filteredTags.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else {
        return sortOrder === "asc" ? a.count - b.count : b.count - a.count
      }
    })

    return filteredTags
  }

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const filteredTags = getFilteredAndSortedTags()

  return (
    <div className="container py-6 max-w-5xl">
      <div className="flex flex-col space-y-2 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Tags & Categories</h1>
            <p className="text-muted-foreground">Organize and manage your journal entries with tags</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => router.push("/entries")}>
              <Filter className="h-4 w-4" />
              Filter Entries
            </Button>

            <Button size="sm" className="gap-1" onClick={() => document.getElementById("new-tag-input")?.focus()}>
              <Plus className="h-4 w-4" />
              New Tag
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>All Tags</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tags..."
                      className="pl-8 h-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 gap-1">
                        <ArrowUpDown className="h-4 w-4" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSortBy("name")
                          setSortOrder("asc")
                        }}
                      >
                        Name (A-Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSortBy("name")
                          setSortOrder("desc")
                        }}
                      >
                        Name (Z-A)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSortBy("count")
                          setSortOrder("desc")
                        }}
                      >
                        Most Used
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSortBy("count")
                          setSortOrder("asc")
                        }}
                      >
                        Least Used
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium">Loading tags...</p>
                  </div>
                </div>
              ) : filteredTags.length > 0 ? (
                <div className="space-y-4">
                  {filteredTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      {editingTagId === tag.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={editingTagName}
                            onChange={(e) => setEditingTagName(e.target.value)}
                            className="h-9"
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateTag(tag.id)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelEditingTag}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                              <TagIcon className="h-3.5 w-3.5" />
                              {tag.name}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {tag.count} {tag.count === 1 ? "entry" : "entries"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => startEditingTag(tag)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the tag "{tag.name}"? This action cannot be undone.
                                    Entries with this tag will not be deleted, but they will no longer have this tag.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteTag(tag.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {isDeleting && tagToDelete === tag.id ? (
                                      <>
                                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                        Deleting...
                                      </>
                                    ) : (
                                      "Delete Tag"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="rounded-full bg-muted p-3 inline-flex mb-4">
                    <TagIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No tags found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? `No tags matching "${searchQuery}"` : "You haven't created any tags yet"}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tag Usage</CardTitle>
              <CardDescription>Visualization of your most frequently used tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] relative">
                <svg width="100%" height="100%" viewBox="0 0 800 300">
                  {/* Background grid */}
                  <g stroke="currentColor" strokeOpacity="0.1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <line key={`h-${i}`} x1="100" y1={i * 50 + 25} x2="750" y2={i * 50 + 25} />
                    ))}
                  </g>

                  {/* X and Y axes */}
                  <line x1="100" y1="275" x2="750" y2="275" stroke="currentColor" strokeWidth="1" />
                  <line x1="100" y1="25" x2="100" y2="275" stroke="currentColor" strokeWidth="1" />

                  {/* Y-axis labels */}
                  {[0, 5, 10, 15, 20, 25].map((value, i) => (
                    <text key={value} x="90" y={275 - i * 50} textAnchor="end" dominantBaseline="middle" fontSize="12">
                      {value}
                    </text>
                  ))}

                  {/* Bars */}
                  {mockTags.slice(0, 10).map((tag, i) => (
                    <g key={tag.id}>
                      <rect
                        x={120 + i * 65}
                        y={275 - tag.count * 10}
                        width="40"
                        height={tag.count * 10}
                        fill="url(#barGradient)"
                        rx="4"
                      />
                      <text x={140 + i * 65} y="290" textAnchor="middle" fontSize="12">
                        {tag.name.length > 8 ? tag.name.substring(0, 6) + "..." : tag.name}
                      </text>
                      <text
                        x={140 + i * 65}
                        y={265 - tag.count * 10}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {tag.count}
                      </text>
                    </g>
                  ))}

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Create New Tag</CardTitle>
              <CardDescription>Add a new tag to organize your journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="new-tag-input" className="text-sm font-medium">
                    Tag Name
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="new-tag-input"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                    />
                    <Button onClick={handleCreateTag} disabled={isCreating || !newTagName.trim()}>
                      {isCreating ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Tag Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Use specific, descriptive tags</li>
                    <li>• Be consistent with naming conventions</li>
                    <li>• Create tags for emotions, topics, and contexts</li>
                    <li>• Use tags to track goals and habits</li>
                    <li>• Regularly review and clean up unused tags</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tag Categories</CardTitle>
              <CardDescription>Organize your tags into categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Emotions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      happy
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      sad
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      anxious
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      grateful
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      work
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      family
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      health
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      relationships
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      exercise
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      meditation
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      reading
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      travel
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Manage Categories
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

