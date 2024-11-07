import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth(redirectTo?: string) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session && redirectTo) {
      router.push(redirectTo)
    }
  }, [session, status, redirectTo, router])

  return { session, status }
} 