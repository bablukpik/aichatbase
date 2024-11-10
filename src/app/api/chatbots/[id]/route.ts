import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    // if (!session?.user?.email) {
    //   return new NextResponse("Unauthorized", { status: 401 })
    // }

    const chatbot = await prisma.chatbot.findUnique({
      where: { id: params.id },
      include: {
        documents: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    // const chatbot = await prisma.chatbot.findUnique({
    //   where: {
    //     id: params.id,
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     description: true,
    //     model: true,
    //     temperature: true,
    //     maxTokens: true,
    //   },
    // })

    if (!chatbot) {
      return new NextResponse("Chatbot not found", { status: 404 })
    }

    return NextResponse.json(chatbot)
  } catch (error) {
    console.error("[CHATBOT_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { name, description, model, temperature, maxTokens } = json

    const chatbot = await prisma.chatbot.update({
      where: { id: params.id },
      data: {
        name,
        description,
        model,
        temperature,
        maxTokens,
      }
    })

    return NextResponse.json(chatbot)
  } catch (error) {
    console.error("[CHATBOT_UPDATE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.chatbot.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[CHATBOT_DELETE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 