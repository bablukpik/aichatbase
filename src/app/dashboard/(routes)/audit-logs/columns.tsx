"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { AuditLog } from "@/features/audit/auditSlice"

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string
      return (
        <Badge variant={
          action.toLowerCase().includes('delete') ? 'destructive' :
          action.toLowerCase().includes('create') ? 'default' :
          'secondary'
        }>
          {action}
        </Badge>
      )
    },
  },
  {
    accessorKey: "userName",
    header: "User",
    cell: ({ row }) => {
      const userName = row.getValue("userName") as string
      const userEmail = row.original.userEmail
      return (
        <div>
          <div className="font-medium">{userName}</div>
          <div className="text-sm text-muted-foreground">{userEmail}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "resourceType",
    header: "Resource Type",
  },
  {
    accessorKey: "resourceId",
    header: "Resource ID",
    cell: ({ row }) => {
      const id = row.getValue("resourceId") as string
      return <code className="rounded bg-muted px-2 py-1">{id}</code>
    },
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      const details = row.getValue("details") as string
      return (
        <div className="max-w-[500px] truncate" title={details}>
          {details}
        </div>
      )
    },
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
  },
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => {
      const timestamp = new Date(row.getValue("timestamp"))
      return (
        <div title={timestamp.toLocaleString()}>
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </div>
      )
    },
  },
] 