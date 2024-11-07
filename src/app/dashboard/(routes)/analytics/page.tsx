'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsChart } from "@/components/analytics-chart"
import { 
  Users, 
  MessageSquare, 
  Bot, 
  BrainCircuit,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Globe
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { 
  fetchAnalytics, 
  setPeriod,
  selectAnalyticsData,
  selectAnalyticsPeriod,
  selectAnalyticsStatus,
  selectAnalyticsError
} from "@/features/analytics/analyticsSlice"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

export default function AnalyticsPage() {
  const dispatch = useAppDispatch()
  const data = useAppSelector(selectAnalyticsData)
  const period = useAppSelector(selectAnalyticsPeriod)
  const status = useAppSelector(selectAnalyticsStatus)
  const error = useAppSelector(selectAnalyticsError)

  useEffect(() => {
    dispatch(fetchAnalytics(period))
  }, [dispatch, period])

  if (status === 'loading') {
    return <LoadingState message="Loading analytics..." />
  }

  if (status === 'failed') {
    return <ErrorState message={error || 'Failed to load analytics'} />
  }

  if (!data) {
    return null
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and analyze your chatbot performance
          </p>
        </div>
        <Select 
          value={period}
          onValueChange={(value: '24h' | '7d' | '30d' | '90d') => dispatch(setPeriod(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              15% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalMessages.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              2.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Chatbots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeChatbots.toLocaleString()}</div>
            <div className="flex items-center text-xs text-red-500">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              1 less than last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.trainingSessions.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              8 more than last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Usage Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart 
              data={data.usageTrends}
              title="Messages per Day"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart 
              data={data.responseTimes}
              title="Average Response Time (s)"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart 
              data={data.accuracy}
              title="Response Accuracy (%)"
            />
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg">
              Map Visualization Coming Soon
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 