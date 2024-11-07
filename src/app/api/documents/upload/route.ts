import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { r2 } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { generateId } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const chatbotId = formData.get('chatbotId') as string
    
    if (!file || !chatbotId) {
      return NextResponse.json(
        { error: "File and chatbotId are required" },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      )
    }

    try {
      // Get file buffer
      const buffer = Buffer.from(await file.arrayBuffer())

      // Generate unique file key
      const fileKey = `${generateId()}-${file.name}`

      // Upload to R2 with retries
      try {
        await r2.send(new PutObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: fileKey,
          Body: buffer,
          ContentType: file.type,
          ContentDisposition: `attachment; filename="${file.name}"`,
        }))
      } catch (r2Error) {
        console.error("[R2_UPLOAD_ERROR]", r2Error)
        return NextResponse.json(
          { error: "Failed to upload file to storage" },
          { status: 500 }
        )
      }

      // Create document record with chatbot name
      const document = await prisma.document.create({
        data: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: `https://${process.env.R2_BUCKET}.r2.cloudflarestorage.com/${fileKey}`,
          chatbotId: chatbotId,
        },
        include: {
          chatbot: {
            select: {
              name: true
            }
          }
        }
      })

      // Format response to include chatbot name
      const formattedDocument = {
        ...document,
        chatbotName: document.chatbot.name
      }

      return NextResponse.json(formattedDocument)
    } catch (dbError) {
      console.error("[DB_ERROR]", dbError)
      return NextResponse.json(
        { error: "Failed to create document record" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[DOCUMENT_UPLOAD]", error)
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    )
  }
} 