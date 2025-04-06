"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockUser } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import { BarChart2, LineChart, Calendar, Clock, Hash, FileText, Tag } from "lucide-react"
import { useSimulation } from "@/hooks/use-simulation"

export function AnalyticsCard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState(mockUser.stats)
  const { t } = useTranslation()

  // Simulate loading stats
  const { execute: loadStats, isLoading, data: statsData } = useSimulation<any, [void]>("entries", "getStats", true)

  // Update stats when data is loaded
  useEffect(() => {
    if (statsData) {
      setStats({
        ...stats,
        ...statsData,
      })
    }
  }, [statsData])

  // Render stat item
  const StatItem = ({
    icon,
    label,
    value,
    suffix = "",
  }: {
    icon: React.ReactNode
    label: string
    value: number | string
    suffix?: string
  }) => (
    <div className="flex items-center gap-2">
      <div className="rounded-full p-2 bg-primary/10">{icon}</div>
      <div>
        <p className="text-sm font-medium">
          {value}
          {suffix}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{t("analytics.title")}</CardTitle>
        <CardDescription>{t("analytics.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="text-xs">
              {t("analytics.tabs.overview")}
            </TabsTrigger>
            <TabsTrigger value="writing" className="text-xs">
              {t("analytics.tabs.writing")}
            </TabsTrigger>
            <TabsTrigger value="streaks" className="text-xs">
              {t("analytics.tabs.streaks")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                icon={<FileText className="h-4 w-4 text-primary" />}
                label={t("analytics.totalEntries")}
                value={stats.totalEntries}
              />

              <StatItem
                icon={<Tag className="h-4 w-4 text-primary" />}
                label={t("analytics.tagsUsed")}
                value={stats.tagsUsed}
              />

              <StatItem
                icon={<Calendar className="h-4 w-4 text-primary" />}
                label={t("analytics.thisMonth")}
                value={stats.entriesThisMonth}
              />

              <StatItem
                icon={<Calendar className="h-4 w-4 text-primary" />}
                label={t("analytics.lastMonth")}
                value={stats.entriesLastMonth}
              />
            </div>
          </TabsContent>

          <TabsContent value="writing">
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                icon={<Hash className="h-4 w-4 text-primary" />}
                label={t("analytics.wordsWritten")}
                value={stats.wordsWritten.toLocaleString()}
              />

              <StatItem
                icon={<Hash className="h-4 w-4 text-primary" />}
                label={t("analytics.avgWordsPerEntry")}
                value={stats.averageWordsPerEntry}
              />

              <StatItem
                icon={<Clock className="h-4 w-4 text-primary" />}
                label={t("analytics.readingTime")}
                value={Math.ceil(stats.wordsWritten / 200)}
                suffix={` ${t("analytics.minutes")}`}
              />

              <StatItem
                icon={<FileText className="h-4 w-4 text-primary" />}
                label={t("analytics.longestEntry")}
                value={Math.ceil(stats.averageWordsPerEntry * 2.5)}
                suffix={` ${t("analytics.words")}`}
              />
            </div>
          </TabsContent>

          <TabsContent value="streaks">
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                icon={<LineChart className="h-4 w-4 text-primary" />}
                label={t("analytics.currentStreak")}
                value={stats.streakCurrent}
                suffix={` ${t("analytics.days")}`}
              />

              <StatItem
                icon={<BarChart2 className="h-4 w-4 text-primary" />}
                label={t("analytics.longestStreak")}
                value={stats.streakLongest}
                suffix={` ${t("analytics.days")}`}
              />

              <div className="col-span-2 pt-2">
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${(stats.streakCurrent / stats.streakLongest) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{t("analytics.current")}</span>
                  <span>{Math.round((stats.streakCurrent / stats.streakLongest) * 100)}%</span>
                  <span>{t("analytics.longest")}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

