import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import SuperJSON from "superjson";

const t = initTRPC.context<Context>().create({ transformer: SuperJSON });

export const middleware = t.middleware;
export const procedure = t.procedure;
export const router = t.router;

export const loggedInProcedure = procedure.use(
	middleware(async ({ ctx, next }) => {
		if (!ctx.session) throw new Error("Not logged in");
		return next({
			ctx: {
				...ctx,
				session: ctx.session
			}
		});
	})
);

export const adminProcedure = loggedInProcedure.use(
	middleware(async ({ ctx, next }) => {
		if (!ctx.session?.admin && !ctx.session?.originalData)
			throw new Error("Not authorized");
		return next({
			ctx: {
				...ctx,
				session: ctx.session
			}
		});
	})
);

