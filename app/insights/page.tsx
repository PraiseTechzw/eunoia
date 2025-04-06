"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { SentimentTimeline } from "@/components/advanced-search/sentiment-timeline"
import { WordCloud } from "@/components/advanced-search/word-cloud"
import { mockEntries, mockInsights, mockTopics } from "@/lib/mock-data"
import { useSimulation } from "@/hooks/use-simulation"
import { useToast } from "@/hooks/use-toast"
import { LineChart, Sparkles, RefreshCw, Brain, TrendingUp, Tag, Download } from "lucide-react"

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  // Simulate AI analysis
  const {
    execute: analyzeJournal,
    isLoading: isAnalyzing,
    data: analysisData,
  } = useSimulation<any, [void]>("ai", "analyzeText", false)

  // Generate new insights
  const generateInsights = () => {
    analyzeJournal()

    toast({
      title: "Generating new insights",
      description: "Analyzing your journal entries with AI...",
    })
  }

  // Download insights as PDF
  const downloadInsights = () => {
    toast({
      title: "Downloading insights",
      description: "Your insights report is being prepared...",
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Your insights report has been downloaded.",
      })
    }, 2000)
  }

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex flex-col space-y-2 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Journal Insights</h1>
            <p className="text-muted-foreground">
              AI-powered analysis of your journaling patterns and emotional trends
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadInsights} className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>

            <Button onClick={generateInsights} disabled={isAnalyzing} className="gap-2">
              {isAnalyzing ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh Insights
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="emotions" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            Emotional Trends
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            Topics & Themes
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Patterns & Habits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Emotional Overview</CardTitle>
                <CardDescription>Your emotional trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <SentimentTimeline entries={mockEntries} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Common Topics</CardTitle>
                <CardDescription>Themes and topics from your journal entries</CardDescription>
              </CardHeader>
              <CardContent>
                <WordCloud entries={mockEntries} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">AI-Generated Insights</CardTitle>
              <CardDescription>Personalized observations based on your journaling patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockInsights.slice(0, 6).map((insight) => (
                  <Card key={insight.id} className="overflow-hidden">
                    <div
                      className={`h-1 ${
                        insight.type === "positive"
                          ? "bg-emerald-500"
                          : insight.type === "suggestion"
                            ? "bg-sky-500"
                            : "bg-violet-500"
                      }`}
                    />
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div
                          className={`mt-0.5 rounded-full p-1 ${
                            insight.type === "positive"
                              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                              : insight.type === "suggestion"
                                ? "bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300"
                                : "bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300"
                          }`}
                        >
                          <Sparkles className="h-3 w-3" />
                        </div>
                        <div>
                          <p className="text-sm">{insight.text}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {insight.topics.map((topic) => (
                              <span
                                key={topic}
                                className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Emotional Trends</CardTitle>
                <CardDescription>How your emotions have changed over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <SentimentTimeline entries={mockEntries} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Emotion Distribution</CardTitle>
                <CardDescription>Breakdown of your emotional states</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 rounded-full border-8 border-muted" />
                    <div
                      className="absolute inset-0 rounded-full border-8 border-t-emerald-500 border-r-sky-500 border-b-amber-500 border-l-rose-500"
                      style={{ borderRadius: "100%" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold">68%</span>
                      <span className="text-xs text-muted-foreground">Positive</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium">Primary Emotion</span>
                      <span className="text-emerald-500 font-bold">Joy</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium">Secondary Emotion</span>
                      <span className="text-sky-500 font-bold">Contentment</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Emotional Triggers</CardTitle>
              <CardDescription>Topics and contexts that influence your emotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Positive Triggers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Family time (12 mentions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Exercise (9 mentions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Creative projects (7 mentions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Nature walks (6 mentions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Reading (5 mentions)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      Neutral Contexts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span>Daily routines (14 mentions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span>Planning (8 mentions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span>Household tasks (7 mentions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span>Commuting (5 mentions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span>Shopping (4 mentions)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-300">
                      Negative Triggers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span>Work deadlines (11 mentions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span>Conflicts (8 mentions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span>Financial stress (7 mentions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span>Lack of sleep (6 mentions)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Topic Cloud</CardTitle>
                <CardDescription>Visual representation of your journal topics</CardDescription>
              </CardHeader>
              <CardContent>
                <WordCloud entries={mockEntries} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Topic Distribution</CardTitle>
                <CardDescription>Breakdown of topics by frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopics.slice(0, 5).map((topic) => (
                    <div key={topic.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{topic.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {Object.values(topic.frequency).reduce((a, b) => a + b, 0)} mentions
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            topic.id === "1"
                              ? "bg-emerald-500"
                              : topic.id === "2"
                                ? "bg-sky-500"
                                : topic.id === "3"
                                  ? "bg-violet-500"
                                  : topic.id === "4"
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                          }`}
                          style={{
                            width: `${(Object.values(topic.frequency).reduce((a, b) => a + b, 0) / 50) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Topic Correlations</CardTitle>
              <CardDescription>How different topics relate to each other in your journal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <svg width="600" height="400" viewBox="0 0 600 400">
                  {/* Background grid */}
                  <g stroke="currentColor" strokeOpacity="0.1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <line key={`h-${i}`} x1="0" y1={i * 40 + 20} x2="600" y2={i * 40 + 20} />
                    ))}
                    {Array.from({ length: 15 }).map((_, i) => (
                      <line key={`v-${i}`} x1={i * 40 + 20} y1="0" x2={i * 40 + 20} y2="400" />
                    ))}
                  </g>

                  {/* Nodes */}
                  <circle cx="300" cy="200" r="40" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
                  <text x="300" y="200" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="bold">
                    Work
                  </text>

                  <circle cx="450" cy="150" r="35" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9" strokeWidth="2" />
                  <text x="450" y="150" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="bold">
                    Health
                  </text>

                  <circle cx="200" cy="120" r="30" fill="rgba(139, 92, 246, 0.2)" stroke="#8b5cf6" strokeWidth="2" />
                  <text x="200" y="120" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="bold">
                    Family
                  </text>

                  <circle cx="150" cy="250" r="25" fill="rgba(236, 72, 153, 0.2)" stroke="#ec4899" strokeWidth="2" />
                  <text x="150" y="250" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="bold">
                    Creativity
                  </text>

                  <circle cx="400" cy="300" r="30" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" />
                  <text x="400" y="300" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="bold">
                    Finance
                  </text>

                  {/* Connections */}
                  <line x1="300" y1="200" x2="450" y2="150" stroke="#10b981" strokeWidth="2" strokeOpacity="0.6" />
                  <line x1="300" y1="200" x2="200" y2="120" stroke="#10b981" strokeWidth="2" strokeOpacity="0.6" />
                  <line x1="300" y1="200" x2="150" y2="250" stroke="#10b981" strokeWidth="1" strokeOpacity="0.4" />
                  <line x1="300" y1="200" x2="400" y2="300" stroke="#10b981" strokeWidth="3" strokeOpacity="0.8" />
                  <line x1="450" y1="150" x2="200" y2="120" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.4" />
                  <line x1="200" y1="120" x2="150" y2="250" stroke="#8b5cf6" strokeWidth="2" strokeOpacity="0.6" />
                  <line x1="400" y1="300" x2="450" y2="150" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Journaling Patterns</CardTitle>
                <CardDescription>When and how you journal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Time of Day</h4>
                    <div className="h-[150px] relative">
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between h-[120px]">
                        {["Morning", "Afternoon", "Evening", "Night"].map((time, i) => (
                          <div key={time} className="flex flex-col items-center w-1/4">
                            <div
                              className="w-12 bg-primary/80 rounded-t-md"
                              style={{
                                height: `${[70, 30, 90, 40][i]}px`,
                                opacity: 0.7 + i * 0.1,
                              }}
                            />
                            <span className="text-xs mt-1">{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Day of Week</h4>
                    <div className="h-[150px] relative">
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between h-[120px]">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                          <div key={day} className="flex flex-col items-center">
                            <div
                              className="w-6 bg-primary/80 rounded-t-md"
                              style={{
                                height: `${[60, 50, 45, 70, 80, 100, 90][i]}px`,
                                opacity: 0.7 + i * 0.05,
                              }}
                            />
                            <span className="text-xs mt-1">{day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Entry Length Trends</CardTitle>
                <CardDescription>How your writing volume has changed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <svg width="400" height="300" viewBox="0 0 400 300">
                    {/* Background grid */}
                    <g stroke="currentColor" strokeOpacity="0.1">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <line key={`h-${i}`} x1="40" y1={i * 50 + 25} x2="380" y2={i * 50 + 25} />
                      ))}
                      {Array.from({ length: 7 }).map((_, i) => (
                        <line key={`v-${i}`} x1={i * 50 + 40} y1="25" x2={i * 50 + 40} y2="275" />
                      ))}
                    </g>

                    {/* X and Y axes */}
                    <line x1="40" y1="275" x2="380" y2="275" stroke="currentColor" strokeWidth="1" />
                    <line x1="40" y1="25" x2="40" y2="275" stroke="currentColor" strokeWidth="1" />

                    {/* X-axis labels */}
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => (
                      <text key={month} x={i * 50 + 65} y="295" textAnchor="middle" fontSize="10">
                        {month}
                      </text>
                    ))}

                    {/* Y-axis labels */}
                    {["0", "100", "200", "300", "400"].map((value, i) => (
                      <text
                        key={value}
                        x="30"
                        y={275 - i * 50}
                        textAnchor="end"
                        dominantBaseline="middle"
                        fontSize="10"
                      >
                        {value}
                      </text>
                    ))}

                    {/* Line chart */}
                    <path
                      d="M65,225 L115,200 L165,220 L215,150 L265,100 L315,120"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />

                    {/* Data points */}
                    {[225, 200, 220, 150, 100, 120].map((y, i) => (
                      <circle key={i} cx={i * 50 + 65} cy={y} r="4" fill="#10b981" />
                    ))}

                    {/* Trend line */}
                    <path d="M65,230 L315,130" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" />

                    {/* Legend */}
                    <circle cx="320" cy="30" r="4" fill="#10b981" />
                    <text x="330" y="30" dominantBaseline="middle" fontSize="10">
                      Word count
                    </text>
                    <line x1="320" y1="50" x2="330" y2="50" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" />
                    <text x="335" y="50" dominantBaseline="middle" fontSize="10">
                      Trend
                    </text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Habit Correlations</CardTitle>
              <CardDescription>How your journaling relates to other habits and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Exercise & Mood</h4>
                      <span className="text-xs font-bold text-emerald-500">+78%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Days with exercise show 78% higher positive sentiment scores
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: "78%" }} />
                      </div>
                      <span className="text-xs font-medium">Strong</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Sleep Quality</h4>
                      <span className="text-xs font-bold text-sky-500">+62%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Better sleep correlates with more positive journal entries
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: "62%" }} />
                      </div>
                      <span className="text-xs font-medium">Moderate</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Social Activity</h4>
                      <span className="text-xs font-bold text-violet-500">+45%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Social interactions correlate with more detailed entries
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: "45%" }} />
                      </div>
                      <span className="text-xs font-medium">Moderate</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Meditation</h4>
                      <span className="text-xs font-bold text-amber-500">+53%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Meditation practice correlates with more reflective content
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: "53%" }} />
                      </div>
                      <span className="text-xs font-medium">Moderate</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Nature Time</h4>
                      <span className="text-xs font-bold text-emerald-500">+81%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Time in nature strongly correlates with positive entries
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: "81%" }} />
                      </div>
                      <span className="text-xs font-medium">Strong</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Screen Time</h4>
                      <span className="text-xs font-bold text-rose-500">-37%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Higher screen time correlates with shorter, less detailed entries
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: "37%" }} />
                      </div>
                      <span className="text-xs font-medium">Weak</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

