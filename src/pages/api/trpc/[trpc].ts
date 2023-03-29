import { createContext } from "@/lib/api/context";
import { appRouter } from "@/lib/api/routers/_app";
import * as trpcNext from "@trpc/server/adapters/next";

export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext
});
