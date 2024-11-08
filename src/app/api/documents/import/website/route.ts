import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { r2 } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { generateId } from "@/lib/utils"
import * as cheerio from 'cheerio'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { url, chatbotId, customName } = await req.json()

    if (!url || !chatbotId) {
      return NextResponse.json(
        { error: "URL and chatbotId are required" },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(url)
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      )
    }

    // Fetch and parse website content
    const response = await fetch(url)
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch website content" },
        { status: 400 }
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract text content and remove scripts, styles, etc.
    $('script').remove()
    $('style').remove()
    $('noscript').remove()
    $('iframe').remove()
    $('svg').remove()

    // Get main content
    const content = $('body')
      .text()
      .replace(/\s+/g, ' ')
      .trim()

    // Generate unique file key
    const fileKey = `${generateId()}-${new URL(url).hostname}.txt`

    // Upload to R2
    try {
      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: fileKey,
        Body: Buffer.from(content),
        ContentType: 'text/plain',
        ContentDisposition: `attachment; filename="${new URL(url).hostname}.txt"`,
      }))
    } catch (r2Error) {
      console.error("[R2_UPLOAD_ERROR]", r2Error)
      return NextResponse.json(
        { error: "Failed to store website content" },
        { status: 500 }
      )
    }

    // Create document record with custom name if provided
    const document = await prisma.document.create({
      data: {
        name: customName || `Website Import: ${new URL(url).hostname}`,
        type: 'text/plain',
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
  } catch (error) {
    console.error("[WEBSITE_IMPORT]", error)
    return NextResponse.json(
      { error: "Failed to import website content" },
      { status: 500 }
    )
  }
} 