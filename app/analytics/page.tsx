"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockUser } from "@/lib/mock-data"
import { useSimulation } from "@/hooks/use-simulation"
import { useToast } from "@/hooks/use-toast"
import { BarChart2, LineChart, Calendar, Download, FileText, Clock, Tag, TrendingUp, RefreshCw } from "lucide-react"

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("30d")
  const { toast } = useToast()

  // Simulate loading analytics
  const {
    execute: loadAnalytics,
    isLoading,
    data: analyticsData,
  } = useSimulation<any, [string]>("entries", "getStats", true, [timeRange])

  // Refresh analytics
  const refreshAnalytics = () => {
    loadAnalytics(timeRange)

    toast({
      title: "Refreshing analytics",
      description: "Updating your journal analytics...",
    })
  }

  // Download analytics as CSV
  const downloadAnalytics = () => {
    toast({
      title: "Downloading analytics",
      description: "Your analytics data is being prepared...",
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "Your analytics data has been downloaded.",
      })
    }, 2000)
  }

  // Render stat card
  const StatCard = ({
    title,
    value,
    change,
    icon,
    description,
  }: {
    title: string
    value: string | number
    change?: string
    icon: React.ReactNode
    description?: string
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {change && (
                <span
                  className={`text-xs font-medium ${change.startsWith("+") ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {change}
                </span>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="rounded-full p-2 bg-primary/10">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex flex-col space-y-2 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive analytics and statistics about your journaling practice
            </p>
          </div>

          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={downloadAnalytics} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>

            <Button onClick={refreshAnalytics} disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart2 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Entries"
              value={mockUser.stats.totalEntries}
              change="+12% from last month"
              icon={<FileText className="h-5 w-5 text-primary" />}
            />

            <StatCard
              title="Current Streak"
              value={`${mockUser.stats.streakCurrent} days`}
              change="+3 days"
              icon={<TrendingUp className="h-5 w-5 text-primary" />}
              description={`Longest: ${mockUser.stats.streakLongest} days`}
            />

            <StatCard
              title="Words Written"
              value={mockUser.stats.wordsWritten.toLocaleString()}
              change="+2,450 words"
              icon={<FileText className="h-5 w-5 text-primary" />}
            />

            <StatCard
              title="Avg. Entry Length"
              value={`${mockUser.stats.averageWordsPerEntry} words`}
              change="+15 words"
              icon={<FileText className="h-5 w-5 text-primary" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Journaling Activity</CardTitle>
                <CardDescription>Entries per day over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full flex items-center justify-center">
                  <svg width="500" height="300" viewBox="0 0 500 300">
                    {/* Background grid */}
                    <g stroke="currentColor" strokeOpacity="0.1">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <line key={`h-${i}`} x1="40" y1={i * 50 + 25} x2="480" y2={i * 50 + 25} />
                      ))}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <line key={`v-${i}`} x1={i * 60 + 40} y1="25" x2={i * 60 + 40} y2="275" />
                      ))}
                    </g>

                    {/* X and Y axes */}
                    <line x1="40" y1="275" x2="480" y2="275" stroke="currentColor" strokeWidth="1" />
                    <line x1="40" y1="25" x2="40" y2="275" stroke="currentColor" strokeWidth="1" />

                    {/* X-axis labels */}
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, i) => (
                      <text key={month} x={i * 60 + 70} y="295" textAnchor="middle" fontSize="10">
                        {month}
                      </text>
                    ))}

                    {/* Y-axis labels */}
                    {["0", "5", "10", "15", "20", "25"].map((value, i) => (
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

                    {/* Area chart */}
                    <path
                      d="M70,225 L130,200 L190,220 L250,150 L310,100 L370,120 L430,80 L430,275 L70,275 Z"
                      fill="url(#areaGradient)"
                      fillOpacity="0.5"
                      stroke="none"
                    />

                    {/* Line chart */}
                    <path
                      d="M70,225 L130,200 L190,220 L250,150 L310,100 L370,120 L430,80"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />

                    {/* Data points */}
                    {[225, 200, 220, 150, 100, 120, 80].map((y, i) => (
                      <circle key={i} cx={i * 60 + 70} cy={y} r="4" fill="#10b981" />
                    ))}

                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sentiment Distribution</CardTitle>
                <CardDescription>Emotional tone of your journal entries</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full flex items-center justify-center">
                  <svg width="300" height="300" viewBox="0 0 300 300">
                    {/* Pie chart */}
                    <g transform="translate(150, 150)">
                      {/* Positive slice */}
                      <path d="M0,0 L0,-120 A120,120 0 0,1 104,60 Z" fill="#10b981" stroke="white" strokeWidth="1" />
                      <text x="50" y="-60" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                        65%
                      </text>
                      <text x="50" y="-45" textAnchor="middle" fill="white" fontSize="10">
                        Positive
                      </text>

                      {/* Neutral slice */}
                      <path d="M0,0 L104,60 A120,120 0 0,1 -60,104 Z" fill="#0ea5e9" stroke="white" strokeWidth="1" />
                      <text x="30" y="70" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                        25%
                      </text>
                      <text x="30" y="85" textAnchor="middle" fill="white" fontSize="10">
                        Neutral
                      </text>

                      {/* Negative slice */}
                      <path d="M0,0 L-60,104 A120,120 0 0,1 -104,-60 Z" fill="#f43f5e" stroke="white" strokeWidth="1" />
                      <text x="-60" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                        10%
                      </text>
                      <text x="-60" y="45" textAnchor="middle" fill="white" fontSize="10">
                        Negative
                      </text>

                      {/* Legend */}
                      <path d="M0,0 L-104,-60 A120,120 0 0,1 0,-120 Z" fill="#8b5cf6" stroke="white" strokeWidth="1" />
                      <text x="-50" y="-60" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                        5%
                      </text>
                      <text x="-50" y="-45" textAnchor="middle" fill="white" fontSize="10">
                        Mixed
                      </text>
                    </g>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Entries This Month"
              value={mockUser.stats.entriesThisMonth}
              change="-6 from last month"
              icon={<FileText className="h-5 w-5 text-primary" />}
            />

            <StatCard
              title="Average Per Week"
              value="4.2"
              change="+0.8 from last month"
              icon={<Calendar className="h-5 w-5 text-primary" />}
            />

            <StatCard
              title="Most Active Day"
              value="Sunday"
              icon={<Calendar className="h-5 w-5 text-primary" />}
              description="28% of entries written on Sunday"
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Activity Heatmap</CardTitle>
              <CardDescription>When you journal throughout the week</CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="grid grid-cols-7 gap-1">
                {/* Day labels */}
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center text-xs text-muted-foreground">
                    {day}
                  </div>
                ))}

                {/* Time slots */}
                {Array.from({ length: 24 }).map((_, hour) =>
                  Array.from({ length: 7 }).map((_, day) => {
                    // Generate random activity level for demo
                    const activityLevel = Math.random()
                    let bgColor = "bg-primary/5"

                    if (activityLevel > 0.9) bgColor = "bg-primary/90"
                    else if (activityLevel > 0.7) bgColor = "bg-primary/70"
                    else if (activityLevel > 0.5) bgColor = "bg-primary/50"
                    else if (activityLevel > 0.3) bgColor = "bg-primary/30"
                    else if (activityLevel > 0.1) bgColor = "bg-primary/10"

                    return (
                      <div
                        key={`${hour}-${day}`}
                        className={`h-3 rounded-sm ${bgColor} hover:ring-1 hover:ring-primary`}
                        title={`${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day]} ${hour}:00 - ${hour + 1}:00`}
                      />
                    )
                  }),
                )}

                {/* Time labels (every 6 hours) */}
                <div className="col-span-7 mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>12 AM</span>
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                  <span>12 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Streak Calendar</CardTitle>
                <CardDescription>Your journaling consistency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {/* Day labels */}
                  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div key={day} className="text-center text-xs text-muted-foreground">
                      {day}
                    </div>
                  ))}

                  {/* Calendar days */}
                  {Array.from({ length: 35 }).map((_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() - 35 + i)
                    const isToday = i === 34

                    // Simulate journaling days
                    const hasJournaled = Math.random() > 0.3

                    return (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center rounded-full text-xs
                          ${isToday ? "ring-2 ring-primary" : ""}
                          ${hasJournaled ? "bg-primary/20 hover:bg-primary/30" : "bg-muted hover:bg-muted/80"}
                        `}
                      >
                        {date.getDate()}
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary/20" />
                    <span className="text-xs text-muted-foreground">Journaled</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted" />
                    <span className="text-xs text-muted-foreground">No entry</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full ring-2 ring-primary" />
                    <span className="text-xs text-muted-foreground">Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Time of Day</CardTitle>
                <CardDescription>When you typically journal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] relative">
                  <svg width="100%" height="100%" viewBox="0 0 400 250">
                    {/* Background grid */}
                    <g stroke="currentColor" strokeOpacity="0.1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <line key={`h-${i}`} x1="50" y1={i * 50 + 25} x2="380" y2={i * 50 + 25} />
                      ))}
                    </g>

                    {/* X and Y axes */}
                    <line x1="50" y1="225" x2="380" y2="225" stroke="currentColor" strokeWidth="1" />
                    <line x1="50" y1="25" x2="50" y2="225" stroke="currentColor" strokeWidth="1" />

                    {/* X-axis labels */}
                    {["Morning", "Afternoon", "Evening", "Night"].map((time, i) => (
                      <text key={time} x={i * 80 + 90} y="245" textAnchor="middle" fontSize="10">
                        {time}
                      </text>
                    ))}

                    {/* Y-axis labels */}
                    {["0%", "25%", "50%", "75%", "100%"].map((value, i) => (
                      <text
                        key={value}
                        x="40"
                        y={225 - i * 50}
                        textAnchor="end"
                        dominantBaseline="middle"
                        fontSize="10"
                      >
                        {value}
                      </text>
                    ))}

                    {/* Bars */}
                    <rect x="70" y="75" width="40" height="150" fill="url(#barGradient)" rx="4" />
                    <rect x="150" y="125" width="40" height="100" fill="url(#barGradient)" rx="4" />
                    <rect x="230" y="50" width="40" height="175" fill="url(#barGradient)" rx="4" />
                    <rect x="310" y="150" width="40" height="75" fill="url(#barGradient)" rx="4" />

                    {/* Percentage labels */}
                    <text x="90" y="65" textAnchor="middle" fontSize="12" fontWeight="bold">
                      60%
                    </text>
                    <text x="170" y="115" textAnchor="middle" fontSize="12" fontWeight="bold">
                      40%
                    </text>
                    <text x="250" y="40" textAnchor="middle" fontSize="12" fontWeight="bold">
                      70%
                    </text>
                    <text x="330" y="140" textAnchor="middle" fontSize="12" fontWeight="bold">
                      30%
                    </text>

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
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Words"
              value={mockUser.stats.wordsWritten.toLocaleString()}
              icon={<FileText className="h-5 w-5 text-primary" />}
            />

            <StatCard
              title="Unique Tags"
              value={mockUser.stats.tagsUsed}
              change="+3 new tags"
              icon={<Tag className="h-5 w-5 text-primary" />}
            />

            <StatCard
              title="Avg. Reading Time"
              value={`${Math.ceil(mockUser.stats.averageWordsPerEntry / 200)} min`}
              icon={<Clock className="h-5 w-5 text-primary" />}
              description="Based on 200 words per minute"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Top Tags</CardTitle>
                <CardDescription>Most frequently used tags</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["work", "personal growth", "health", "relationships", "creativity"].map((tag, i) => (
                    <div key={tag} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{tag}</span>
                        <span className="text-xs text-muted-foreground">{[24, 18, 15, 12, 10][i]} entries</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${[80, 60, 50, 40, 33][i]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Entry Length</CardTitle>
                <CardDescription>Distribution of entry lengths</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] relative">
                  <svg width="100%" height="100%" viewBox="0 0 400 250">
                    {/* Background grid */}
                    <g stroke="currentColor" strokeOpacity="0.1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <line key={`h-${i}`} x1="50" y1={i * 50 + 25} x2="380" y2={i * 50 + 25} />
                      ))}
                    </g>

                    {/* X and Y axes */}
                    <line x1="50" y1="225" x2="380" y2="225" stroke="currentColor" strokeWidth="1" />
                    <line x1="50" y1="25" x2="50" y2="225" stroke="currentColor" strokeWidth="1" />

                    {/* X-axis labels */}
                    {["<100", "100-200", "200-300", "300-500", "500+"].map((words, i) => (
                      <text key={words} x={i * 65 + 85} y="245" textAnchor="middle" fontSize="10">
                        {words}
                      </text>
                    ))}

                    {/* Y-axis labels */}
                    {["0", "10", "20", "30", "40"].map((value, i) => (
                      <text
                        key={value}
                        x="40"
                        y={225 - i * 50}
                        textAnchor="end"
                        dominantBaseline="middle"
                        fontSize="10"
                      >
                        {value}
                      </text>
                    ))}

                    {/* Bars */}
                    <rect x="65" y="175" width="40" height="50" fill="url(#barGradient)" rx="4" />
                    <rect x="130" y="125" width="40" height="100" fill="url(#barGradient)" rx="4" />
                    <rect x="195" y="75" width="40" height="150" fill="url(#barGradient)" rx="4" />
                    <rect x="260" y="125" width="40" height="100" fill="url(#barGradient)" rx="4" />
                    <rect x="325" y="175" width="40" height="50" fill="url(#barGradient)" rx="4" />

                    {/* Count labels */}
                    <text x="85" y="165" textAnchor="middle" fontSize="12" fontWeight="bold">
                      10
                    </text>
                    <text x="150" y="115" textAnchor="middle" fontSize="12" fontWeight="bold">
                      20
                    </text>
                    <text x="215" y="65" textAnchor="middle" fontSize="12" fontWeight="bold">
                      30
                    </text>
                    <text x="280" y="115" textAnchor="middle" fontSize="12" fontWeight="bold">
                      20
                    </text>
                    <text x="345" y="165" textAnchor="middle" fontSize="12" fontWeight="bold">
                      10
                    </text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Content Analysis</CardTitle>
              <CardDescription>Insights about your writing style and content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-2">Vocabulary Richness</h3>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <svg viewBox="0 0 100 100" width="100%" height="100%">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeDasharray="283"
                            strokeDashoffset="70"
                            transform="rotate(-90 50 50)"
                          />
                          <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold">
                            75
                          </text>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          Your vocabulary is richer than 75% of users. You use a diverse range of words in your entries.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-2">Writing Style</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Descriptive</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-sky-500" style={{ width: "65%" }} />
                      </div>

                      <div className="flex justify-between text-xs">
                        <span>Analytical</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-violet-500" style={{ width: "45%" }} />
                      </div>

                      <div className="flex justify-between text-xs">
                        <span>Reflective</span>
                        <span>80%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: "80%" }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-2">Content Focus</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-xs">Self-reflection (40%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-sky-500" />
                        <span className="text-xs">Events & activities (30%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-violet-500" />
                        <span className="text-xs">People & relationships (15%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-xs">Goals & planning (10%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                        <span className="text-xs">Other (5%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Growth Rate"
              value="+12%"
              icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
              description="Monthly increase in journaling activity"
            />

            <StatCard
              title="Consistency Score"
              value="8.5/10"
              change="+0.7"
              icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
            />

            <StatCard
              title="Sentiment Trend"
              value="+5%"
              icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
              description="Increase in positive sentiment"
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Long-term Trends</CardTitle>
              <CardDescription>How your journaling has evolved over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] relative">
                <svg width="100%" height="100%" viewBox="0 0 800 300">
                  {/* Background grid */}
                  <g stroke="currentColor" strokeOpacity="0.1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <line key={`h-${i}`} x1="50" y1={i * 50 + 25} x2="750" y2={i * 50 + 25} />
                    ))}
                    {Array.from({ length: 13 }).map((_, i) => (
                      <line key={`v-${i}`} x1={i * 60 + 50} y1="25" x2={i * 60 + 50} y2="275" />
                    ))}
                  </g>

                  {/* X and Y axes */}
                  <line x1="50" y1="275" x2="750" y2="275" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="25" x2="50" y2="275" stroke="currentColor" strokeWidth="1" />

                  {/* X-axis labels */}
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                    (month, i) => (
                      <text key={month} x={i * 60 + 80} y="295" textAnchor="middle" fontSize="10">
                        {month}
                      </text>
                    ),
                  )}

                  {/* Multiple trend lines */}
                  {/* Entry count line */}
                  <path
                    d="M80,225 L140,215 L200,220 L260,200 L320,190 L380,170 L440,160 L500,150 L560,140 L620,120 L680,110 L740,100"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />

                  {/* Word count line */}
                  <path
                    d="M80,200 L140,210 L200,190 L260,180 L320,170 L380,160 L440,150 L500,130 L560,120 L620,100 L680,90 L740,80"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Sentiment line */}
                  <path
                    d="M80,180 L140,190 L200,170 L260,175 L320,160 L380,150 L440,155 L500,140 L560,130 L620,125 L680,110 L740,100"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    strokeDasharray="1 1"
                  />

                  {/* Legend */}
                  <circle cx="600" cy="40" r="4" fill="#10b981" />
                  <text x="610" y="40" dominantBaseline="middle" fontSize="10">
                    Entry count
                  </text>

                  <line x1="600" y1="60" x2="610" y2="60" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="615" y="60" dominantBaseline="middle" fontSize="10">
                    Word count
                  </text>

                  <line x1="600" y1="80" x2="610" y2="80" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="1 1" />
                  <text x="615" y="80" dominantBaseline="middle" fontSize="10">
                    Sentiment
                  </text>
                </svg>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Correlation Analysis</CardTitle>
                <CardDescription>Relationships between different metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Entry Length vs. Sentiment</span>
                      <span className="text-xs font-medium text-emerald-500">+0.72</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Longer entries tend to have more positive sentiment</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: "72%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Time of Day vs. Entry Length</span>
                      <span className="text-xs font-medium text-sky-500">+0.45</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Evening entries tend to be longer than morning entries
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full bg-sky-500" style={{ width: "45%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Day of Week vs. Sentiment</span>
                      <span className="text-xs font-medium text-violet-500">+0.38</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Weekend entries tend to have more positive sentiment
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full bg-violet-500" style={{ width: "38%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tag Count vs. Entry Length</span>
                      <span className="text-xs font-medium text-amber-500">+0.65</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Entries with more tags tend to be longer and more detailed
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full bg-amber-500" style={{ width: "65%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Growth Predictions</CardTitle>
                <CardDescription>Projected journaling trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] relative">
                  <svg width="100%" height="100%" viewBox="0 0 400 250">
                    {/* Background grid */}
                    <g stroke="currentColor" strokeOpacity="0.1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <line key={`h-${i}`} x1="50" y1={i * 50 + 25} x2="380" y2={i * 50 + 25} />
                      ))}
                    </g>

                    {/* X and Y axes */}
                    <line x1="50" y1="225" x2="380" y2="225" stroke="currentColor" strokeWidth="1" />
                    <line x1="50" y1="25" x2="50" y2="225" stroke="currentColor" strokeWidth="1" />

                    {/* X-axis labels */}
                    {["Now", "+1m", "+2m", "+3m", "+4m", "+5m", "+6m"].map((time, i) => (
                      <text key={time} x={i * 50 + 60} y="245" textAnchor="middle" fontSize="10">
                        {time}
                      </text>
                    ))}

                    {/* Historical data */}
                    <path d="M60,175 L110,150 L160,125" fill="none" stroke="#10b981" strokeWidth="2" />

                    {/* Prediction line */}
                    <path
                      d="M160,125 L210,100 L260,85 L310,75 L360,70"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />

                    {/* Prediction range */}
                    <path
                      d="M160,125 L210,80 L260,55 L310,40 L360,30 L360,110 L310,110 L260,115 L210,120 L160,125 Z"
                      fill="#10b981"
                      fillOpacity="0.1"
                      stroke="none"
                    />

                    {/* Current point */}
                    <circle cx="160" cy="125" r="4" fill="#10b981" stroke="white" strokeWidth="1" />

                    {/* Legend */}
                    <line x1="280" y1="40" x2="290" y2="40" stroke="#10b981" strokeWidth="2" />
                    <text x="295" y="40" dominantBaseline="middle" fontSize="10">
                      Actual
                    </text>

                    <line x1="280" y1="60" x2="290" y2="60" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
                    <text x="295" y="60" dominantBaseline="middle" fontSize="10">
                      Predicted
                    </text>

                    <rect x="280" y="75" width="10" height="10" fill="#10b981" fillOpacity="0.1" />
                    <text x="295" y="80" dominantBaseline="middle" fontSize="10">
                      Range
                    </text>
                  </svg>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Projected Growth</span>
                    <span className="text-xs font-medium text-emerald-500">+15% in 6 months</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on your current journaling patterns and historical data
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

