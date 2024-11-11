import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '7d'

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24)
        break
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    // Get user's chatbots
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        chatbots: {
          include: {
            messages: {
              where: {
                createdAt: {
                  gte: startDate,
                  lte: now
                }
              }
            }
          }
        }
      }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Calculate analytics data
    const totalMessages = user.chatbots.reduce((sum, bot) => sum + bot.messages.length, 0)
    const activeChatbots = user.chatbots.filter(bot => 
      bot.messages.some(msg => msg.createdAt >= startDate)
    ).length

    // Generate sample data for charts
    const usageTrends = generateTimeSeriesData(startDate, now, 'messages')
    const responseTimes = generateTimeSeriesData(startDate, now, 'response_time')
    const accuracy = generateTimeSeriesData(startDate, now, 'accuracy')

    const analyticsData = {
      totalUsers: 100, // Sample data
      totalMessages,
      activeChatbots,
      trainingSessions: 24, // Sample data
      usageTrends,
      responseTimes,
      accuracy,
      geographicData: [
        { country: 'United States', users: 450 },
        { country: 'United Kingdom', users: 270 },
        { country: 'Germany', users: 190 },
        { country: 'Japan', users: 160 },
        { country: 'France', users: 140 },
      ]
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("[ANALYTICS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

function generateTimeSeriesData(startDate: Date, endDate: Date, type: 'messages' | 'response_time' | 'accuracy') {
  const data = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    let value: number
    
    switch (type) {
      case 'messages':
        value = Math.floor(Math.random() * 500) + 100 // Random between 100-600
        break
      case 'response_time':
        value = Math.random() * 0.8 + 0.2 // Random between 0.2-1.0
        break
      case 'accuracy':
        value = Math.random() * 10 + 85 // Random between 85-95
        break
    }
    
    data.push({
      name: currentDate.toISOString().split('T')[0],
      total: value
    })
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return data
} 