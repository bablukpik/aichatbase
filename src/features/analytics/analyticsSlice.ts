import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'

interface AnalyticsData {
  totalUsers: number
  totalMessages: number
  activeChatbots: number
  trainingSessions: number
  usageTrends: {
    name: string
    total: number
  }[]
  responseTimes: {
    name: string
    total: number
  }[]
  accuracy: {
    name: string
    total: number
  }[]
  geographicData: {
    country: string
    users: number
  }[]
}

interface AnalyticsState {
  data: AnalyticsData | null
  period: '24h' | '7d' | '30d' | '90d'
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AnalyticsState = {
  data: null,
  period: '7d',
  status: 'idle',
  error: null,
}

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (period: '24h' | '7d' | '30d' | '90d') => {
    const response = await fetch(`/api/analytics?period=${period}`)
    if (!response.ok) {
      throw new Error('Failed to fetch analytics')
    }
    return response.json()
  }
)

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setPeriod: (state, action: PayloadAction<'24h' | '7d' | '30d' | '90d'>) => {
      state.period = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch analytics'
      })
  },
})

export const { setPeriod, clearError } = analyticsSlice.actions

export const selectAnalyticsData = (state: RootState) => state.analytics.data
export const selectAnalyticsPeriod = (state: RootState) => state.analytics.period
export const selectAnalyticsStatus = (state: RootState) => state.analytics.status
export const selectAnalyticsError = (state: RootState) => state.analytics.error

export default analyticsSlice.reducer 