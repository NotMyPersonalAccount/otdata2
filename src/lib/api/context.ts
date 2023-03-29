import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";

export const createContext = async (ctx: CreateNextContextOptions) => {
	const { req, res } = ctx;
	const session = await getServerSession(req, res, authOptions);

	return {
		req,
		res,
		session
	};
};

export type Context = Awaited<ReturnType<typeof createContext>>;

