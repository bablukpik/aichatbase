'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, UserPlus, Users } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { 
  fetchTeamMembers, 
  selectAllMembers,
  selectAllInvites,
  selectTeamStatus,
  selectTeamError
} from "@/features/team/teamSlice"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { InviteMemberDialog } from "./invite-member-dialog"
import { TeamMembersTable } from "./team-members-table"
import { PendingInvitesTable } from "./pending-invites-table"

export default function TeamPage() {
  const dispatch = useAppDispatch()
  const members = useAppSelector(selectAllMembers)
  const invites = useAppSelector(selectAllInvites)
  const status = useAppSelector(selectTeamStatus)
  const error = useAppSelector(selectTeamError)

  useEffect(() => {
    dispatch(fetchTeamMembers())
  }, [dispatch])

  if (status === 'loading') {
    return <LoadingState message="Loading team members..." />
  }

  if (status === 'failed') {
    return <ErrorState message={error || 'Failed to load team members'} />
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
        <InviteMemberDialog>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </InviteMemberDialog>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMembersTable members={members} />
        </CardContent>
      </Card>

      {/* Pending Invites */}
      {invites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Pending Invites ({invites.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PendingInvitesTable invites={invites} />
          </CardContent>
        </Card>
      )}
    </div>
  )
} 