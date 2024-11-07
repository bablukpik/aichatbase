import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import chatbotReducer from '@/features/chatbots/chatbotSlice'
import analyticsReducer from '@/features/analytics/analyticsSlice'
import messagesReducer from '@/features/messages/messagesSlice'
import documentsReducer from '@/features/documents/documentsSlice'
import auditReducer from '@/features/audit/auditSlice'
import teamReducer from '@/features/team/teamSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatbots: chatbotReducer,
    analytics: analyticsReducer,
    messages: messagesReducer,
    documents: documentsReducer,
    audit: auditReducer,
    team: teamReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 