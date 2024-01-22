import { mergeAnnonymousCartIntoUserCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import NextAuth from "next-auth/next";
import Google from "next-auth/providers/google";

    const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
    providers: [
        Google({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        session({session, user}) {
            session.user.id = user.id
        return session;
        },
    },
    events : {
        async signIn({user}) {
            await mergeAnnonymousCartIntoUserCart(user.id);
        },
    }
}
const handler = NextAuth(authOptions);

export { authOptions, handler as default };
export { handler as GET, handler as POST };
