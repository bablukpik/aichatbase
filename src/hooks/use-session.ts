import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: any | null
  accessToken: string | null
  setSession: (user: any, accessToken: string) => void
  clearSession: () => void
}

export const useSession = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: (user, accessToken) => set({ user, accessToken }),
      clearSession: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
) 