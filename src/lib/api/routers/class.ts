import { TypeOf, z } from "zod";
import { loggedInProcedure, router, withOwnedClass } from "..";
import prisma from "@/lib/database/prisma";
import { ClassStatus } from "@/lib/enums/class";

const editClassSchema = z.object({
	id: z.string(),
	name: z.string(),
	status: z.nativeEnum(ClassStatus)
});
export type EditClassInput = TypeOf<typeof editClassSchema>;

const deleteClassSchema = z.object({
	id: z.string()
});
export type DeleteClassInput = TypeOf<typeof deleteClassSchema>;

export const classRouter = router({
	edit: loggedInProcedure
		.input(editClassSchema)
		.use(withOwnedClass)
		.mutation(async ({ input, ctx }) => {
			const { name, status } = input;

			return await prisma.gEnrollment.update({
				where: {
					id: ctx._class.id
				},
				data: {
					user_classname: name,
					status
				},
				select: {
					id: true,
					user_classname: true,
					status: true,
					google_classroom: {
						select: {
							class_dict: true,
							teacher_dict: true
						}
					}
				}
			});
		}),
	delete: loggedInProcedure
		.input(deleteClassSchema)
		.use(withOwnedClass)
		.mutation(async ({ ctx }) => {
			return await prisma.gEnrollment.delete({
				where: {
					id: ctx._class.id
				}
			});
		})
});

