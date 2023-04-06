import NextAuth from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

type ExtraSessionInfo = {
	admin: boolean;
	role: string;
	currUserId: string;
	aeriesId: number;
	name: string;
	originalData?: ExtraSessionInfo;
};

declare module "next-auth" {
	interface Session extends DefaultSession, ExtraSessionInfo {}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		otdata: ExtraSessionInfo;
	}
}

