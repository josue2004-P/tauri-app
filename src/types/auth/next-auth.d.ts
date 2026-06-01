import NextAuth, { DefaultSession, DefaultUser, JWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      token: string;
      profiles: string[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    token: string;
    profiles: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    token: string;
    profiles: string[];
  }
}
