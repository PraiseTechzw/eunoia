import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-muted rounded-full">{icon}</div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

