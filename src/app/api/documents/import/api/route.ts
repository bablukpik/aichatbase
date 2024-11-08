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

    const { endpoint, chatbotId, headers = {}, method = 'GET', customName } = await req.json()

    if (!endpoint || !chatbotId) {
      return NextResponse.json(
        { error: "Endpoint and chatbotId are required" },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(endpoint)
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid API endpoint" },
        { status: 400 }
      )
    }

    // Fetch data from API
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      const content = JSON.stringify(data, null, 2)

      // Generate unique file key
      const fileKey = `${generateId()}-${new URL(endpoint).hostname}.json`

      // Upload to R2
      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: fileKey,
        Body: Buffer.from(content),
        ContentType: 'application/json',
        ContentDisposition: `attachment; filename="${new URL(endpoint).hostname}.json"`,
      }))

      // Create document record with custom name if provided
      const document = await prisma.document.create({
        data: {
          name: customName || `API Import: ${new URL(endpoint).hostname}`,
          type: 'application/json',
          size: Buffer.byteLength(content),
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
    } catch (apiError) {
      console.error("[API_REQUEST_ERROR]", apiError)
      return NextResponse.json(
        { error: `Failed to fetch API data: ${apiError.message}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[API_IMPORT]", error)
    return NextResponse.json(
      { error: "Failed to import API data" },
      { status: 500 }
    )
  }
} 