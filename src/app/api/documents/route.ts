import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        chatbots: {
          include: {
            documents: {
              orderBy: {
                createdAt: 'desc'
              },
              include: {
                chatbot: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Flatten documents from all chatbots and include chatbot name
    const documents = user.chatbots.flatMap(chatbot => 
      chatbot.documents.map(doc => ({
        ...doc,
        chatbotName: doc.chatbot.name
      }))
    )

    return NextResponse.json(documents)
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 