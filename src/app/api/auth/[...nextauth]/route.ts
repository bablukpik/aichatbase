import NextAuth, { DefaultSession} from "next-auth";
import { authOptions } from "./options";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role?: string;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
