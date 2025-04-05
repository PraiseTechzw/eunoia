"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft, Sparkles, Send, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIAssistantProps {
  currentText: string
  onInsert: (aiContent: string) => void
  onCancel: () => void
}

// Predefined AI prompts
const predefinedPrompts = [
  {
    id: "1",
    title: "Continue writing",
    prompt: "Continue the text with a natural flow",
    icon: "Sparkles",
  },
  {
    id: "2",
    title: "Improve writing",
    prompt: "Improve the writing style and clarity",
    icon: "Wand2",
  },
  {
    id: "3",
    title: "Summarize",
    prompt: "Summarize the key points",
    icon: "FileText",
  },
  {
    id: "4",
    title: "Expand on topic",
    prompt: "Expand on the main topic with more details",
    icon: "Maximize",
  },
  {
    id: "5",
    title: "Add examples",
    prompt: "Add relevant examples to illustrate the points",
    icon: "ListChecks",
  },
  {
    id: "6",
    title: "Make more concise",
    prompt: "Make the text more concise without losing meaning",
    icon: "Minimize",
  },
]

export function AIAssistant({ currentText, onInsert, onCancel }: AIAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedText, setGeneratedText] = useState("")
  const [copied, setCopied] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const { t } = useTranslation()
  const { toast } = useToast()

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [copied])

  // Handle predefined prompt selection
  const handlePromptSelect = (promptId: string) => {
    const selected = predefinedPrompts.find((p) => p.id === promptId)
    if (selected) {
      setPrompt(selected.prompt)
      setSelectedPrompt(promptId)
    }
  }

  // Simulate AI text generation
  const generateText = () => {
    if (!prompt.trim()) {
      toast({
        title: t("editor.aiAssistant.emptyPrompt"),
        description: t("editor.aiAssistant.enterPrompt"),
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGeneratedText("")
    setGenerationProgress(0)

    // Simulate text generation with streaming effect
    let progress = 0
    const interval = setInterval(() => {
      progress += 1
      setGenerationProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setIsGenerating(false)

        // Generate text based on prompt and current text
        let result = ""

        // Simple simulation of different AI responses based on prompt type
        if (prompt.toLowerCase().includes("continue")) {
          result = simulateContinueWriting(currentText)
        } else if (prompt.toLowerCase().includes("improve")) {
          result = simulateImproveWriting(currentText)
        } else if (prompt.toLowerCase().includes("summarize")) {
          result = simulateSummarize(currentText)
        } else if (prompt.toLowerCase().includes("expand")) {
          result = simulateExpandTopic(currentText)
        } else if (prompt.toLowerCase().includes("example")) {
          result = simulateAddExamples(currentText)
        } else if (prompt.toLowerCase().includes("concise")) {
          result = simulateConciseText(currentText)
        } else {
          // Generic response
          result = simulateGenericResponse(currentText, prompt)
        }

        // Calculate word count
        const words = result.split(/\s+/).filter(Boolean).length
        setWordCount(words)

        // Set the generated text with a typing effect
        let i = 0
        const typing = setInterval(() => {
          setGeneratedText(result.substring(0, i))
          i += 5 // Increase by 5 characters at a time for faster typing

          if (i > result.length) {
            clearInterval(typing)
          }
        }, 10)
      }
    }, 30)
  }

  // Simulation functions for different AI responses
  const simulateContinueWriting = (text: string) => {
    const lastWords = text.split(/\s+/).slice(-10).join(" ")

    const continuations = [
      "This approach has several advantages. First, it allows for greater flexibility in how we organize our thoughts and ideas. Second, it provides a framework for understanding complex relationships between different concepts. Finally, it helps us identify patterns that might otherwise go unnoticed.",
      "The implications of this are far-reaching. When we consider how these patterns affect our daily lives, we begin to see connections that weren't apparent before. This perspective shift can lead to profound insights about ourselves and our relationships with others.",
      "Moving forward, I plan to implement these strategies in my daily routine. By focusing on small, consistent improvements rather than dramatic changes, I expect to see gradual but meaningful progress. The key will be maintaining patience and persistence through the inevitable challenges.",
      "This realization has changed how I approach problem-solving. Instead of seeking perfect solutions, I now focus on making incremental progress and learning from each attempt. This mindset has reduced my stress and actually improved my results.",
    ]

    return continuations[Math.floor(Math.random() * continuations.length)]
  }

  const simulateImproveWriting = (text: string) => {
    // Simulate improved version of the text
    return "I've carefully analyzed your writing and enhanced it for clarity and impact. The revised text maintains your original ideas while improving structure, word choice, and flow. Sentences are now more concise and powerful, with stronger transitions between concepts. Technical terms have been clarified where needed, and the overall tone is more consistent and engaging."
  }

  const simulateSummarize = (text: string) => {
    return "The key points from your text include:\n\n1. The importance of consistent practice in developing new skills\n2. How small daily improvements compound over time\n3. The relationship between deliberate effort and meaningful progress\n4. Strategies for overcoming obstacles when motivation decreases\n\nThe central theme emphasizes that sustainable growth comes from systematic approaches rather than sporadic intense efforts."
  }

  const simulateExpandTopic = (text: string) => {
    return "To expand on your main topic, I've added additional context, supporting evidence, and deeper analysis. The expanded section explores historical precedents, current research findings, and practical applications. I've included relevant statistics that strengthen your argument and addressed potential counterpoints to create a more comprehensive discussion. This expansion maintains your original perspective while providing readers with a more thorough understanding of the subject."
  }

  const simulateAddExamples = (text: string) => {
    return "Here are some illustrative examples to support your points:\n\n1. **Real-world application**: When Tesla implemented this approach in their manufacturing process, they saw a 37% increase in efficiency within six months.\n\n2. **Historical precedent**: During the 1950s, researchers at Bell Labs used similar methods to develop breakthrough technologies like the transistor.\n\n3. **Personal case study**: Consider Sarah, a project manager who applied these principles to her team's workflow and reduced completion time by 40% while improving quality metrics.\n\nThese examples demonstrate how the concepts work across different contexts and scales."
  }

  const simulateConciseText = (text: string) => {
    return "I've streamlined your text while preserving its core message. Redundant phrases have been eliminated, complex sentences simplified, and unnecessary qualifiers removed. The revised version is approximately 30% shorter but retains all essential information and maintains your authentic voice. This concise version will be more engaging for readers and more effective at communicating your key points."
  }

  const simulateGenericResponse = (text: string, prompt: string) => {
    return `Based on your prompt "${prompt}", I've generated this response that aims to address your specific request. This text is tailored to complement your existing content while adding value through new perspectives and information. I've maintained consistency with your writing style and focused on delivering exactly what you asked for in the most helpful way possible.`
  }

  // Copy generated text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText)
    setCopied(true)

    toast({
      title: t("editor.aiAssistant.copied"),
      description: t("editor.aiAssistant.copiedDescription"),
      duration: 2000,
    })
  }

  // Insert generated text
  const handleInsert = () => {
    onInsert(generatedText)

    toast({
      title: t("editor.aiAssistant.inserted"),
      description: t("editor.aiAssistant.insertedDescription"),
      duration: 2000,
    })
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("editor.aiAssistant.back")}
          </Button>
          <h3 className="text-lg font-medium">{t("editor.aiAssistant.title")}</h3>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("editor.aiAssistant.currentText")}</Label>
            <div className="border rounded-md p-3 bg-muted/30 h-[200px] overflow-auto">
              <p className="whitespace-pre-wrap text-sm">{currentText || t("editor.aiAssistant.noText")}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("editor.aiAssistant.promptLabel")}</Label>
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("editor.aiAssistant.promptPlaceholder")}
                disabled={isGenerating}
              />
              <Button onClick={generateText} disabled={isGenerating || !prompt.trim()} className="gap-1">
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {Math.floor(generationProgress)}%
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t("editor.aiAssistant.generate")}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("editor.aiAssistant.suggestedPrompts")}</Label>
            <div className="flex flex-wrap gap-2">
              {predefinedPrompts.map((p) => (
                <Button
                  key={p.id}
                  variant={selectedPrompt === p.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePromptSelect(p.id)}
                  disabled={isGenerating}
                  className="gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  {p.title}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>{t("editor.aiAssistant.generatedText")}</Label>
            {generatedText && (
              <div className="text-xs text-muted-foreground">
                {wordCount} {t("editor.words")}
              </div>
            )}
          </div>

          <div className="relative">
            <Textarea
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
              placeholder={
                isGenerating ? t("editor.aiAssistant.generating") : t("editor.aiAssistant.generatedTextPlaceholder")
              }
              className="min-h-[300px] resize-none"
              readOnly={isGenerating}
            />

            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-4 border-muted" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-teal-500" />
                  </div>
                  <p className="text-sm font-medium">{t("editor.aiAssistant.thinking")}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(generationProgress)}% {t("editor.aiAssistant.complete")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {generatedText && !isGenerating && (
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-1">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    {t("editor.aiAssistant.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {t("editor.aiAssistant.copy")}
                  </>
                )}
              </Button>

              <Button size="sm" onClick={handleInsert} className="gap-1">
                <Sparkles className="h-4 w-4" />
                {t("editor.aiAssistant.insert")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

