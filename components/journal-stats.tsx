import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingUp, Clock } from "lucide-react"

export function JournalStats() {
  // In a real app, these would be fetched from a database
  const stats = [
    {
      title: "Total Entries",
      value: "142",
      change: "+12% from last month",
      icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Journaling Streak",
      value: "16 days",
      change: "Personal best: 21 days",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Avg. Writing Time",
      value: "12 min",
      change: "+3 min from last month",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    },
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

