"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  HelpCircle,
  Book,
  MessageCircle,
  Video,
  ChevronRight,
  Mail,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("faq")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const { toast } = useToast()

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a search query",
        description: "Enter what you're looking for to search the help center.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Searching...",
      description: `Searching for "${searchQuery}" in the help center.`,
    })

    // In a real app, this would search the help center
    // For now, we'll just simulate a search
    setTimeout(() => {
      setActiveTab("faq")
      toast({
        title: "Search results",
        description: `Found 3 results for "${searchQuery}".`,
      })
    }, 1000)
  }

  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: "Message sent",
      description: "Your message has been sent to our support team. We'll get back to you soon.",
    })

    // Reset form
    const form = e.target as HTMLFormElement
    form.reset()
  }

  // Handle feedback
  const handleFeedback = (helpful: boolean) => {
    setFeedbackSubmitted(true)

    toast({
      title: helpful ? "Thank you for your feedback!" : "We're sorry to hear that",
      description: helpful ? "We're glad this information was helpful." : "We'll work on improving our help center.",
    })
  }

  return (
    <div className="container py-6 max-w-5xl">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Find answers to common questions and get support</p>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help topics..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="faq" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-1">
            <Book className="h-4 w-4" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-1">
            <Video className="h-4 w-4" />
            Video Tutorials
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            Contact Us
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to the most common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I create a new journal entry?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>To create a new journal entry, follow these steps:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Navigate to the "Journal Entries" page from the sidebar</li>
                        <li>Click the "New Entry" button in the top right corner</li>
                        <li>Enter a title for your entry</li>
                        <li>Write your journal content in the editor</li>
                        <li>Add tags if desired</li>
                        <li>Click "Save Entry" when you're done</li>
                      </ol>
                      <p>
                        You can also create a new entry directly from the dashboard by clicking the "New Entry" button.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How does the AI-powered analysis work?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>
                        Our AI-powered analysis uses natural language processing to analyze your journal entries and
                        provide insights about your writing patterns, emotional trends, and recurring themes.
                      </p>
                      <p>The AI analyzes your entries to:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Identify emotional patterns and sentiment trends over time</li>
                        <li>Recognize recurring topics and themes in your writing</li>
                        <li>Suggest connections between different entries</li>
                        <li>Provide personalized insights based on your journaling habits</li>
                      </ul>
                      <p>
                        All analysis is performed securely and privately. Your data is never shared with third parties,
                        and you can disable AI analysis in your privacy settings if you prefer.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I use templates for my entries?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Templates help you structure your journal entries with pre-defined prompts and sections.</p>
                      <p>To use a template:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Go to the "Templates" page from the sidebar</li>
                        <li>Browse the available templates or search for a specific type</li>
                        <li>Click on a template to view its details</li>
                        <li>Click "Use Template" to create a new entry with this template</li>
                        <li>The editor will open with the template content pre-filled</li>
                        <li>Customize the content and save your entry</li>
                      </ol>
                      <p>
                        You can also create your own custom templates by clicking "New Template" on the Templates page.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How secure is my journal data?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>
                        We take the security and privacy of your journal data very seriously. Your data is protected
                        with multiple layers of security:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>End-to-end encryption for all journal entries</li>
                        <li>Secure authentication with optional two-factor authentication</li>
                        <li>Regular security audits and penetration testing</li>
                        <li>Data is stored in secure, encrypted databases</li>
                        <li>Optional biometric lock for the mobile app</li>
                      </ul>
                      <p>
                        You have complete control over your data privacy in the Settings page, including options to make
                        your journal private, control sharing permissions, and manage how your data is used for AI
                        analysis.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I export my journal entries?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Yes, you can export your journal entries in multiple formats:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Go to "Settings" in the sidebar</li>
                        <li>Select the "Data" tab</li>
                        <li>
                          Under "Export Data," choose your preferred format:
                          <ul className="list-disc list-inside ml-6 mt-1">
                            <li>JSON (for backup or importing to another system)</li>
                            <li>PDF (for reading or printing)</li>
                            <li>Markdown (for plain text with formatting)</li>
                          </ul>
                        </li>
                        <li>Click the export button for your chosen format</li>
                        <li>Save the file to your device when prompted</li>
                      </ol>
                      <p>
                        You can export all entries or filter by date range, tags, or other criteria before exporting.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {!feedbackSubmitted && (
                <div className="mt-8 pt-4 border-t">
                  <p className="text-sm text-center mb-2">Was this information helpful?</p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => handleFeedback(true)} className="gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      Yes, helpful
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleFeedback(false)} className="gap-1">
                      <ThumbsDown className="h-4 w-4" />
                      No, not helpful
                    </Button>
                  </div>
                </div>
              )}

              {feedbackSubmitted && (
                <div className="mt-8 pt-4 border-t">
                  <p className="text-sm text-center text-muted-foreground">
                    Thank you for your feedback! We'll use it to improve our help center.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Popular Topics</CardTitle>
              <CardDescription>Browse our most frequently viewed help topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-medium mb-1">Getting Started Guide</h3>
                  <p className="text-sm text-muted-foreground mb-2">Learn the basics of using Eunoia Journal</p>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Read more
                  </Button>
                </div>

                <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-medium mb-1">Advanced Journaling Techniques</h3>
                  <p className="text-sm text-muted-foreground mb-2">Take your journaling practice to the next level</p>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Read more
                  </Button>
                </div>

                <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-medium mb-1">Privacy & Security</h3>
                  <p className="text-sm text-muted-foreground mb-2">How we protect your journal data</p>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Read more
                  </Button>
                </div>

                <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-medium mb-1">AI Features Explained</h3>
                  <p className="text-sm text-muted-foreground mb-2">Understanding the AI-powered insights</p>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Read more
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>User Guides</CardTitle>
              <CardDescription>Step-by-step guides to help you get the most out of Eunoia Journal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <div className="flex items-center p-4 cursor-pointer hover:bg-muted/50">
                    <div className="flex-1">
                      <h3 className="font-medium">Getting Started with Eunoia Journal</h3>
                      <p className="text-sm text-muted-foreground">A complete guide for new users</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="flex items-center p-4 cursor-pointer hover:bg-muted/50">
                    <div className="flex-1">
                      <h3 className="font-medium">Using Templates Effectively</h3>
                      <p className="text-sm text-muted-foreground">How to create and use journal templates</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="flex items-center p-4 cursor-pointer hover:bg-muted/50">
                    <div className="flex-1">
                      <h3 className="font-medium">Advanced Search Techniques</h3>
                      <p className="text-sm text-muted-foreground">
                        Find exactly what you're looking for in your journal
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="flex items-center p-4 cursor-pointer hover:bg-muted/50">
                    <div className="flex-1">
                      <h3 className="font-medium">Understanding AI Insights</h3>
                      <p className="text-sm text-muted-foreground">How to interpret and use AI-generated insights</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="flex items-center p-4 cursor-pointer hover:bg-muted/50">
                    <div className="flex-1">
                      <h3 className="font-medium">Data Privacy & Security</h3>
                      <p className="text-sm text-muted-foreground">How to keep your journal secure and private</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="flex items-center p-4 cursor-pointer hover:bg-muted/50">
                    <div className="flex-1">
                      <h3 className="font-medium">Exporting & Backing Up Your Journal</h3>
                      <p className="text-sm text-muted-foreground">How to export and back up your journal data</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Video Tutorials</CardTitle>
              <CardDescription>Watch step-by-step video guides for using Eunoia Journal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">Getting Started Tutorial</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Learn the basics of using Eunoia Journal in this 5-minute tutorial.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">5:32</span>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">Using AI Insights</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Discover how to use AI-powered insights to enhance your journaling.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">7:15</span>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">Advanced Search Techniques</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Learn how to use advanced search to find specific entries.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">4:48</span>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">Creating Custom Templates</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Learn how to create and use custom journal templates.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">6:22</span>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get in touch with our support team for personalized help</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Your Name
                    </label>
                    <Input id="name" required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input id="email" type="email" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" required />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="gap-1">
                    <Mail className="h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Other Ways to Reach Us</CardTitle>
              <CardDescription>Alternative methods to get support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">Send us an email directly</p>
                  <a href="mailto:support@eunoiajournal.com" className="text-primary hover:underline">
                    support@eunoiajournal.com
                  </a>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-3">Chat with our support team in real-time</p>
                  <Button variant="outline" size="sm">
                    Start Chat
                  </Button>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Community Forum</h3>
                  <p className="text-sm text-muted-foreground mb-3">Get help from our community</p>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Visit Forum
                  </Button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <h3 className="font-medium mb-2">Support Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Our support team is available Monday through Friday, 9am to 5pm Eastern Time. We typically respond to
                  all inquiries within 24 hours during business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

