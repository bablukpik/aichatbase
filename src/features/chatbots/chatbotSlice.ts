import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'

interface Chatbot {
  id: string
  name: string
  description: string
  model: string
  temperature: number
  maxTokens: number
  messages: number
  lastActive: string
}

interface ChatbotState {
  chatbots: Chatbot[]
  selectedChatbot: Chatbot | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ChatbotState = {
  chatbots: [],
  selectedChatbot: null,
  status: 'idle',
  error: null,
}

export const fetchChatbots = createAsyncThunk(
  'chatbots/fetchChatbots',
  async () => {
    const response = await fetch('/api/chatbots')
    if (!response.ok) {
      throw new Error('Failed to fetch chatbots')
    }
    return response.json()
  }
)

export const createChatbot = createAsyncThunk(
  'chatbots/createChatbot',
  async (chatbotData: { name: string; description: string }) => {
    const response = await fetch('/api/chatbots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatbotData),
    })
    if (!response.ok) {
      throw new Error('Failed to create chatbot')
    }
    return response.json()
  }
)

export const updateChatbot = createAsyncThunk(
  'chatbots/updateChatbot',
  async ({ id, data }: { id: string; data: Partial<Chatbot> }) => {
    const response = await fetch(`/api/chatbots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update chatbot')
    }
    return response.json()
  }
)

export const deleteChatbot = createAsyncThunk(
  'chatbots/deleteChatbot',
  async (id: string) => {
    const response = await fetch(`/api/chatbots/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete chatbot')
    }
    return id
  }
)

export const chatbotSlice = createSlice({
  name: 'chatbots',
  initialState,
  reducers: {
    selectChatbot: (state, action: PayloadAction<Chatbot>) => {
      state.selectedChatbot = action.payload
    },
    clearSelectedChatbot: (state) => {
      state.selectedChatbot = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Chatbots
      .addCase(fetchChatbots.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchChatbots.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.chatbots = action.payload
      })
      .addCase(fetchChatbots.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch chatbots'
      })
      // Create Chatbot
      .addCase(createChatbot.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createChatbot.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.chatbots.push(action.payload)
      })
      .addCase(createChatbot.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to create chatbot'
      })
      // Update Chatbot
      .addCase(updateChatbot.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateChatbot.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const index = state.chatbots.findIndex(bot => bot.id === action.payload.id)
        if (index !== -1) {
          state.chatbots[index] = action.payload
        }
      })
      .addCase(updateChatbot.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to update chatbot'
      })
      // Delete Chatbot
      .addCase(deleteChatbot.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteChatbot.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.chatbots = state.chatbots.filter(bot => bot.id !== action.payload)
        if (state.selectedChatbot?.id === action.payload) {
          state.selectedChatbot = null
        }
      })
      .addCase(deleteChatbot.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to delete chatbot'
      })
  },
})

export const { selectChatbot, clearSelectedChatbot, clearError } = chatbotSlice.actions

export const selectAllChatbots = (state: RootState) => state.chatbots.chatbots
export const selectChatbotById = (state: RootState, chatbotId: string) =>
  state.chatbots.chatbots.find(bot => bot.id === chatbotId)
export const selectChatbotStatus = (state: RootState) => state.chatbots.status
export const selectChatbotError = (state: RootState) => state.chatbots.error
export const selectSelectedChatbot = (state: RootState) => state.chatbots.selectedChatbot

export default chatbotSlice.reducer 