import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";

// NextAuth is a rather obnoxious library and importing unexported functions is
// somehow the best way to accomplish redirecting directly to a provider's
// OAuth login page from the server side.
//
// See here: https://github.com/nextauthjs/next-auth/issues/45#issuecomment-1465009479

//@ts-ignore
import { init } from "../../node_modules/next-auth/core/init";
//@ts-ignore
import { setCookie } from "../../node_modules/next-auth/next/utils";
//@ts-ignore
import getAuthorizationUrl from "../../node_modules/next-auth/core/lib/oauth/authorization-url";

export function sendError(error: string): { props: { error: string } } {
	return { props: { error } };
}

export async function forceLogin(context: GetServerSidePropsContext) {
	const { req, res } = context;
	const { cookies, headers, url } = req;

	const { options, cookies: initCookies } = await init({
		action: "signin",
		authOptions,
		callbackUrl: url,
		cookies,
		csrfToken: await getCsrfToken({ req }),
		host: `${process.env.NODE_ENV === "development" ? "http" : "https"}://${
			headers["host"]
		}`,
		isPost: true,
		providerId: "google"
	});
	const { redirect, cookies: authCookies } = await getAuthorizationUrl({
		options,
		query: {}
	});
	[...initCookies, ...authCookies!].forEach(cookie => {
		setCookie(res, cookie);
	});
	res.writeHead(302, { Location: redirect });
	res.end();
	return { props: {} };
}

