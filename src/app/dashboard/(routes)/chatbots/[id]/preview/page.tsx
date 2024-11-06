'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, ExternalLink } from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatbotPreviewPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a preview mode. In production, this would be an actual response from the AI based on your training data.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Preview Chatbot</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Test your chatbot and see how it appears to users
          </p>
        </div>
        <Button variant="outline">
          <ExternalLink className="mr-2 h-4 w-4" />
          Open in New Window
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chat Widget Preview */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Chat Widget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-sm opacity-90">Ask me anything!</p>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={`rounded-lg p-3 max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {message.role === 'user' && (
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Settings */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Preview Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Message</label>
              <Input 
                value="Hello! How can I help you today?"
                onChange={() => {}}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Scenarios</label>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setInput("What are your business hours?")}>
                  Ask about business hours
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setInput("How do I reset my password?")}>
                  Password reset inquiry
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setInput("I need help with my order")}>
                  Order support request
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Response Time</label>
              <div className="flex items-center gap-2">
                <Input type="number" min="0" max="5" step="0.1" defaultValue="1" />
                <span className="text-sm text-muted-foreground">seconds</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 