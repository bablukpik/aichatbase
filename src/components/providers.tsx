'use client'

import { SessionProvider } from "next-auth/react"
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/lib/store'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <SessionProvider>{children}</SessionProvider>
    </ReduxProvider>
  )
} 