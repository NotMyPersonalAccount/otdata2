import { Role } from "@/lib/enums/role";
import NextAuth from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

type ExtraSessionInfo = {
	admin: boolean;
	role: Role;
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

