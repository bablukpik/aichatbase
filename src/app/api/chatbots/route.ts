import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logAuditEvent } from "@/lib/audit"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const json = await req.json()
    const { name, description } = json

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const chatbot = await prisma.chatbot.create({
      data: {
        name,
        description,
        userId: user.id,
      }
    })

    // Log the audit event
    await logAuditEvent({
      action: "CREATE_CHATBOT",
      resourceType: "chatbot",
      resourceId: chatbot.id,
      details: `Created chatbot: ${name}`,
    })

    return NextResponse.json(chatbot)
  } catch (error) {
    console.error("[CHATBOTS_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

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
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            messages: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1,
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Format chatbots with additional info
    const chatbots = user.chatbots.map(chatbot => ({
      ...chatbot,
      messages: chatbot.messages.length,
      lastActive: chatbot.messages[0]?.createdAt || chatbot.createdAt,
    }))

    return NextResponse.json(chatbots)
  } catch (error) {
    console.error("[CHATBOTS_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 