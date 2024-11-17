import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: "/login",
    }
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/documents/:path*",
    // Add other protected routes here
    // Exclude authentication routes
    "/((?!api/chat|api/embed|chat-widget|_next/static|_next/image|favicon.ico|login|signup).*)",
  ]
}
