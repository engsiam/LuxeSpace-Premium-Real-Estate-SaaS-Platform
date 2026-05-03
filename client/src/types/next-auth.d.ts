import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
    refreshToken?: string
    user: {
      role: string
      avatar?: string
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    avatar?: string
    accessToken?: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    avatar?: string
    accessToken?: string
    refreshToken?: string
  }
}
