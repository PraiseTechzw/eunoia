/**
 * Simulation Service
 *
 * This service provides realistic simulations of backend functionality
 * for demonstration purposes. In a production environment, these would
 * be replaced with actual API calls to your backend services.
 */

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { entries, users, tags } from "./mock-data"

// Simulated latency to make the app feel realistic
const SIMULATED_LATENCY = {
  SHORT: () => Math.random() * 300 + 100, // 100-400ms
  MEDIUM: () => Math.random() * 500 + 500, // 500-1000ms
  LONG: () => Math.random() * 1000 + 1000, // 1000-2000ms
}

// Simulated success rate to demonstrate error handling
const SIMULATED_SUCCESS_RATE = 0.95 // 95% success rate

// Utility to simulate network requests
const simulateRequest = async <T>(\
  data: T, 
  latency: () => number = SIMULATED_LATENCY.MEDIUM,
  successRate: number = SIMULATED_SUCCESS_RATE
)
: Promise<T> =>
{
  await new Promise((resolve) => setTimeout(resolve, latency()))

  if (Math.random() > successRate) {
    throw new Error("Simulated network error. Please try again.")
  }

  return data;
}

// Authentication simulation
export const authService = {
  login: async (email: string, password: string) => {
    const user = users.find((u) => u.email === email)

    if (!user || user.password !== password) {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY.MEDIUM()))
      throw new Error("Invalid email or password")
    }

    return simulateRequest({
      user: { ...user, password: undefined },
      token: `simulated-jwt-token-${Date.now()}`,
    })
  },

  register: async (userData: any) => {
    // Check if email already exists
    if (users.some((u) => u.email === userData.email)) {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY.MEDIUM()))
      throw new Error("Email already in use")
    }

    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
    }

    // In a real app, we would save this user to the database
    // For simulation, we'll just return the user
    return simulateRequest({
      user: { ...newUser, password: undefined },
      token: `simulated-jwt-token-${Date.now()}`,
    })
  },

  verifyBiometric: async () => {
    return simulateRequest({ success: true, verified: true })
  },

  resetPassword: async (email: string) => {
    const user = users.find((u) => u.email === email)

    if (!user) {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY.MEDIUM()))
      throw new Error("Email not found")
    }

    return simulateRequest({ success: true, message: "Password reset email sent" })
  },
}

// Journal entries simulation
export const entriesService = {
  getEntries: async (filters: any = {}) => {
    let filteredEntries = [...entries]

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredEntries = filteredEntries.filter(
        (entry) => entry.title.toLowerCase().includes(searchLower) || entry.content.toLowerCase().includes(searchLower),
      )
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredEntries = filteredEntries.filter((entry) => filters.tags.some((tag: string) => entry.tags.includes(tag)))
    }

    if (filters.dateRange) {
      const { from, to } = filters.dateRange
      if (from) {
        filteredEntries = filteredEntries.filter((entry) => new Date(entry.createdAt) >= new Date(from))
      }
      if (to) {
        filteredEntries = filteredEntries.filter((entry) => new Date(entry.createdAt) <= new Date(to))
      }
    }

    if (filters.sentiment) {
      filteredEntries = filteredEntries.filter((entry) => entry.sentiment === filters.sentiment)
    }

    // Sort entries
    if (filters.sortBy) {
      filteredEntries.sort((a, b) => {
        if (filters.sortBy === "date") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        if (filters.sortBy === "sentiment") {
          return b.sentiment - a.sentiment
        }
        return 0
      })
    } else {
      // Default sort by date
      filteredEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return simulateRequest({
      entries: filteredEntries,
      total: filteredEntries.length,
    })
  },

  getEntry: async (id: string) => {
    const entry = entries.find((e) => e.id === id)

    if (!entry) {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY.SHORT()))
      throw new Error("Entry not found")
    }

    return simulateRequest(entry)
  },

  createEntry: async (entryData: any) => {
    const newEntry = {
      id: `entry-${Date.now()}`,
      ...entryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Simulate sentiment analysis
      sentiment: Math.random() * 2 - 1, // -1 to 1
    }

    // In a real app, we would save this entry to the database
    return simulateRequest(newEntry, SIMULATED_LATENCY.MEDIUM)
  },

  updateEntry: async (id: string, entryData: any) => {
    const entryIndex = entries.findIndex((e) => e.id === id)

    if (entryIndex === -1) {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY.SHORT()))
      throw new Error("Entry not found")
    }

    const updatedEntry = {
      ...entries[entryIndex],
      ...entryData,
      updatedAt: new Date().toISOString(),
    }

    // In a real app, we would update this entry in the database
    return simulateRequest(updatedEntry)
  },

  deleteEntry: async (id: string) => {
    const entryIndex = entries.findIndex((e) => e.id === id)

    if (entryIndex === -1) {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY.SHORT()))
      throw new Error("Entry not found")
    }

    // In a real app, we would delete this entry from the database
    return simulateRequest({ success: true })
  },

  getStats: async () => {
    // Calculate some realistic stats from our entries
    const totalEntries = entries.length
    const entriesThisWeek = entries.filter((e) => {
      const entryDate = new Date(e.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return entryDate >= weekAgo
    }).length

    const entriesThisMonth = entries.filter((e) => {
      const entryDate = new Date(e.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return entryDate >= monthAgo
    }).length

    const averageWordsPerEntry = Math.round(
      entries.reduce((sum, entry) => sum + entry.content.split(/\s+/).length, 0) / totalEntries,
    )

    const sentimentDistribution = {
      positive: entries.filter((e) => e.sentiment > 0.3).length,
      neutral: entries.filter((e) => e.sentiment >= -0.3 && e.sentiment <= 0.3).length,
      negative: entries.filter((e) => e.sentiment < -0.3).length,
    }

    const streakData = {
      currentStreak: Math.floor(Math.random() * 10) + 1,
      longestStreak: Math.floor(Math.random() * 30) + 10,
      totalDaysJournaled: Math.floor(totalEntries * 0.8), // Assuming some days have multiple entries
    }

    return simulateRequest({
      totalEntries,
      entriesThisWeek,
      entriesThisMonth,
      averageWordsPerEntry,
      sentimentDistribution,
      streakData,
      topTags: tags.slice(0, 5).map((tag) => ({
        name: tag,
        count: Math.floor(Math.random() * 20) + 1,
      })),
    })
  },
}

// AI features simulation
export const aiService = {
  analyzeText: async (text: string) => {
    // Simulate NLP analysis
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY.LONG()))

    // Generate random sentiment between -1 and 1
    const sentiment = Math.random() * 2 - 1

    // Extract keywords (simulated)
    const words = text.split(/\s+/).filter((word) => word.length > 4)
    const keywords = Array.from(new Set(words.sort(() => Math.random() - 0.5).slice(0, Math.min(10, words.length))))

    // Generate topics (simulated)
    const possibleTopics = [
      "work",
      "family",
      "health",
      "relationships",
      "personal growth",
      "travel",
      "finance",
      "creativity",
      "learning",
      "spirituality",
    ]
    const topics = possibleTopics.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1)

    return {
      sentiment,
      keywords,
      topics,
      entities: [], // Would contain named entities in a real implementation
      summary: text.length > 200 ? text.substring(0, 200) + "..." : text,
    }
  },

  getSimilarEntries: async (entryId: string) => {
    // In a real app, this would use vector similarity search or other ML techniques
    // For simulation, we'll just return random entries
    const currentEntry = entries.find((e) => e.id === entryId)
    if (!currentEntry) {
      throw new Error("Entry not found")
    }

    // Filter out the current entry and get random entries
    const otherEntries = entries.filter((e) => e.id !== entryId)
    const randomEntries = otherEntries.sort(() => Math.random() - 0.5).slice(0, 3)

    return simulateRequest(
      randomEntries.map((entry) => ({
        ...entry,
        similarity: (Math.random() * 0.5 + 0.5).toFixed(2), // 0.5-1.0 similarity score
      })),
    )
  },

  generateWritingPrompt: async (theme?: string) => {
    try {
      // Use AI SDK to generate a writing prompt
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate a thoughtful journaling prompt${theme ? ` about ${theme}` : ""} that encourages self-reflection and personal growth. The prompt should be 1-2 sentences long.`,
      })

      return { prompt: text }
    } catch (error) {
      console.error("Error generating prompt with AI SDK:", error)

      // Fallback to predefined prompts if AI generation fails
      const predefinedPrompts = [
        "What made you smile today and why?",
        "Describe a challenge you're facing and three possible ways to overcome it.",
        "If you could change one thing about your day today, what would it be?",
        "What are you grateful for right now? List at least three things.",
        "Describe a recent interaction that affected you emotionally. How did you respond?",
        "What's something you've been avoiding? What's one small step you could take?",
        "Write a letter to your future self one year from now.",
        "What boundaries do you need to set or maintain in your life right now?",
        "Describe a recent accomplishment and how it made you feel.",
        "What does your ideal day look like? Be specific about the details.",
      ]

      const randomPrompt = predefinedPrompts[Math.floor(Math.random() * predefinedPrompts.length)]
      return { prompt: randomPrompt }
    }
  },

  getContentSuggestion: async (currentText: string) => {
    try {
      // Use AI SDK to generate a content suggestion based on current text
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Based on the following journal entry, provide a thoughtful suggestion for what the writer might want to explore or reflect on next (in 1-2 sentences):\n\n${currentText}`,
      })

      return { suggestion: text }
    } catch (error) {
      console.error("Error generating content suggestion with AI SDK:", error)

      // Fallback suggestions
      const fallbackSuggestions = [
        "Consider exploring how this connects to your long-term goals.",
        "You might want to reflect on how this made you feel emotionally.",
        "Think about what you learned from this experience.",
        "Consider writing about any patterns you notice in your reactions.",
        "You could explore how this relates to your core values.",
      ]

      const randomSuggestion = fallbackSuggestions[Math.floor(Math.random() * fallbackSuggestions.length)]
      return { suggestion: randomSuggestion }
    }
  },
}

// Tags service simulation
export const tagsService = {
  getTags: async () => {
    return simulateRequest(
      tags.map((tag) => ({
        name: tag,
        count: Math.floor(Math.random() * 20) + 1,
      })),
    )
  },

  createTag: async (name: string) => {
    if (tags.includes(name)) {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY.SHORT()))
      throw new Error("Tag already exists")
    }

    // In a real app, we would save this tag to the database
    return simulateRequest({ name, count: 1 })
  },

  deleteTag: async (name: string) => {
    if (!tags.includes(name)) {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY.SHORT()))
      throw new Error("Tag not found")
    }

    // In a real app, we would delete this tag from the database
    return simulateRequest({ success: true })
  },
}

// Reminders service simulation
export const remindersService = {
  getReminders: async () => {
    // Generate some simulated reminders
    const reminders = [
      {
        id: "reminder-1",
        time: "08:00",
        days: ["monday", "wednesday", "friday"],
        message: "Morning journal reflection",
        enabled: true,
      },
      {
        id: "reminder-2",
        time: "20:00",
        days: ["everyday"],
        message: "Evening gratitude practice",
        enabled: true,
      },
      {
        id: "reminder-3",
        time: "12:00",
        days: ["sunday"],
        message: "Weekly planning session",
        enabled: false,
      },
    ]

    return simulateRequest(reminders)
  },

  createReminder: async (reminderData: any) => {
    const newReminder = {
      id: `reminder-${Date.now()}`,
      ...reminderData,
      createdAt: new Date().toISOString(),
    }

    // In a real app, we would save this reminder to the database
    return simulateRequest(newReminder)
  },

  updateReminder: async (id: string, reminderData: any) => {
    // Simulate updating a reminder
    return simulateRequest({
      id,
      ...reminderData,
      updatedAt: new Date().toISOString(),
    })
  },

  deleteReminder: async (id: string) => {
    // Simulate deleting a reminder
    return simulateRequest({ success: true })
  },
}

// User preferences simulation
export const preferencesService = {
  getPreferences: async () => {
    // Simulate user preferences
    return simulateRequest({
      theme: "system",
      fontSize: "medium",
      language: "en",
      emailNotifications: true,
      pushNotifications: false,
      privacySettings: {
        isPrivate: true,
        allowSharing: false,
      },
    })
  },

  updatePreferences: async (preferences: any) => {
    // Simulate updating preferences
    return simulateRequest({
      ...preferences,
      updatedAt: new Date().toISOString(),
    })
  },
}

// Export all services
export const simulationService = {
  auth: authService,
  entries: entriesService,
  ai: aiService,
  tags: tagsService,
  reminders: remindersService,
  preferences: preferencesService,
}

export default simulationService

