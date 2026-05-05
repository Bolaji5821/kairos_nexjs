import NextAuth, { type AuthOptions, type DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { setAuthData } from "./auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    backendToken?: string
    user: {
      email: string
      name?: string
      firstName?: string
      lastName?: string
      role?: string
    } & DefaultSession["user"]
  }
  interface User {
    email: string
    name?: string
    firstName?: string
    lastName?: string
    role?: string
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      client: {
        timeout: 10000,
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account, user, profile }) {
      if (account && profile) {
        const googleProfile = profile as any; // Google profile has given_name, family_name
        token.accessToken = account.access_token
        token.user = {
          email: profile.email,
          name: profile.name,
          firstName: googleProfile.given_name,
          lastName: googleProfile.family_name,
        }

        // Exchange Google token for backend JWT
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google/exchange`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accessToken: account.access_token,
                idToken: account.id_token,
              }),
            }
          )
          if (response.ok) {
            const data = await response.json()
            token.backendToken = data.token
            token.user = { ...(token.user as object), ...(data.user as object) }
          }
        } catch (error) {
          console.error("Failed to exchange Google token:", error)
        }
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.backendToken = token.backendToken as string
      session.user = token.user as any
      return session
    },
  },
}

export default NextAuth(authOptions)