import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "./routers/_app";
import SuperJSON from "superjson";

const getBaseUrl = () => {
	if (typeof window !== "undefined") return "";
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${getBaseUrl()}/api/trpc`
		})
	],
	transformer: SuperJSON
});

