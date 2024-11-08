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

    const { phase, progress } = await req.json()
    const chatbotId = params.chatbotId

    // Get the chatbot and verify ownership
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      include: {
        user: true,
        documents: true,
      }
    })

    if (!chatbot || chatbot.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Chatbot not found or unauthorized" },
        { status: 404 }
      )
    }

    // Update training status
    // In a real application, you would store this in a database
    // For now, we'll just return a simulated response
    const trainingStatus = {
      chatbotId,
      phase,
      progress,
      phases: [
        { phase: "Data Processing", progress: 100, status: "completed" },
        { phase: "Context Analysis", progress: 100, status: "completed" },
        { phase: "Model Training", progress: progress, status: "in-progress" },
        { phase: "Fine-tuning", progress: 0, status: "pending" },
        { phase: "Validation", progress: 0, status: "pending" },
      ],
      documentsProcessed: Math.floor(chatbot.documents.length * (progress / 100)),
      totalDocuments: chatbot.documents.length,
      timeRemaining: Math.max(0, Math.floor((100 - progress) / 5)), // Simulated time remaining in minutes
      currentAccuracy: Math.min(92, 80 + (progress / 5)), // Simulated accuracy
      trainingSpeed: 2300 + Math.random() * 200, // Simulated training speed
    }

    // Log the training progress
    await logAuditEvent({
      action: "TRAINING_PROGRESS",
      resourceType: "chatbot",
      resourceId: chatbotId,
      details: `Training progress: ${phase} - ${progress}%`,
      userId: chatbot.user.id,
      ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
      organizationId: chatbot.user.organizationId,
    })

    return NextResponse.json(trainingStatus)
  } catch (error) {
    console.error("[TRAINING_PHASE_UPDATE]", error)
    return NextResponse.json(
      { error: "Failed to update training phase" },
      { status: 500 }
    )
  }
} 