import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logAuditEvent } from "@/lib/audit"

export async function POST(
  req: Request,
  { params }: { params: { chatbotId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const chatbotId = params.chatbotId

    // Get the chatbot and verify ownership
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      include: {
        user: true,
      }
    })

    if (!chatbot || chatbot.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Chatbot not found or unauthorized" },
        { status: 404 }
      )
    }

    // Log the cancellation
    await logAuditEvent({
      action: "CANCEL_TRAINING",
      resourceType: "chatbot",
      resourceId: chatbotId,
      details: "Training cancelled by user",
      userId: chatbot.user.id,
      ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
      organizationId: chatbot.user.organizationId,
    })

    return NextResponse.json({
      success: true,
      message: "Training cancelled",
    })
  } catch (error) {
    console.error("[TRAINING_CANCEL]", error)
    return NextResponse.json(
      { error: "Failed to cancel training" },
      { status: 500 }
    )
  }
} 