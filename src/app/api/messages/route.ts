import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        chatbots: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 100,
            },
          },
        },
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Format messages for the frontend
    const messages = user.chatbots.flatMap(chatbot =>
      chatbot.messages.map(message => ({
        id: message.id,
        chatbotId: chatbot.id,
        chatbotName: chatbot.name,
        content: message.content,
        response: message.role === 'assistant' ? message.content : '',
        status: 'success',
        timestamp: message.createdAt,
      }))
    )

    return NextResponse.json(messages)
  } catch (error) {
    console.error("[MESSAGES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const messageId = searchParams.get('id')

    if (!messageId) {
      return new NextResponse("Message ID required", { status: 400 })
    }

    await prisma.message.delete({
      where: { id: messageId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[MESSAGE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 