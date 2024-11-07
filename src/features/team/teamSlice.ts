import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  status: 'active' | 'pending' | 'inactive'
  joinedAt: string
  lastActive: string
}

interface TeamState {
  members: TeamMember[]
  invites: {
    id: string
    email: string
    role: 'admin' | 'member'
    expiresAt: string
  }[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: TeamState = {
  members: [],
  invites: [],
  status: 'idle',
  error: null,
}

export const fetchTeamMembers = createAsyncThunk(
  'team/fetchTeamMembers',
  async () => {
    const response = await fetch('/api/team/members')
    if (!response.ok) {
      throw new Error('Failed to fetch team members')
    }
    return response.json()
  }
)

export const inviteTeamMember = createAsyncThunk(
  'team/inviteTeamMember',
  async (data: { email: string; role: 'admin' | 'member' }) => {
    const response = await fetch('/api/team/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to invite team member')
    }
    return response.json()
  }
)

export const removeTeamMember = createAsyncThunk(
  'team/removeTeamMember',
  async (memberId: string) => {
    const response = await fetch(`/api/team/members/${memberId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to remove team member')
    }
    return memberId
  }
)

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Team Members
      .addCase(fetchTeamMembers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.members = action.payload.members
        state.invites = action.payload.invites
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch team members'
      })
      // Invite Team Member
      .addCase(inviteTeamMember.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(inviteTeamMember.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.invites.push(action.payload)
      })
      .addCase(inviteTeamMember.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to invite team member'
      })
      // Remove Team Member
      .addCase(removeTeamMember.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.members = state.members.filter(member => member.id !== action.payload)
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to remove team member'
      })
  },
})

export const { clearError } = teamSlice.actions

export const selectAllMembers = (state: RootState) => state.team.members
export const selectAllInvites = (state: RootState) => state.team.invites
export const selectTeamStatus = (state: RootState) => state.team.status
export const selectTeamError = (state: RootState) => state.team.error

export default teamSlice.reducer 