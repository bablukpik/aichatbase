import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'

export interface TrainingPhase {
  phase: string
  progress: number
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
}

export interface TrainingStatus {
  chatbotId: string
  documentsCount: number
  lastTrainingDate: string
  status: 'ready' | 'training' | 'failed'
  accuracy?: number
  progress?: number
  phases: TrainingPhase[]
  documentsProcessed: number
  totalDocuments: number
  timeRemaining: number
  currentAccuracy: number
  trainingSpeed: number
}

interface TrainingState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  trainingStatus: TrainingStatus | null
  trainingHistory: any[]
}

const initialState: TrainingState = {
  status: 'idle',
  error: null,
  trainingStatus: null,
  trainingHistory: []
}

export const startTraining = createAsyncThunk(
  'training/startTraining',
  async ({ 
    chatbotId, 
    documents, 
    modelConfig 
  }: { 
    chatbotId: string, 
    documents: string[], 
    modelConfig: {
      model: string,
      temperature: number,
      maxTokens: number
    }
  }) => {
    const response = await fetch('/api/training', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        chatbotId, 
        documents,
        modelConfig 
      }),
    })
    if (!response.ok) throw new Error('Failed to start training')
    return response.json()
  }
)

export const fetchTrainingStatus = createAsyncThunk(
  'training/fetchStatus',
  async (chatbotId: string) => {
    const response = await fetch(`/api/training?chatbotId=${chatbotId}`)
    if (!response.ok) throw new Error('Failed to fetch training status')
    return response.json()
  }
)

export const updateTrainingPhase = createAsyncThunk(
  'training/updatePhase',
  async ({ chatbotId, phase, progress }: { chatbotId: string, phase: string, progress: number }) => {
    const response = await fetch(`/api/training/${chatbotId}/phase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phase, progress }),
    })
    if (!response.ok) throw new Error('Failed to update training phase')
    return response.json()
  }
)

export const cancelTraining = createAsyncThunk(
  'training/cancelTraining',
  async (chatbotId: string) => {
    const response = await fetch(`/api/training/${chatbotId}/phase/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) throw new Error('Failed to cancel training')
    return response.json()
  }
)

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    updateProgress: (state, action) => {
      if (state.trainingStatus) {
        state.trainingStatus.progress = action.payload
      }
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startTraining.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(startTraining.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (state.trainingStatus) {
          state.trainingStatus.status = 'training'
          state.trainingStatus.progress = 0
        }
      })
      .addCase(startTraining.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to start training'
      })
      .addCase(fetchTrainingStatus.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTrainingStatus.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.trainingStatus = action.payload
      })
      .addCase(fetchTrainingStatus.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch training status'
      })
      .addCase(cancelTraining.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(cancelTraining.fulfilled, (state) => {
        state.status = 'succeeded'
        if (state.trainingStatus) {
          state.trainingStatus.status = 'ready'
          state.trainingStatus.progress = 0
        }
      })
      .addCase(cancelTraining.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to cancel training'
      })
  }
})

export const { updateProgress, clearError } = trainingSlice.actions

export const selectTrainingStatus = (state: RootState) => state.training.trainingStatus
export const selectTrainingError = (state: RootState) => state.training.error
export const selectTrainingState = (state: RootState) => state.training.status

export default trainingSlice.reducer 