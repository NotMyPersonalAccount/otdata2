import { TypeOf, z } from "zod";
import { loggedInProcedure, router } from "..";
import prisma from "@/lib/database/prisma";

const deleteClassSchema = z.object({
	id: z.string()
});
export type DeleteClassInput = TypeOf<typeof deleteClassSchema>;

export const classRouter = router({
	delete: loggedInProcedure
		.input(deleteClassSchema)
		.mutation(async ({ input, ctx }) => {
			const { id } = input;

			const _class = await prisma.gEnrollment.findUnique({
				where: {
					id
				}
			});
			if (!_class) throw new Error("Class not found");
			if (
				_class.owner_id !== ctx.session.currUserId &&
				!ctx.session.admin
			)
				throw new Error("Can not delete class for other user");

			return await prisma.gEnrollment.delete({
				where: {
					id
				}
			});
		})
});

