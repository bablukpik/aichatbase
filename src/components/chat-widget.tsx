'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, X, Minimize2, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatWidgetProps {
  apiKey: string
  chatbotId: string
  theme?: {
    primaryColor?: string
    position?: 'left' | 'right'
    initialMessage?: string
    title?: string
    subtitle?: string
  }
}

export function ChatWidget({
  apiKey,
  chatbotId,
  theme = {
    primaryColor: '#2563eb',
    position: 'right',
    initialMessage: 'Hello! How can I help you today?',
    title: 'Customer Support',
    subtitle: 'Ask me anything!',
  }
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: theme.initialMessage!,
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, theme.initialMessage])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('https://api.your-domain.com/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          chatbotId,
          message: input,
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      // Add error handling here
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-4 shadow-lg",
          theme.position === 'right' ? 'right-4' : 'left-4'
        )}
        style={{ backgroundColor: theme.primaryColor }}
      >
        <Bot className="mr-2 h-4 w-4" />
        Chat with us
      </Button>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 w-[400px] rounded-lg shadow-xl bg-background border",
        theme.position === 'right' ? 'right-4' : 'left-4',
        isMinimized ? 'h-auto' : 'h-[600px]'
      )}
    >
      {/* Header */}
      <div 
        className="p-4 rounded-t-lg flex items-center justify-between"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <div className="text-white">
          <h3 className="font-semibold">{theme.title}</h3>
          {!isMinimized && (
            <p className="text-sm opacity-90">{theme.subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:text-white/90"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:text-white/90"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 p-4 h-[480px]" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-lg p-3 max-w-[80%]",
                      message.role === 'user'
                        ? "text-white"
                        : "bg-muted",
                      message.role === 'user' && {
                        backgroundColor: theme.primaryColor,
                      }
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {message.role === 'user' && (
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
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
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading}
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  )
} 