// auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.BACKEND_URL}/auth/login`,
            {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email:    credentials.email,
                password: credentials.password,
              }),
            }
          )

          if (!res.ok) return null

          const data = await res.json()

          return {
            id:           data.user_id      ?? "",
            email:        credentials.email as string,
            accessToken:  data.access_token,
            refreshToken: data.refresh_token,
          }

        } catch {
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // First login — store tokens and expiry
      if (user) {
        token.accessToken   = (user as any).accessToken
        token.refreshToken  = (user as any).refreshToken
        token.userId        = user.id
        // Set expiry to 55 minutes from now (5 min buffer before 1 hour)
        token.accessTokenExpires = Date.now() + 55 * 60 * 1000
        return token
      }

      // Token still valid — return as is
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Token expired — try to refresh
      try {
        console.log("Access token expired — refreshing...")
        const res = await fetch(
          `${process.env.BACKEND_URL}/auth/refresh`,
          {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
              refresh_token: token.refreshToken
            }),
          }
        )

        if (!res.ok) {
          console.log("Refresh failed — user must login again")
          return { ...token, error: "RefreshAccessTokenError" }
        }

        const data = await res.json()
        console.log("Token refreshed successfully")

        return {
          ...token,
          accessToken:         data.access_token,
          accessTokenExpires:  Date.now() + 55 * 60 * 1000,
        }

      } catch (error) {
        console.log("Refresh error:", error)
        return { ...token, error: "RefreshAccessTokenError" }
      }
    },

    async session({ session, token }) {
      session.user.id          = token.userId       as string
      session.user.accessToken = token.accessToken  as string

      // Pass error to session so frontend can handle it
      if (token.error) {
        (session as any).error = token.error
      }

      return session
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge:   7 * 24 * 60 * 60,  // 7 days — matches refresh token
  },
})