import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: {
          connect: { name: 'Guest' } // Assuming 'Guest' is the default role
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        roles: {
          select: {
            name: true
          }
        }
      },
    })

    return NextResponse.json({ 
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roles[0]?.name || 'Guest',
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
