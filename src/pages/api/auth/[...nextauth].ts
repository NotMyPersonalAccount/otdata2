import prisma from "@/lib/database/prisma";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

export const authOptions: AuthOptions = {
	secret: process.env.NEXTAUTH_SECRET as string,
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		})
	],
	callbacks: {
		async jwt({ token, session, user, profile }) {
			const email = (user ?? token).email!;
			let dbUser = await prisma.user.findFirst({
				where: {
					ot_email: email
				}
			});
			if (dbUser === null) {
				const googleProfile = profile as GoogleProfile;
				dbUser = await prisma.user.create({
					data: {
						ot_email: email,
						google_id: user.id,
						role: email.endsWith("@ousd.org")
							? email.startsWith("s_")
								? "Student"
								: "Teacher"
							: "Community",
						aeries_first_name: googleProfile.given_name,
						aeries_last_name: googleProfile.family_name,
						first_name: googleProfile.given_name,
						last_name: googleProfile.family_name
					}
				});
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

