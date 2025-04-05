"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New AI Insight Available",
      description: "We've analyzed your recent entries and have new insights to share.",
      time: "Just now",
      read: false,
    },
    {
      id: "2",
      title: "Journaling Streak: 7 Days!",
      description: "Congratulations! You've maintained your journaling streak for a week.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "3",
      title: "Weekly Summary Ready",
      description: "Your emotional trends and patterns for the past week are ready to view.",
      time: "Yesterday",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-teal-500" />}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between py-2">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" className="h-auto p-0 text-sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="space-y-2 py-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex flex-col space-y-1 p-2 rounded-md cursor-pointer",
                    notification.read ? "opacity-70" : "bg-muted/50",
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-sm">{notification.title}</h5>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{notification.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground text-sm">No notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

