import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    userId: string;
    session?: string | null; // Ensure session is optional
  }

  interface Session {
    user: User & {
      userId: string;
      session?: string | null; // Ensure session exists
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userId: string;
    session?: string | null; // Add session here too
  }
}
