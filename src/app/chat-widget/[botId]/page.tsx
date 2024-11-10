'use client'

import { useState, useEffect } from 'react'
import { useChat } from '@/hooks/use-chat'
import { MessageCircle, Minus, Send } from 'lucide-react'

export default function ChatWidget({ params }: { params: { botId: string } }) {
  const [message, setMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [botExists, setBotExists] = useState(false)
  const [botInfo, setBotInfo] = useState<{ name: string } | null>(null)
  const { messages, sendMessage, isLoading } = useChat(params.botId)

  useEffect(() => {
    const checkBot = async () => {
      try {
        const response = await fetch(`/api/chatbots/${params.botId}`)
        if (response.ok) {
          const data = await response.json()
          setBotInfo(data)
          setBotExists(true)
        }
      } catch (error) {
        console.error('Error checking bot:', error)
      }
    }

    checkBot()
  }, [params.botId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    await sendMessage(message)
    setMessage('')
  }

  if (!botExists) {
    return null
  }

  return (
    <>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-4 right-4 flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div className="fixed bottom-4 right-4 flex flex-col w-[350px] h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-lg transition-all duration-300 ease-in-out z-50">
          {/* Header */}
          <div 
            className="flex items-center px-4 py-3 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800 rounded-t-lg cursor-pointer select-none"
            onClick={() => setIsExpanded(false)}
          >
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                {botInfo?.name || 'Chat Assistant'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isLoading ? 'Typing...' : 'Online'}
              </p>
            </div>
            <button 
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(false)
              }}
            >
              <Minus className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400 text-sm">
                Send a message to start the conversation
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-gray-100 dark:bg-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500 dark:text-gray-100 text-sm"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-blue-500 text-white rounded-full disabled:opacity-50 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
} 