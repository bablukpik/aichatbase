import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Get audit logs
    const auditLogs = await prisma.auditLog.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { timestamp: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(auditLogs)
  } catch (error) {
    console.error("[AUDIT_LOGS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { action, resourceType, resourceId, details } = json

    const headersList = headers()
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const auditLog = await prisma.auditLog.create({
      data: {
        action,
        userId: user.id,
        resourceType,
        resourceId,
        details,
        ipAddress,
        userAgent,
        organizationId: user.organizationId,
      },
    })

    return NextResponse.json(auditLog)
  } catch (error) {
    console.error("[AUDIT_LOG_CREATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 