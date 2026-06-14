import type { Role, UserStatus } from "@/lib/seed-data";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
      status: UserStatus;
    };
  }

  interface User {
    role: Role;
    status: UserStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    status?: UserStatus;
  }
}
