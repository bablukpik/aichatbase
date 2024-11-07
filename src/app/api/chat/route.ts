import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
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
      return new NextResponse("Chatbot not found", { status: 404 })
    }

    // Get relevant context from documents
    const relevantDocs = chatbot.documents.map(doc => doc.url).join('\n')

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
  } catch (error) {
    console.error("[CHAT_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 