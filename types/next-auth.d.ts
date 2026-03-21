// types/next-auth.d.ts
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id:          string
      email:       string
      accessToken: string
    }
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken:        string
    refreshToken:       string
    userId:             string
    accessTokenExpires: number
    error?:             string
  }
}