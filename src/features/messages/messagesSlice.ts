import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'

export interface Message {
  id: string
  chatbotId: string
  chatbotName: string
  content: string
  response: string
  status: 'success' | 'failed' | 'pending'
  timestamp: string
}

interface MessagesState {
  messages: Message[]
  selectedMessage: Message | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: MessagesState = {
  messages: [],
  selectedMessage: null,
  status: 'idle',
  error: null,
}

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async () => {
    const response = await fetch('/api/messages')
    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }
    return response.json()
  }
)

export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (messageId: string) => {
    const response = await fetch(`/api/messages/${messageId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete message')
    }
    return messageId
  }
)

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ chatbotId, content }: { chatbotId: string; content: string }) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatbotId,
        message: content,
      }),
    })
    if (!response.ok) {
      throw new Error('Failed to send message')
    }
    return response.json()
  }
)

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    selectMessage: (state, action: PayloadAction<Message>) => {
      state.selectedMessage = action.payload
    },
    clearSelectedMessage: (state) => {
      state.selectedMessage = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.messages = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch messages'
      })
      .addCase(deleteMessage.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.messages = state.messages.filter(msg => msg.id !== action.payload)
        if (state.selectedMessage?.id === action.payload) {
          state.selectedMessage = null
        }
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to delete message'
      })
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.messages.unshift(action.payload)
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to send message'
      })
  },
})

export const { selectMessage, clearSelectedMessage, clearError } = messagesSlice.actions

export const selectAllMessages = (state: RootState) => state.messages.messages
export const selectMessageById = (state: RootState, messageId: string) =>
  state.messages.messages.find(msg => msg.id === messageId)
export const selectMessagesStatus = (state: RootState) => state.messages.status
export const selectMessagesError = (state: RootState) => state.messages.error
export const selectSelectedMessage = (state: RootState) => state.messages.selectedMessage

export default messagesSlice.reducer 