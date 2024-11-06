'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  FileText,
  Database,
  Code,
  BarChart,
  Users,
  ClipboardList,
  User,
  CreditCard
} from 'lucide-react'

const items = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Chatbots",
    href: "/dashboard/chatbots",
    icon: Bot
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText
  },
  {
    title: "Training",
    href: "/dashboard/training",
    icon: Database
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users
  },
  {
    title: "API",
    href: "/dashboard/api",
    icon: Code
  },
  {
    title: "Audit Logs",
    href: "/dashboard/audit-logs",
    icon: ClipboardList
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              isActive 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
} 