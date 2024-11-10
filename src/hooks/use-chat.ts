'use client'

import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatContext {
  previousMessages: Message[]
}

export function useChat(botId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string) => {
    setIsLoading(true)
    try {
      // Add user message to state immediately
      const userMessage: Message = { role: 'user', content }
      setMessages(prev => [...prev, userMessage])

      // Prepare context with previous messages
      const context: ChatContext = {
        previousMessages: messages
      }

      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          chatbotId: botId,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Add assistant's response to messages
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
      }
      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      // Optionally add error handling UI here
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    sendMessage,
    isLoading,
  }
} 