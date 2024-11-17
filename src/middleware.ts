import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Simple token check for auth
    },
    pages: {
      signIn: "/login", // Redirect to login page when unauthorized
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/chat
     * - api/embed
     * - chat-widget
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - signup
     * - / (home page)
     */
    "/((?!api/chat|api/embed|chat-widget|_next/static|_next/image|favicon\\.ico|login|signup|$).*)",
  ],
};
