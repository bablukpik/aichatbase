import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      organizationId: string
      organizationName: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    organizationId: string
    organizationName: string
  }
} 