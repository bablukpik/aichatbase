import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatbotId, documents, modelConfig } = await req.json();

    if (!chatbotId || !documents?.length) {
      return NextResponse.json(
        { error: "Chatbot ID and selected documents are required" },
        { status: 400 }
      );
    }

    // Get the chatbot and verify ownership
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      include: {
        user: true,
        documents: {
          where: {
            id: {
              in: documents // Only include selected documents
            }
          }
        },
      }
    });

    if (!chatbot || chatbot.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Chatbot not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update chatbot with model configuration
    await prisma.chatbot.update({
      where: { id: chatbotId },
      data: {
        model: modelConfig.model,
        temperature: modelConfig.temperature,
        maxTokens: modelConfig.maxTokens,
      }
    })

    // Start training process
    await logAuditEvent({
      action: "START_TRAINING",
      resourceType: "chatbot",
      resourceId: chatbotId,
      details: `Started training with ${documents.length} selected documents and model ${modelConfig.model}`,
    });

    return NextResponse.json({
      success: true,
      message: "Training started",
      jobId: `train_${Date.now()}`,
    });
  } catch (error) {
    console.error("[TRAINING_POST]", error);
    return NextResponse.json(
      { error: "Failed to start training" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");

    if (!chatbotId) {
      return NextResponse.json(
        { error: "Chatbot ID is required" },
        { status: 400 }
      );
    }

    // Get training status and documents for the chatbot
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      include: {
        user: true,
        documents: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            name: true,
            type: true,
            size: true,
            url: true,
            createdAt: true,
          },
        },
      },
    });

    if (!chatbot || chatbot.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Chatbot not found or unauthorized" },
        { status: 404 }
      );
    }

    // Return both training status and documents
    return NextResponse.json({
      chatbotId,
      documentsCount: chatbot.documents.length,
      lastTrainingDate: chatbot.updatedAt,
      status: "ready", // You would get this from your training system
      documents: chatbot.documents, // Include the actual documents
      name: chatbot.name, // Include chatbot name
      model: chatbot.model,
      temperature: chatbot.temperature,
      maxTokens: chatbot.maxTokens,
    });
  } catch (error) {
    console.error("[TRAINING_GET]", error);
    return NextResponse.json(
      { error: "Failed to get training status" },
      { status: 500 }
    );
  }
}
