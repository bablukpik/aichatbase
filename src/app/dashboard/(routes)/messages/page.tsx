'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { 
  fetchMessages, 
  selectAllMessages,
  selectMessagesStatus,
  selectMessagesError
} from "@/features/messages/messagesSlice"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { columns } from "./columns"

export default function MessagesPage() {
  const dispatch = useAppDispatch()
  const messages = useAppSelector(selectAllMessages)
  const status = useAppSelector(selectMessagesStatus)
  const error = useAppSelector(selectMessagesError)

  useEffect(() => {
    dispatch(fetchMessages())
  }, [dispatch])

  if (status === 'loading') {
    return <LoadingState message="Loading messages..." />
  }

  if (status === 'failed') {
    return <ErrorState message={error || 'Failed to load messages'} />
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          View and manage chat messages across all chatbots
        </p>
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={messages} />
        </CardContent>
      </Card>
    </div>
  )
} 