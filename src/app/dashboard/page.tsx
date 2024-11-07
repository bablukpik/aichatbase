'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Bot, 
  MessageSquare, 
  FileText, 
  Users, 
  Clock, 
  Zap, 
  Upload, 
  Settings, 
  Code, 
  BrainCircuit, 
  Activity, 
  BarChart2, 
  TrendingUp, 
  Plug, 
  Cpu, 
  MessageCircle, 
  Star, 
  CalendarClock,
  Headphones, 
  ShoppingBag 
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface DashboardData {
  chatbots: {
    total: number
    active: number
  }
  messages: {
    total: number
    today: number
  }
  documents: {
    total: number
    size: number
  }
  team: {
    total: number
    online: number
  }
}

const defaultData: DashboardData = {
  chatbots: { total: 0, active: 0 },
  messages: { total: 0, today: 0 },
  documents: { total: 0, size: 0 },
  team: { total: 0, online: 0 }
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData>(defaultData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newChatbot, setNewChatbot] = useState({
    name: '',
    description: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [chatbotsRes, messagesRes, documentsRes, teamRes] = await Promise.allSettled([
        fetch('/api/chatbots'),
        fetch('/api/messages'),
        fetch('/api/documents'),
        fetch('/api/team/members')
      ])

      const chatbots = chatbotsRes.status === 'fulfilled' && chatbotsRes.value.ok ? 
        await chatbotsRes.value.json() : []
      const messages = messagesRes.status === 'fulfilled' && messagesRes.value.ok ? 
        await messagesRes.value.json() : []
      const documents = documentsRes.status === 'fulfilled' && documentsRes.value.ok ? 
        await documentsRes.value.json() : []
      const team = teamRes.status === 'fulfilled' && teamRes.value.ok ? 
        await teamRes.value.json() : { members: [] }

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      setData({
        chatbots: {
          total: chatbots.length || 0,
          active: chatbots.filter((bot: any) => bot.messages > 0).length || 0,
        },
        messages: {
          total: messages.length || 0,
          today: messages.filter((msg: any) => {
            const msgDate = new Date(msg.timestamp)
            return msgDate >= today
          }).length || 0,
        },
        documents: {
          total: documents.length || 0,
          size: documents.reduce((acc: number, doc: any) => acc + (doc.size || 0), 0),
        },
        team: {
          total: team.members?.length || 0,
          online: team.members?.filter((member: any) => member.status === 'active').length || 0,
        },
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateChatbot = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/chatbots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChatbot),
      })

      if (!response.ok) {
        throw new Error('Failed to create chatbot')
      }

      const chatbot = await response.json()
      
      // Show success toast
      toast({
        title: "Success",
        description: `Chatbot "${chatbot.name}" created successfully`,
        variant: "default",
      })

      // Reset form and close dialog
      setNewChatbot({ name: '', description: '' })
      setIsDialogOpen(false)

      // Refresh dashboard data
      await fetchDashboardData()
    } catch (error) {
      console.error('Error creating chatbot:', error)
      toast({
        title: "Error",
        description: "Failed to create chatbot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Overview of your chatbots and activity
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Chatbot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Chatbot</DialogTitle>
              <DialogDescription>
                Give your chatbot a name and description to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newChatbot.name}
                  onChange={(e) => setNewChatbot({ ...newChatbot, name: e.target.value })}
                  placeholder="e.g., Customer Support Bot"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newChatbot.description}
                  onChange={(e) => setNewChatbot({ ...newChatbot, description: e.target.value })}
                  placeholder="What does this chatbot do?"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateChatbot}>Create Chatbot</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chatbots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.chatbots.total}</div>
            <p className="text-xs text-muted-foreground">
              {data?.chatbots.active} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.messages.total}</div>
            <p className="text-xs text-muted-foreground">
              {data?.messages.today} today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.documents.total}</div>
            <p className="text-xs text-muted-foreground">
              {formatBytes(data?.documents.size || 0)} total size
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.team.total}</div>
            <p className="text-xs text-muted-foreground">
              {data?.team.online} online
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Activity Timeline */}
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 border-l-2 border-muted" />
              <div className="space-y-6">
                {[
                  {
                    title: "New message received",
                    description: "Customer Support Bot responded to a query",
                    time: "5 minutes ago",
                    icon: MessageSquare,
                  },
                  {
                    title: "Document uploaded",
                    description: "New training document added: product-manual.pdf",
                    time: "1 hour ago",
                    icon: FileText,
                  },
                  {
                    title: "Chatbot created",
                    description: "New chatbot 'Sales Assistant' was created",
                    time: "2 hours ago",
                    icon: Bot,
                  },
                ].map((activity, i) => (
                  <div key={i} className="relative flex gap-4">
                    <div className="absolute left-0 rounded-full bg-background p-2 border">
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="ml-12">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions and Training Progress */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <Bot className="mr-2 h-4 w-4" />
                  Create New Chatbot
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Chatbot</DialogTitle>
                  <DialogDescription>
                    Give your chatbot a name and description to get started.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newChatbot.name}
                      onChange={(e) => setNewChatbot({ ...newChatbot, name: e.target.value })}
                      placeholder="e.g., Customer Support Bot"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newChatbot.description}
                      onChange={(e) => setNewChatbot({ ...newChatbot, description: e.target.value })}
                      placeholder="What does this chatbot do?"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreateChatbot} 
                    disabled={isLoading || !newChatbot.name.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Chatbot'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button className="w-full justify-start" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Training Documents
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              View Recent Messages
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Configure Chatbot Settings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Code className="mr-2 h-4 w-4" />
              View API Documentation
            </Button>
          </CardContent>
        </Card>

        {/* Training Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5" />
              Training Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Customer Support Bot</span>
                <span>75%</span>
              </div>
              <Progress value={75} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sales Assistant</span>
                <span>45%</span>
              </div>
              <Progress value={45} />
            </div>
            <Button className="w-full" variant="outline">
              View All Training Jobs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="font-medium">API Status</span>
              </div>
              <p className="text-sm text-muted-foreground">All systems operational</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="font-medium">Model Status</span>
              </div>
              <p className="text-sm text-muted-foreground">Models responding normally</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="font-medium">Training Queue</span>
              </div>
              <p className="text-sm text-muted-foreground">3 jobs in queue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Usage & Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Calls (24h)</span>
                <span>2,450 / 10,000</span>
              </div>
              <Progress value={24.5} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Used</span>
                <span>156 MB / 1 GB</span>
              </div>
              <Progress value={15.6} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Team Members</span>
                <span>5 / 10</span>
              </div>
              <Progress value={50} />
            </div>
            <Button variant="outline" className="w-full">
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Response Accuracy</span>
                <span className="text-green-500">+12% ↑</span>
              </div>
              <Progress value={92} />
              <p className="text-xs text-muted-foreground">
                92% accuracy in the last 7 days
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>User Satisfaction</span>
                <span className="text-green-500">+8% ↑</span>
              </div>
              <Progress value={88} />
              <p className="text-xs text-muted-foreground">
                88% positive feedback
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5" />
            Recent Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Slack Integration",
                status: "active",
                lastSync: "2 minutes ago",
                icon: MessageSquare,
              },
              {
                name: "Zendesk Connection",
                status: "syncing",
                lastSync: "in progress",
                icon: Headphones,
              },
              {
                name: "Shopify Store",
                status: "active",
                lastSync: "5 minutes ago",
                icon: ShoppingBag,
              },
            ].map((integration) => (
              <div key={integration.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <integration.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Last synced: {integration.lastSync}
                    </p>
                  </div>
                </div>
                <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                  {integration.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Resource Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="bg-blue-100 dark:bg-blue-900">
                <div className="bg-blue-500" style={{ width: '45%' }} />
              </Progress>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory</span>
                <span>68%</span>
              </div>
              <Progress value={68} className="bg-green-100 dark:bg-green-900">
                <div className="bg-green-500" style={{ width: '68%' }} />
              </Progress>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span>32%</span>
              </div>
              <Progress value={32} className="bg-orange-100 dark:bg-orange-900">
                <div className="bg-orange-500" style={{ width: '32%' }} />
              </Progress>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Latest Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Latest Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                user: "John Doe",
                message: "The chatbot responses are getting more accurate!",
                rating: 5,
                time: "10 minutes ago",
              },
              {
                user: "Sarah Smith",
                message: "Quick and helpful responses to customer queries.",
                rating: 4,
                time: "1 hour ago",
              },
              {
                user: "Mike Johnson",
                message: "Great improvement in handling technical questions.",
                rating: 5,
                time: "2 hours ago",
              },
            ].map((feedback, i) => (
              <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${feedback.user}`} />
                  <AvatarFallback>{feedback.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{feedback.user}</p>
                    <div className="flex items-center">
                      {Array.from({ length: feedback.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{feedback.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{feedback.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Training Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Upcoming Training Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Product Knowledge Base Update",
                scheduled: "Tomorrow at 2:00 PM",
                status: "scheduled",
                documents: 15,
              },
              {
                name: "Customer Support Training",
                scheduled: "In 3 days",
                status: "pending",
                documents: 8,
              },
              {
                name: "Sales FAQ Update",
                scheduled: "Next week",
                status: "scheduled",
                documents: 12,
              },
            ].map((job, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{job.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.documents} documents • {job.scheduled}
                  </p>
                </div>
                <Badge variant={job.status === 'scheduled' ? 'default' : 'secondary'}>
                  {job.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Training Jobs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
