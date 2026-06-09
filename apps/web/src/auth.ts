import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@astra/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+guilds"
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
        
        // Fetch the Discord provider account ID (Discord Snowflake ID)
        const account = await prisma.account.findFirst({
          where: { userId: user.id, provider: "discord" }
        });
        
        if (account) {
          (session.user as any).discordId = account.providerAccountId;
        }
      }
      return session;
    },
  },
})
