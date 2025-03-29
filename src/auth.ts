import { loginUser } from "@/services/auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                debugger;
                const { data, status } = await loginUser({
                    email: credentials.email as string,
                    password: credentials.password as string,
                });

                if (status === 200) {
                    return {
                        id: data.user.id,
                        username: data.user.username,
                        email: data.user.email,
                        accessToken: data.token,
                    } as any;
                } else {
                    console.error("API request error:");
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token, user }) {
            (session as any).user = token.user;
            return session;
        },
    },
});
