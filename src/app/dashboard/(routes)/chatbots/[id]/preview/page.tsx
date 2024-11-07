'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatWidget } from "@/components/chat-widget"
import { EmbedCodeGenerator } from "@/components/embed-code-generator"
import { useToast } from "@/hooks/use-toast"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

interface Chatbot {
  id: string
  name: string
  description: string
}

export default function ChatbotPreviewPage({ params }: { params: { id: string } }) {
  const [chatbot, setChatbot] = useState<Chatbot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchChatbot = async () => {
      try {
        const response = await fetch(`/api/chatbots/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch chatbot')
        const data = await response.json()
        setChatbot(data)
      } catch (error) {
        console.error('Error fetching chatbot:', error)
        setError('Failed to load chatbot')
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load chatbot",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatbot()
  }, [params.id, toast])

  if (isLoading) {
    return <LoadingState message="Loading chatbot..." />
  }

  if (error || !chatbot) {
    return <ErrorState message={error || 'Chatbot not found'} />
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{chatbot.name}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Preview and test your chatbot
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Chat Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatWidget chatbotId={chatbot.id} />
          </CardContent>
        </Card>

        {/* Embed Code */}
        <Card>
          <CardHeader>
            <CardTitle>Embed Code</CardTitle>
          </CardHeader>
          <CardContent>
            <EmbedCodeGenerator chatbotId={chatbot.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 