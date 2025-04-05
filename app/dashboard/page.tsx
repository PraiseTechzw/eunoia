import { DailyInsight } from "@/components/daily-insight"
import { JournalStats } from "@/components/journal-stats"
import { RecentEntries } from "@/components/recent-entries"
import { EmotionChart } from "@/components/emotion-chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PenLine } from "lucide-react"
import Link from "next/link"
import { JournalPrompts } from "@/components/journal-prompts"
import { TopicCloud } from "@/components/topic-cloud"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your journaling insights.</p>
        </div>
        <Link href="/entries/new">
          <Button className="gap-2">
            <PenLine className="h-4 w-4" /> New Entry
          </Button>
        </Link>
      </div>

      <DailyInsight />

      <div className="grid gap-6 md:grid-cols-3">
        <JournalStats />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Emotional Trends</CardTitle>
            <CardDescription>Track your emotional patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <EmotionChart />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Common Topics</CardTitle>
            <CardDescription>Themes and topics from your journal entries</CardDescription>
          </CardHeader>
          <CardContent>
            <TopicCloud />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Entries</CardTitle>
              <CardDescription>Your latest journal entries</CardDescription>
            </div>
            <Link href="/entries">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <RecentEntries />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Journal Prompts</CardTitle>
            <CardDescription>Inspiration for your next entry</CardDescription>
          </CardHeader>
          <CardContent>
            <JournalPrompts />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

