import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { r2 } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const chatbotId = formData.get('chatbotId') as string

    if (!file) {
      return new NextResponse("No file provided", { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const key = `${session.user.email}/${chatbotId}/${Date.now()}-${file.name}`

    // Upload to R2
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    )

    // Save document reference in database
    const document = await prisma.document.create({
      data: {
        name: file.name,
        type: file.type,
        size: file.size,
        url: `https://${process.env.R2_BUCKET}.r2.dev/${key}`,
        chatbotId,
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error("[UPLOAD_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 