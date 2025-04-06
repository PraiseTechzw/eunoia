"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockEntries } from "@/lib/mock-data"
import { useSimulation } from "@/hooks/use-simulation"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Tag,
  FileText,
  Clock,
  BarChart2,
  Grid,
  List,
  Filter,
} from "lucide-react"

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Simulate loading entries
  const {
    execute: loadEntries,
    isLoading,
    data: entriesData,
  } = useSimulation<any, [any]>("entries", "getEntries", true, [
    { dateRange: { from: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) } },
  ])

  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleString("default", { month: "long" })
  }

  // Get year
  const getYear = (date: Date) => {
    return date.getFullYear()
  }

  // Navigate to previous period
  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  // Navigate to next period
  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Create new entry
  const createNewEntry = (date?: Date) => {
    router.push("/entries/new")
  }

  // View entry
  const viewEntry = (entryId: string) => {
    router.push(`/entries/${entryId}`)
  }

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ date: null, entries: [] })
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i)

      // Find entries for this day
      const dayEntries = mockEntries.filter((entry) => {
        const entryDate = new Date(entry.date)
        return entryDate.getDate() === i && entryDate.getMonth() === month && entryDate.getFullYear() === year
      })

      days.push({ date: dayDate, entries: dayEntries })
    }

    return days
  }

  // Get days in week
  const getDaysInWeek = (date: Date) => {
    const currentDay = date.getDay()
    const startDate = new Date(date)
    startDate.setDate(date.getDate() - currentDay)

    const days = []

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startDate)
      dayDate.setDate(startDate.getDate() + i)

      // Find entries for this day
      const dayEntries = mockEntries.filter((entry) => {
        const entryDate = new Date(entry.date)
        return (
          entryDate.getDate() === dayDate.getDate() &&
          entryDate.getMonth() === dayDate.getMonth() &&
          entryDate.getFullYear() === dayDate.getFullYear()
        )
      })

      days.push({ date: dayDate, entries: dayEntries })
    }

    return days
  }

  // Get hours in day
  const getHoursInDay = (date: Date) => {
    const hours = []

    for (let i = 0; i < 24; i++) {
      const hourDate = new Date(date)
      hourDate.setHours(i, 0, 0, 0)

      // Find entries for this hour
      const hourEntries = mockEntries.filter((entry) => {
        const entryDate = new Date(entry.date)
        return (
          entryDate.getHours() === i &&
          entryDate.getDate() === date.getDate() &&
          entryDate.getMonth() === date.getMonth() &&
          entryDate.getFullYear() === date.getFullYear()
        )
      })

      hours.push({ hour: i, date: hourDate, entries: hourEntries })
    }

    return hours
  }

  // Render month view
  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate)

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium p-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const isToday =
            day.date &&
            day.date.getDate() === new Date().getDate() &&
            day.date.getMonth() === new Date().getMonth() &&
            day.date.getFullYear() === new Date().getFullYear()

          const isSelected =
            day.date &&
            selectedDate &&
            day.date.getDate() === selectedDate.getDate() &&
            day.date.getMonth() === selectedDate.getMonth() &&
            day.date.getFullYear() === selectedDate.getFullYear()

          return (
            <div
              key={index}
              className={`min-h-[100px] border rounded-md p-1 ${
                !day.date
                  ? "bg-muted/30"
                  : isToday
                    ? "border-primary"
                    : isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50 cursor-pointer"
              }`}
              onClick={() => day.date && setSelectedDate(day.date)}
            >
              {day.date && (
                <>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{day.date.getDate()}</span>
                    {day.entries.length > 0 && (
                      <span className="text-xs bg-primary/20 text-primary rounded-full px-1.5">
                        {day.entries.length}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 space-y-1">
                    {day.entries.slice(0, 2).map((entry) => (
                      <div
                        key={entry.id}
                        className="text-xs truncate p-1 rounded bg-card border"
                        onClick={(e) => {
                          e.stopPropagation()
                          viewEntry(entry.id)
                        }}
                      >
                        {entry.title}
                      </div>
                    ))}
                    {day.entries.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">+{day.entries.length - 2} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Render week view
  const renderWeekView = () => {
    const days = getDaysInWeek(currentDate)

    return (
      <div className="grid grid-cols-8 gap-1">
        {/* Time column */}
        <div className="space-y-2 pr-2">
          <div className="h-12"></div> {/* Header spacer */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-20 text-xs text-right text-muted-foreground">
              {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day, dayIndex) => {
          const isToday =
            day.date.getDate() === new Date().getDate() &&
            day.date.getMonth() === new Date().getMonth() &&
            day.date.getFullYear() === new Date().getFullYear()

          return (
            <div key={dayIndex} className="space-y-2">
              {/* Day header */}
              <div className={`text-center p-2 ${isToday ? "bg-primary/10 rounded-md font-medium" : ""}`}>
                <div className="text-sm">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.date.getDay()]}</div>
                <div className={`text-lg ${isToday ? "text-primary font-bold" : ""}`}>{day.date.getDate()}</div>
              </div>

              {/* Time slots */}
              {Array.from({ length: 12 }).map((_, hourIndex) => {
                const hour = hourIndex
                const hourEntries = day.entries.filter((entry) => {
                  const entryDate = new Date(entry.date)
                  return entryDate.getHours() === hour
                })

                return (
                  <div
                    key={hourIndex}
                    className={`h-20 border rounded-md p-1 ${
                      hourEntries.length > 0 ? "bg-primary/5 border-primary/20" : "hover:bg-muted/30"
                    }`}
                    onClick={() => {
                      const selectedDate = new Date(day.date)
                      selectedDate.setHours(hour)
                      setSelectedDate(selectedDate)
                    }}
                  >
                    {hourEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="text-xs p-1 mb-1 rounded bg-card border truncate"
                        onClick={(e) => {
                          e.stopPropagation()
                          viewEntry(entry.id)
                        }}
                      >
                        {entry.title}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  // Render day view
  const renderDayView = () => {
    const hours = getHoursInDay(currentDate)

    return (
      <div className="space-y-2">
        {hours.map((hour, index) => {
          const isCurrentHour =
            new Date().getHours() === hour.hour &&
            currentDate.getDate() === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()

          return (
            <div
              key={index}
              className={`flex border rounded-md ${
                isCurrentHour ? "border-primary bg-primary/5" : hour.entries.length > 0 ? "bg-muted/30" : ""
              }`}
            >
              <div className="w-20 p-2 border-r text-center flex flex-col justify-center">
                <span className="text-sm font-medium">
                  {hour.hour === 0
                    ? "12 AM"
                    : hour.hour < 12
                      ? `${hour.hour} AM`
                      : hour.hour === 12
                        ? "12 PM"
                        : `${hour.hour - 12} PM`}
                </span>
              </div>

              <div className="flex-1 p-2 min-h-[80px]">
                {hour.entries.length > 0 ? (
                  <div className="space-y-2">
                    {hour.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-2 rounded-md border bg-card hover:bg-muted/50 cursor-pointer"
                        onClick={() => viewEntry(entry.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{entry.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {entry.content.replace(/<[^>]*>/g, "")}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {entry.tags.length > 3 && (
                            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                              +{entry.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="h-full flex items-center justify-center text-sm text-muted-foreground hover:bg-muted/20 rounded-md cursor-pointer"
                    onClick={() => {
                      const newDate = new Date(currentDate)
                      newDate.setHours(hour.hour)
                      createNewEntry(newDate)
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Add entry
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex flex-col space-y-2 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Calendar View</h1>
            <p className="text-muted-foreground">Visualize your journal entries across time</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => createNewEntry()}>
              <Plus className="h-4 w-4" />
              New Entry
            </Button>

            <Select value={view} onValueChange={(value) => setView(value as any)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">
                  <div className="flex items-center gap-2">
                    <Grid className="h-4 w-4" />
                    Month View
                  </div>
                </SelectItem>
                <SelectItem value="week">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    Week View
                  </div>
                </SelectItem>
                <SelectItem value="day">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Day View
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button variant="outline" onClick={goToToday}>
                Today
              </Button>

              <Button variant="outline" size="icon" onClick={goToNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <h2 className="text-xl font-bold ml-2">
                {view === "day"
                  ? currentDate.toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : view === "week"
                    ? `Week of ${currentDate.toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}`
                    : `${getMonthName(currentDate)} ${getYear(currentDate)}`}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>

              <Button variant="outline" size="sm" className="gap-1">
                <BarChart2 className="h-4 w-4" />
                Analytics
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
          {view === "day" && renderDayView()}
        </CardContent>
      </Card>

      {selectedDate && (
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </CardTitle>

              <Button variant="outline" size="sm" className="gap-1" onClick={() => createNewEntry(selectedDate)}>
                <Plus className="h-4 w-4" />
                New Entry
              </Button>
            </div>
            <CardDescription>
              {
                mockEntries.filter((entry) => {
                  const entryDate = new Date(entry.date)
                  return (
                    entryDate.getDate() === selectedDate.getDate() &&
                    entryDate.getMonth() === selectedDate.getMonth() &&
                    entryDate.getFullYear() === selectedDate.getFullYear()
                  )
                }).length
              }{" "}
              entries on this day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEntries
                .filter((entry) => {
                  const entryDate = new Date(entry.date)
                  return (
                    entryDate.getDate() === selectedDate.getDate() &&
                    entryDate.getMonth() === selectedDate.getMonth() &&
                    entryDate.getFullYear() === selectedDate.getFullYear()
                  )
                })
                .map((entry) => (
                  <Card key={entry.id} className="overflow-hidden">
                    <div
                      className={`h-1 ${
                        entry.sentiment === "Very Positive"
                          ? "bg-emerald-500"
                          : entry.sentiment === "Positive"
                            ? "bg-teal-500"
                            : entry.sentiment === "Neutral"
                              ? "bg-sky-500"
                              : entry.sentiment === "Negative"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                      }`}
                    />
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{entry.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {entry.content.replace(/<[^>]*>/g, "")}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag: string) => (
                          <span key={tag} className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" onClick={() => viewEntry(entry.id)}>
                          View Entry
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {mockEntries.filter((entry) => {
                const entryDate = new Date(entry.date)
                return (
                  entryDate.getDate() === selectedDate.getDate() &&
                  entryDate.getMonth() === selectedDate.getMonth() &&
                  entryDate.getFullYear() === selectedDate.getFullYear()
                )
              }).length === 0 && (
                <div className="text-center py-8">
                  <div className="rounded-full bg-muted p-3 inline-flex mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No entries for this day</h3>
                  <p className="text-muted-foreground mb-4">
                    Start journaling to capture your thoughts and experiences.
                  </p>
                  <Button onClick={() => createNewEntry(selectedDate)} className="gap-1">
                    <Plus className="h-4 w-4" />
                    Create New Entry
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

