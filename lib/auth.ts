import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const db = getDb();
          const admin = db
            .prepare("SELECT * FROM admin_users WHERE email = ?")
            .get(credentials.email as string) as {
            id: number;
            name: string;
            email: string;
            password_hash: string;
            role: string;
          } | undefined;

          if (!admin) return null;
          const valid = bcrypt.compareSync(credentials.password as string, admin.password_hash);
          if (!valid) return null;

          return {
            id: String(admin.id),
            name: admin.name,
            email: admin.email,
            role: admin.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { role?: string; id?: string }).role = token.role as string;
        (session.user as { role?: string; id?: string }).id = token.id as string;
      }
      return session;
    },
  },
});
