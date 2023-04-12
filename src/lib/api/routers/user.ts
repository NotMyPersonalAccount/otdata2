import prisma from "@/lib/database/prisma";
import { TypeOf, z } from "zod";
import { procedure, router } from "..";
import { Prisma } from "@prisma/client";
import { queryOptionsAvailable } from "@/components/forms/FindStudentForm";

const findUserSchema = z.object({
	first_name: z.string(),
	last_name: z.string(),
	aeries_id: z.string(),
	aeries_ethnicity: z.array(z.string()).optional(),
	cohort: z.array(z.string()).optional(),
	grade: z.array(z.number()).optional(),
	aeries_gender: z.array(z.string()).optional()
});
export type FindUserInput = TypeOf<typeof findUserSchema>;

export const userRouter = router({
	getQueryOptions: procedure.input(z.object({})).query(async ({ ctx }) => {
		if (!ctx.session) throw new Error("Not logged in");
		if (!ctx.session.admin && !ctx.session.originalData)
			throw new Error("Not authorized");

		const options = {} as {
			[key: string]: {
				label: string;
				value: string;
			}[];
		};
		await Promise.all(
			Object.keys(queryOptionsAvailable).map(async (key: string) => {
				const field = key as Prisma.UserScalarFieldEnum;
				options[field] = (
					await prisma.user.findMany({
						distinct: field,
						orderBy: { [field]: "asc" }
					})
				)
					.filter(user => user[field])
					.map(user => {
						return {
							label: user[field] as string,
							value: user[field] as string
						};
					});
			})
		);

		return options;
	}),
	find: procedure.input(findUserSchema).query(async ({ input, ctx }) => {
		const {
			first_name,
			last_name,
			aeries_id,
			aeries_ethnicity,
			cohort,
			grade,
			aeries_gender
		} = input;

		if (!ctx.session) throw new Error("Not logged in");
		if (!ctx.session.admin && !ctx.session.originalData)
			throw new Error("Not authorized");

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
				aeries_id: aeries_id ? parseInt(aeries_id) : undefined,
				aeries_ethnicity: {
					in: aeries_ethnicity
				},
				cohort: {
					in: cohort
				},
				grade: {
					in: grade
				},
				aeries_gender: {
					in: aeries_gender
				}
			}
		});
	})
});

