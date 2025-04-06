"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SentimentTimeline } from "@/components/advanced-search/sentiment-timeline"
import { WordCloud } from "@/components/advanced-search/word-cloud"
import { mockEntries, mockInsights } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import { useSimulation } from "@/hooks/use-simulation"
import { Button } from "@/components/ui/button"
import { Sparkles, BarChart2, PieChart } from "lucide-react"

export function JournalInsights() {
  const [activeTab, setActiveTab] = useState("sentiment")
  const { t } = useTranslation()

  // Simulate AI analysis
  const {
    execute: analyzeJournal,
    isLoading: isAnalyzing,
    data: analysisData,
  } = useSimulation<any, [void]>("ai", "analyzeText", false)

  // Generate new insights
  const generateInsights = () => {
    analyzeJournal()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("insights.title")}</CardTitle>
            <CardDescription>{t("insights.description")}</CardDescription>
          </div>

          <Button variant="outline" size="sm" onClick={generateInsights} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1" />
            )}
            {t("insights.generate")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="sentiment" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              {t("insights.tabs.sentiment")}
            </TabsTrigger>
            <TabsTrigger value="topics" className="flex items-center gap-1">
              <PieChart className="h-4 w-4" />
              {t("insights.tabs.topics")}
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              {t("insights.tabs.ai")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sentiment" className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">{t("insights.sentimentOverTime")}</h3>
              <p className="text-xs text-muted-foreground">{t("insights.sentimentDescription")}</p>
            </div>

            <SentimentTimeline entries={mockEntries} />
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">{t("insights.topWords")}</h3>
              <p className="text-xs text-muted-foreground">{t("insights.topWordsDescription")}</p>
            </div>

            <WordCloud entries={mockEntries} />
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">{t("insights.aiInsights")}</h3>
              <p className="text-xs text-muted-foreground">{t("insights.aiInsightsDescription")}</p>
            </div>

            <div className="space-y-3">
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative h-12 w-12">
                      <div className="absolute inset-0 rounded-full border-4 border-muted" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-teal-500" />
                    </div>
                    <p className="text-sm font-medium">{t("insights.analyzing")}</p>
                    <p className="text-xs text-muted-foreground">{t("insights.analyzingDescription")}</p>
                  </div>
                </div>
              ) : (
                mockInsights.map((insight) => (
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
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

