"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  Search,
  BarChart2,
  Tag,
  Calendar,
  Users,
  HelpCircle,
  FileText,
  Lightbulb,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  disabled?: boolean
}

export function DashboardNav() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Journal Entries",
      href: "/entries",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Search & Analysis",
      href: "/search",
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: "Insights",
      href: "/insights",
      icon: <Lightbulb className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      title: "Tags & Categories",
      href: "/tags",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: "Calendar View",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Templates",
      href: "/templates",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Shared Journals",
      href: "/shared",
      icon: <Users className="h-5 w-5" />,
      disabled: true,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Help & Support",
      href: "/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ]

  return (
    <nav className="grid items-start gap-2 py-4">
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.disabled ? "#" : item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-muted text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            item.disabled && "pointer-events-none opacity-60",
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

