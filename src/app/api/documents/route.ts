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
            documents: true,
          },
        },
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Format documents for the frontend
    const documents = user.chatbots.flatMap(chatbot =>
      chatbot.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        size: doc.size,
        url: doc.url,
        chatbotId: chatbot.id,
        chatbotName: chatbot.name,
        createdAt: doc.createdAt,
        status: 'processed' as const,
      }))
    )

    return NextResponse.json(documents)
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 