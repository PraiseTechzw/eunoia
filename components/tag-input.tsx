"use client"

import type React from "react"

import { useState, type KeyboardEvent, useRef } from "react"
import { X, Plus, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TagInputProps {
  tags: string[]
  setTags: (tags: string[]) => void
}

export function TagInput({ tags, setTags }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Suggested tags based on previous entries
  // In a real app, these would come from the user's tag history
  const suggestedTags = [
    "work",
    "family",
    "health",
    "relationships",
    "goals",
    "personal growth",
    "travel",
    "finances",
    "gratitude",
    "challenges",
    "achievements",
    "learning",
    "creativity",
    "spirituality",
    "reflection",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault()
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()])
      }
      setInputValue("")
    }
  }

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setInputValue("")
    setOpen(false)
    inputRef.current?.focus()
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="gap-1">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-1 rounded-full hover:bg-muted p-0.5">
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Add tags..."
          />
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add from suggestions</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="end" side="bottom">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup heading="Suggested Tags">
                  {suggestedTags.map((tag) => (
                    <CommandItem key={tag} onSelect={() => addTag(tag)} className="flex items-center justify-between">
                      <span>{tag}</span>
                      {tags.includes(tag) && <Check className="h-4 w-4 text-green-500" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

