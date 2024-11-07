'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { 
  fetchAuditLogs, 
  selectAllLogs,
  selectAuditStatus,
  selectAuditError
} from "@/features/audit/auditSlice"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { columns } from "./columns"

export default function AuditLogsPage() {
  const dispatch = useAppDispatch()
  const logs = useAppSelector(selectAllLogs)
  const status = useAppSelector(selectAuditStatus)
  const error = useAppSelector(selectAuditError)

  useEffect(() => {
    dispatch(fetchAuditLogs())
  }, [dispatch])

  if (status === 'loading') {
    return <LoadingState message="Loading audit logs..." />
  }

  if (status === 'failed') {
    return <ErrorState message={error || 'Failed to load audit logs'} />
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track and monitor system activities
        </p>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={logs} />
        </CardContent>
      </Card>
    </div>
  )
} 