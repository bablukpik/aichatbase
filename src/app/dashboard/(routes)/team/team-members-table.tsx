'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Shield, UserX } from "lucide-react"
import { TeamMember } from "@/features/team/teamSlice"
import { useAppDispatch } from "@/hooks/redux"
import { removeTeamMember } from "@/features/team/teamSlice"
import { useToast } from "@/hooks/use-toast"

interface TeamMembersTableProps {
  members: TeamMember[]
}

export function TeamMembersTable({ members }: TeamMembersTableProps) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleRemoveMember = async (memberId: string) => {
    try {
      await dispatch(removeTeamMember(memberId)).unwrap()
      toast({
        title: "Success",
        description: "Team member removed successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove team member",
      })
    }
  }

  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Email
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Role
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Joined
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle">{member.name}</td>
                  <td className="p-4 align-middle">{member.email}</td>
                  <td className="p-4 align-middle">
                    <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                      {member.role}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge 
                      variant={
                        member.status === 'active' ? 'success' :
                        member.status === 'pending' ? 'warning' : 'destructive'
                      }
                    >
                      {member.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {new Date(member.joinedAt).toLocaleDateString()}
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
                          onClick={() => navigator.clipboard.writeText(member.email)}
                        >
                          Copy email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Change role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Remove member
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