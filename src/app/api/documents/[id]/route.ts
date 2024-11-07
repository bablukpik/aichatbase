import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { r2 } from "@/lib/r2"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get the document to find its R2 key
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        chatbot: {
          include: {
            user: true
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      )
    }

    // Check if user owns the document
    if (document.chatbot.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Extract file key from URL
    const fileKey = document.url.split('/').pop()

    // Delete from R2
    try {
      await r2.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: fileKey,
      }))
    } catch (r2Error) {
      console.error("[R2_DELETE_ERROR]", r2Error)
      // Continue with database deletion even if R2 deletion fails
    }

    // Delete from database
    await prisma.document.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DOCUMENT_DELETE]", error)
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    )
  }
} 