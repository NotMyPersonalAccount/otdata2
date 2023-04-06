import prisma from "@/lib/database/prisma";
import { TypeOf, z } from "zod";
import { procedure, router } from "..";

const findUserSchema = z.object({
	first_name: z.string(),
	last_name: z.string(),
	aeries_id: z.string()
});
export type FindUserInput = TypeOf<typeof findUserSchema>;

export const userRouter = router({
	find: procedure.input(findUserSchema).query(async ({ input, ctx }) => {
		const { first_name, last_name, aeries_id } = input;

		if (!ctx.session) throw new Error("Not logged in");
		if (!ctx.session.admin && !ctx.session.originalData) throw new Error("Not authorized");

		return await prisma.user.findMany({
			where: {
				first_name: {
					contains: first_name,
					mode: "insensitive"
				},
				last_name: {
					contains: last_name,
					mode: "insensitive"
				},
				aeries_id: aeries_id ? parseInt(aeries_id) : undefined
			}
		});
	})
});

