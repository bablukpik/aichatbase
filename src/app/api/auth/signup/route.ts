import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    try {
      // Create organization and user in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create organization first
        const organization = await tx.organization.create({
          data: {
            name: `${name}'s Organization`,
          },
        })

        // Create user with organization reference
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            organizationId: organization.id,
            subscription: {
              create: {
                stripePriceId: 'free',
              }
            }
          },
          include: {
            subscription: true,
            organization: true,
          }
        })

        return { user, organization }
      })

      // Remove sensitive data before sending response
      const { password: _, ...userWithoutPassword } = result.user

      return NextResponse.json({
        success: true,
        data: {
          user: userWithoutPassword,
          organization: result.organization,
        }
      })
    } catch (dbError) {
      console.error("[DB_ERROR]", dbError)
      return NextResponse.json(
        { error: "Failed to create account. Database error." },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[SIGNUP_ERROR]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
