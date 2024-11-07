import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signJwtAccessToken } from "@/lib/jwt"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return new NextResponse("Invalid credentials", { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return new NextResponse("Invalid credentials", { status: 401 })
    }

    const accessToken = signJwtAccessToken({ sub: user.id, email: user.email })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    })
  } catch (error) {
    console.error("[LOGIN_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 