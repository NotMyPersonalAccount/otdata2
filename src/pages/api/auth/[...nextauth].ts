import User from "@/models/User";
import { connectMongo } from "@/utils/mongoose";
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
			if (user?.email === undefined) {
				//TODO: Handle this properly
				return token;
			}
			await connectMongo();
			const dbUser = await User.findOne({ otemail: user.email });
			if (dbUser === null) {
				//TODO: Handle this properly
				return token;
			}
			token.otdata = {
				admin: dbUser.isadmin,
				role: dbUser.role,
				aeriesid: dbUser.aeriesid!
			};
			return token;
		},
		async session({ session, user, token }) {
			return { ...session, ...token.otdata };
		}
	}
};
export default NextAuth(authOptions);

