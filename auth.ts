// auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,        // ← add this line

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
      if (user) {
        token.accessToken  = (user as any).accessToken
        token.refreshToken = (user as any).refreshToken
        token.userId       = user.id
      }
      return token
    },

    async session({ session, token }) {
      session.user.id          = token.userId       as string
      session.user.accessToken = token.accessToken  as string
      return session
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
})