'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  description: string
  timestamp: string
  read: boolean
  type: 'info' | 'success' | 'warning' | 'error'
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Training Complete',
      description: 'Customer Support Bot training completed successfully',
      timestamp: '2 minutes ago',
      read: false,
      type: 'success'
    },
    {
      id: '2',
      title: 'API Rate Limit Warning',
      description: 'Approaching 80% of your API rate limit',
      timestamp: '1 hour ago',
      read: false,
      type: 'warning'
    },
    {
      id: '3',
      title: 'New Team Member',
      description: 'Jane Smith accepted your invitation',
      timestamp: '2 hours ago',
      read: true,
      type: 'info'
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center translate-x-1/3 -translate-y-1/3">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-auto p-0 text-sm font-normal"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                "flex flex-col items-start p-4 cursor-pointer",
                !notification.read && "bg-muted/50"
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  {
                    'bg-blue-500': notification.type === 'info',
                    'bg-green-500': notification.type === 'success',
                    'bg-yellow-500': notification.type === 'warning',
                    'bg-red-500': notification.type === 'error',
                  }
                )} />
                <span className="font-medium">{notification.title}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {notification.description}
              </p>
              <span className="text-xs text-muted-foreground mt-1">
                {notification.timestamp}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 