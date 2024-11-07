'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Bot, Settings, Trash2 } from "lucide-react"
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

interface Chatbot {
  id: string
  name: string
  description: string | null
  messages: number
  lastActive: string
  model: string
  temperature: number
  maxTokens: number
}

export default function ChatbotsPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const [newChatbot, setNewChatbot] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    fetchChatbots()
  }, [])

  const fetchChatbots = async () => {
    try {
      const response = await fetch('/api/chatbots')
      if (!response.ok) throw new Error('Failed to fetch chatbots')
      const data = await response.json()
      setChatbots(data)
    } catch (error) {
      console.error('Error fetching chatbots:', error)
      setError('Failed to load chatbots')
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load chatbots",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateChatbot = async () => {
    try {
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
      setChatbots(prev => [chatbot, ...prev])
      setNewChatbot({ name: '', description: '' })
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Chatbot created successfully",
      })
    } catch (error) {
      console.error('Error creating chatbot:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create chatbot",
      })
    }
  }

  const handleDeleteChatbot = async (id: string) => {
    try {
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete chatbot')
      }

      setChatbots(prev => prev.filter(bot => bot.id !== id))
      toast({
        title: "Success",
        description: "Chatbot deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting chatbot:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete chatbot",
      })
    }
  }

  const formatMessageCount = (count: number) => {
    if (typeof count !== 'number') return '0'
    return count.toLocaleString()
  }

  if (isLoading) {
    return <LoadingState message="Loading chatbots..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Chatbots</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Create and manage your AI chatbots
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
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

      {/* Chatbots Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {chatbots.map((chatbot) => (
          <Card key={chatbot.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  {chatbot.name}
                </div>
              </CardTitle>
              <div className="flex gap-2">
                <Link href={`/dashboard/chatbots/${chatbot.id}`}>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteChatbot(chatbot.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="min-h-[40px]">
                {chatbot.description || 'No description'}
              </CardDescription>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {formatMessageCount(chatbot.messages)} messages
                </div>
                <div className="text-sm text-muted-foreground">
                  Active {new Date(chatbot.lastActive).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/dashboard/chatbots/${chatbot.id}`} className="w-full">
                  <Button className="w-full" variant="secondary">
                    Configure
                  </Button>
                </Link>
                <Link href={`/dashboard/chatbots/${chatbot.id}/preview`} className="w-full">
                  <Button className="w-full">
                    Preview
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create New Chatbot Card */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center justify-center min-h-[250px] border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full py-8">
                <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Create New Chatbot</p>
                <p className="text-sm text-muted-foreground">
                  Add a new AI chatbot to your collection
                </p>
              </CardContent>
            </Card>
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
                <Label htmlFor="name-2">Name</Label>
                <Input
                  id="name-2"
                  value={newChatbot.name}
                  onChange={(e) => setNewChatbot({ ...newChatbot, name: e.target.value })}
                  placeholder="e.g., Customer Support Bot"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description-2">Description</Label>
                <Input
                  id="description-2"
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
    </div>
  )
}