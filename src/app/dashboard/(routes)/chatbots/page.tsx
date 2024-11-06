'use client'

import { useState } from 'react'
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

interface Chatbot {
  id: string
  name: string
  description: string
  messages: number
  lastActive: string
}

export default function ChatbotsPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([
    {
      id: '1',
      name: 'Customer Support Bot',
      description: 'Handles common customer inquiries',
      messages: 1234,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Sales Assistant',
      description: 'Helps with product recommendations and sales inquiries',
      messages: 856,
      lastActive: '5 minutes ago'
    },
    {
      id: '3',
      name: 'Technical Support',
      description: 'Provides technical troubleshooting assistance',
      messages: 2341,
      lastActive: '1 hour ago'
    }
  ])

  const [newChatbot, setNewChatbot] = useState({
    name: '',
    description: ''
  })

  const handleCreateChatbot = async () => {
    // TODO: Implement chatbot creation
    const newBot: Chatbot = {
      id: (chatbots.length + 1).toString(),
      name: newChatbot.name,
      description: newChatbot.description,
      messages: 0,
      lastActive: 'Just now'
    }
    setChatbots([...chatbots, newBot])
    setNewChatbot({ name: '', description: '' })
  }

  const handleDeleteChatbot = (id: string) => {
    setChatbots(chatbots.filter(bot => bot.id !== id))
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
        <Dialog>
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
                {chatbot.description}
              </CardDescription>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {chatbot.messages.toLocaleString()} messages
                </div>
                <div className="text-sm text-muted-foreground">
                  Active {chatbot.lastActive}
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
        <Dialog>
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