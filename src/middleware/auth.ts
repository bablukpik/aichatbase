import { NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"

export async function authMiddleware(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1]

  if (!token) {
    return new NextResponse("Missing authentication token", { status: 401 })
  }

  const payload = verifyJwt(token)
  if (!payload) {
    return new NextResponse("Invalid authentication token", { status: 401 })
  }

  return NextResponse.next()
} 