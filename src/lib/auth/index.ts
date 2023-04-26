import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { IncomingMessage, ServerResponse } from "http";
import { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

type Request = IncomingMessage & {
	cookies: NextApiRequestCookies;
};

const cachedSessions = new Map<Request, Session | null>();

export async function getServerSessionCached(
	req: Request,
	res: ServerResponse
) {
	const cached = cachedSessions.get(req);
	if (cached) return cached;

	const session = await getServerSession(req, res, authOptions);
	cachedSessions.set(req, session);
	return session;
}

