import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import type { LoginResponse } from "@/types/api";
import api, { handleApiResponse } from "@/app/api/axios";
import { TOKEN } from "@/app/api/endpoints";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await handleApiResponse(
            api.post<LoginResponse>(TOKEN, {
              username: credentials.username,
              password: credentials.password,
            })
          );

          const { access, refresh } = response;

          const cookieStore = await cookies();
          cookieStore.set("authToken", access, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
            sameSite: "strict",
          });

          cookieStore.set("refreshToken", refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
            sameSite: "strict",
          });

          return {
            id: credentials.username,
            name: credentials.username,
            email: credentials.username,
            accessToken: access,
            refreshToken: refresh,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
