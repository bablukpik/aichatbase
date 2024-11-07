import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

interface SignOption {
  expiresIn?: string | number
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "1d",
}

export function signJwtAccessToken(
  payload: jwt.JwtPayload,
  options: SignOption = DEFAULT_SIGN_OPTION
) {
  const token = jwt.sign(payload, JWT_SECRET, options)
  return token
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as jwt.JwtPayload
  } catch (error) {
    console.error("JWT Verification failed:", error)
    return null
  }
} 