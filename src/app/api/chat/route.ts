import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(req: Request) {
  try {
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: "OpenAI API key not configured",
        details: "Please configure OPENAI_API_KEY in environment variables"
      }, { status: 500 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: "Unauthorized",
        details: "User session not found" 
      }, { status: 401 })
    }

    const json = await req.json()
    const { message, chatbotId, context } = json

    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      include: {
        documents: true,
      }
    })

    if (!chatbot) {
      return NextResponse.json({ 
        error: "Not Found",
        details: "Chatbot not found" 
      }, { status: 404 })
    }

    // Get relevant context from documents
    const relevantDocs = chatbot.documents.map(doc => doc.url).join('\n')

    try {
      const completion = await openai.chat.completions.create({
        model: chatbot.model,
        temperature: chatbot.temperature,
        max_tokens: chatbot.maxTokens,
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant trained on the following documents:\n${relevantDocs}\nUse this information to answer questions accurately.`
          },
          ...context.previousMessages,
          { role: "user", content: message }
        ],
      })

      const response = completion.choices[0].message.content

      // Save the message to the database
      await prisma.message.create({
        data: {
          content: message,
          role: "user",
          chatbotId,
        }
      })

      await prisma.message.create({
        data: {
          content: response || "",
          role: "assistant",
          chatbotId,
        }
      })

      return NextResponse.json({ response })

    } catch (openAIError: any) {
      // Handle OpenAI specific errors
      if (openAIError.error?.type === 'insufficient_quota') {
        return NextResponse.json({
          error: "OpenAI API Quota Exceeded",
          details: "Your OpenAI API quota has been exceeded. Please check your billing details at platform.openai.com",
          code: openAIError.error.code
        }, { status: 429 })
      }

      if (openAIError.status === 429) {
        return NextResponse.json({
          error: "Rate Limit Exceeded",
          details: "Too many requests to OpenAI API. Please try again later.",
          code: 'rate_limit_exceeded'
        }, { status: 429 })
      }

      throw openAIError // Re-throw other OpenAI errors
    }

  } catch (error: any) {
    console.error("[CHAT_ERROR]", error)
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error.message || "An unexpected error occurred",
      code: error.code
    }, { status: 500 })
  }
} 