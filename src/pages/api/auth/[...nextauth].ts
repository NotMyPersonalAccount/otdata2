import prisma from "@/lib/database/prisma";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		})
	],
	callbacks: {
		async jwt({ token, user, account, profile, isNewUser }) {
			if (user === undefined) return token;

			const dbUser = await prisma.user.findFirst({
				where: {
					ot_email: user.email!
				}
			});
			if (dbUser === null) {
				//TODO: Create user
				return token;
			}
			token.otdata = {
				admin: dbUser.is_admin!,
				role: dbUser.role!,
				currUserId: dbUser.id,
				aeriesid: dbUser.aeries_id!
			};
			return token;
		},
		async session({ session, user, token }) {
			return { ...session, ...token.otdata };
		}
	}
};
export default NextAuth(authOptions);

