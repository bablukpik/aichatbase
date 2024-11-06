'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, ArrowUpRight, Users } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { columns, type Message } from "./columns"

const messages: Message[] = [
  {
    id: "1",
    chatbotId: "1",
    chatbotName: "Customer Support",
    content: "How do I reset my password?",
    response: "To reset your password, click on the 'Forgot Password' link on the login page and follow the instructions sent to your email.",
    status: "success",
    timestamp: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    chatbotId: "1",
    chatbotName: "Customer Support",
    content: "What are your business hours?",
    response: "We are open Monday through Friday, 9 AM to 6 PM EST.",
    status: "success",
    timestamp: "2024-01-15T15:45:00Z",
  },
  // Add more sample messages
]

export default function MessagesPage() {
  const [data] = useState<Message[]>(messages)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Monitor and analyze your chatbot conversations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">123,456</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  )
} 