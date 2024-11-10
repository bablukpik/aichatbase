import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token)
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    // Exclude chat and embed routes from auth
    "/((?!api/chat|api/embed|chat-widget).*)",
  ]
}
