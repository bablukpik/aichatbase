import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        organization: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
              },
            },
            invites: {
              where: {
                status: 'pending',
              },
              select: {
                id: true,
                email: true,
                role: true,
                expiresAt: true,
                status: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Format the response
    const response = {
      members: user.organization.users.map(member => ({
        ...member,
        status: 'active',
        role: member.id === user.id ? 'owner' : 'member',
      })),
      invites: user.organization.invites,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[TEAM_MEMBERS_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const json = await req.json()
    const { email, role = 'member' } = json

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        organization: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const existingMember = await prisma.user.findFirst({
      where: {
        email,
        organizationId: user.organizationId,
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member" },
        { status: 400 }
      )
    }

    // Check if there's already a pending invite
    const existingInvite = await prisma.teamInvite.findFirst({
      where: {
        email,
        organizationId: user.organizationId,
        status: 'pending',
      },
    })

    if (existingInvite) {
      return NextResponse.json(
        { error: "Invite already sent" },
        { status: 400 }
      )
    }

    // Create new invite
    const invite = await prisma.teamInvite.create({
      data: {
        email,
        role,
        organizationId: user.organizationId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })

    // TODO: Send invitation email

    return NextResponse.json(invite)
  } catch (error) {
    console.error("[TEAM_INVITE_POST]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 