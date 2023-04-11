import prisma from "@/lib/database/prisma";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
	secret: process.env.NEXTAUTH_SECRET as string,
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		})
	],
	callbacks: {
		async jwt({ token, user, session }) {
			const email = (user ?? token).email!;
			const dbUser = await prisma.user.findFirst({
				where: {
					ot_email: email
				}
			});
			if (dbUser === null) {
				//TODO: Create user
				return token;
			}
			if (!token.otdata || !dbUser.is_admin) {
				token.otdata = {
					admin: dbUser.is_admin!,
					role: dbUser.role!,
					currUserId: dbUser.id,
					aeriesId: dbUser.aeries_id!,
					name: `${dbUser.first_name} ${dbUser.last_name}`
				};
			} else {
				token.otdata = {
					...token.otdata,
					...session,
					originalData: token.otdata.originalData ?? token.otdata
				};
			}
			return token;
		},
		async session({ session, token }) {
			return { ...session, ...token.otdata };
		}
	}
};
export default NextAuth(authOptions);

