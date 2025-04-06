import { JournalInsights } from "@/components/journal-insights"
import { MoodTracker } from "@/components/mood-tracker"
import { AnalyticsCard } from "@/components/dashboard/analytics-card"
import { RecentEntries } from "@/components/recent-entries"
import { JournalPrompts } from "@/components/journal-prompts"

export default function DashboardPage() {
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <JournalInsights />
          <RecentEntries />
        </div>

        <div className="space-y-6">
          <MoodTracker />
          <AnalyticsCard />
          <JournalPrompts />
        </div>
      </div>
    </div>
  )
}

