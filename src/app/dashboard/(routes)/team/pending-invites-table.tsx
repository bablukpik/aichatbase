'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, RefreshCw, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PendingInvite {
  id: string
  email: string
  role: 'admin' | 'member'
  expiresAt: string
}

interface PendingInvitesTableProps {
  invites: PendingInvite[]
}

export function PendingInvitesTable({ invites }: PendingInvitesTableProps) {
  const { toast } = useToast()

  const handleResendInvite = async (inviteId: string) => {
    // TODO: Implement resend invite functionality
    toast({
      title: "Success",
      description: "Invitation resent successfully",
    })
  }

  const handleCancelInvite = async (inviteId: string) => {
    // TODO: Implement cancel invite functionality
    toast({
      title: "Success",
      description: "Invitation cancelled successfully",
    })
  }

  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Email
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Role
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Expires
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {invites.map((invite) => (
                <tr
                  key={invite.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle">{invite.email}</td>
                  <td className="p-4 align-middle">
                    <Badge variant="secondary">
                      {invite.role}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {new Date(invite.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 align-middle">
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
                          onClick={() => handleResendInvite(invite.id)}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend invite
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleCancelInvite(invite.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel invite
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 