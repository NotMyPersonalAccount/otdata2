import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import SuperJSON from "superjson";
import prisma from "../database/prisma";

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

export const withOwnedProject = middleware(async ({ ctx, next, input }) => {
	const { projectId } = input as { projectId: string };
	const project = await prisma.project.findUnique({
		where: {
			id: projectId
		}
	});
	if (!project) throw new Error("Project not found");
	if (project.student_id !== ctx.session?.currUserId && !ctx.session?.admin)
		throw new Error("Can not modify project for other user");

	return next({
		ctx: {
			...ctx,
			project
		}
	});
});

