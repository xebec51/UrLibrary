import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { demoPassword, users, type Role, type UserStatus } from "@/lib/seed-data";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type AuthorizedUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
};

async function findDatabaseUser(email: string, password: string): Promise<AuthorizedUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        status: true,
      },
    });

    if (!user) return null;
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  } catch {
    return null;
  }
}

function findDemoUser(email: string, password: string): AuthorizedUser | null {
  if (password !== demoPassword) return null;
  const demoUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (!demoUser) return null;

  return {
    id: demoUser.email,
    name: demoUser.name,
    email: demoUser.email,
    role: demoUser.role,
    status: demoUser.status,
  };
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();
        const databaseUser = await findDatabaseUser(email, parsed.data.password);
        return databaseUser ?? findDemoUser(email, parsed.data.password);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const appUser = user as AuthorizedUser;
        token.role = appUser.role;
        token.status = appUser.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as Role;
        session.user.status = token.status as UserStatus;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
