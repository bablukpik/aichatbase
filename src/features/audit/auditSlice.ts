import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'

export interface AuditLog {
  id: string
  action: string
  userId: string
  userName: string
  userEmail: string
  resourceType: string
  resourceId: string
  details: string
  ipAddress: string
  userAgent: string
  timestamp: string
}

interface AuditState {
  logs: AuditLog[]
  selectedLog: AuditLog | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuditState = {
  logs: [],
  selectedLog: null,
  status: 'idle',
  error: null,
}

export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchAuditLogs',
  async () => {
    const response = await fetch('/api/audit-logs')
    if (!response.ok) {
      throw new Error('Failed to fetch audit logs')
    }
    return response.json()
  }
)

export const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    selectLog: (state, action: PayloadAction<AuditLog>) => {
      state.selectedLog = action.payload
    },
    clearSelectedLog: (state) => {
      state.selectedLog = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.logs = action.payload
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch audit logs'
      })
  },
})

export const { selectLog, clearSelectedLog, clearError } = auditSlice.actions

export const selectAllLogs = (state: RootState) => state.audit.logs
export const selectAuditStatus = (state: RootState) => state.audit.status
export const selectAuditError = (state: RootState) => state.audit.error
export const selectSelectedLog = (state: RootState) => state.audit.selectedLog

export default auditSlice.reducer 