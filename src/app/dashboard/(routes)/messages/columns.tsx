"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { Message } from "@/features/messages/messagesSlice"
import { useAppDispatch } from "@/hooks/redux"
import { deleteMessage } from "@/features/messages/messagesSlice"
import { useToast } from "@/hooks/use-toast"

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: "chatbotName",
    header: "Chatbot",
  },
  {
    accessorKey: "content",
    header: "Message",
    cell: ({ row }) => {
      const content = row.getValue("content") as string
      return (
        <div className="max-w-[500px] truncate" title={content}>
          {content}
        </div>
      )
    },
  },
  {
    accessorKey: "response",
    header: "Response",
    cell: ({ row }) => {
      const response = row.getValue("response") as string
      return (
        <div className="max-w-[500px] truncate" title={response}>
          {response}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={
          status === 'success' ? 'default' :
          status === 'pending' ? 'secondary' : 'destructive'
        }>
          {status}
        </Badge>
      )
    },
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
  {
    id: "actions",
    cell: ({ row }) => {
      const message = row.original
      const dispatch = useAppDispatch()
      const { toast } = useToast()

      const handleDelete = async () => {
        try {
          await dispatch(deleteMessage(message.id)).unwrap()
          toast({
            title: "Success",
            description: "Message deleted successfully",
          })
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete message",
          })
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(message.content)}
            >
              Copy message
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 