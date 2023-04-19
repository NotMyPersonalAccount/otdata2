import prisma from "@/lib/database/prisma";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { z, TypeOf } from "zod";
import { loggedInProcedure, procedure, router } from "..";

const createCheckinSchema = z.object({
	classId: z.string(),
	userId: z.string(),
	status: z.string(),
	assignment: z.string(),
	working_on: z.string(),
	working_on_other: z.string()
});
export type CreateCheckinInput = TypeOf<typeof createCheckinSchema>;

const deleteCheckinSchema = z.object({
	id: z.string(),
	respondWithLast: z.boolean()
});
export type DeleteCheckinInput = TypeOf<typeof deleteCheckinSchema>;

export const checkinRouter = router({
	create: loggedInProcedure
		.input(createCheckinSchema)
		.mutation(async ({ input, ctx }) => {
			const {
				classId,
				userId,
				status,
				assignment,
				working_on,
				working_on_other
			} = input;

			if (userId !== ctx.session.currUserId && !ctx.session.admin)
				throw new Error("Can not create checkin for other user");

			const _class = await prisma.googleClassroom.findUnique({
				where: {
					google_classroom_id: classId
				}
			});
			if (!_class) throw new Error("Classroom not found");

			const user = await prisma.user.findUnique({
				where: {
					id: userId
				}
			});
			if (!user) throw new Error("User not found");

			const lastCheckin = await prisma.checkin.findFirst({
				where: {
					google_classroom_id: classId,
					student_id: userId
				},
				orderBy: {
					create_date: "desc"
				}
			});
			if (lastCheckin && dayjs().isSame(lastCheckin.create_date, "day"))
				throw new Error("Already checked in today");

			return await prisma.checkin.create({
				data: {
					google_classroom_id: _class.google_classroom_id,
					description: assignment + " " + working_on_other,
					status,
					working_on,
					student_id: user.id,
					google_classroom_name: (
						_class.class_dict as Prisma.JsonObject
					).name as string,
					classroom_id: _class.id
				}
			});
		}),
	delete: loggedInProcedure
		.input(deleteCheckinSchema)
		.mutation(async ({ input, ctx }) => {
			const { id, respondWithLast } = input;

			const checkin = await prisma.checkin.findUnique({
				where: {
					id
				}
			});
			if (!checkin) throw new Error("Checkin not found");

			if (
				checkin.student_id !== ctx.session.currUserId &&
				!ctx.session.admin
			)
				throw new Error("Can not delete checkin for other user");

			await prisma.checkin.delete({
				where: {
					id
				}
			});
			if (respondWithLast) {
				return await prisma.checkin.findFirst({
					where: {
						google_classroom_id: checkin.google_classroom_id!,
						student_id: checkin.student_id
					},
					orderBy: {
						create_date: "desc"
					}
				});
			}
			return true;
		})
});

