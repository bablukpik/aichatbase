import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

    // Get team members and pending invites
    const [members, invites] = await Promise.all([
      prisma.user.findMany({
        where: { organizationId: user.organizationId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          // Add other fields as needed
        },
      }),
      prisma.teamInvite.findMany({
        where: { organizationId: user.organizationId },
        select: {
          id: true,
          email: true,
          role: true,
          expiresAt: true,
        },
      }),
    ])

    return NextResponse.json({ members, invites })
  } catch (error) {
    console.error("[TEAM_MEMBERS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 