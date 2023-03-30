import {
	createCheckin,
	deleteCheckin,
	getCheckin,
	getLastCheckin
} from "@/lib/database/checkin";
import { getClassroomByGoogleId } from "@/lib/database/class";
import { getUserById } from "@/lib/database/user";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { z, TypeOf } from "zod";
import { procedure, router } from "..";

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
	create: procedure
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

			if (!ctx.session) throw new Error("Not logged in");
			if (userId !== ctx.session.currUserId && !ctx.session.admin)
				throw new Error("Can not create checkin for other user");

			const _class = await getClassroomByGoogleId(classId, {
				include: {
					checkins: {
						where: {
							student_id: userId
						},
						orderBy: {
							create_date: "desc"
						},
						take: 1
					}
				}
			});
			if (!_class) throw new Error("Classroom not found");

			const user = await getUserById(userId);
			if (!user) throw new Error("User not found");

			const lastCheckin = _class?.checkins?.[0];
			if (lastCheckin && dayjs().isSame(lastCheckin.create_date, "day"))
				throw new Error("Already checked in today");

			return await createCheckin(
				_class.id,
				(_class.class_dict as Prisma.JsonObject).name as string,
				_class.google_classroom_id!,
				user.id,
				working_on,
				status,
				assignment + " " + working_on_other
			);
		}),
	delete: procedure
		.input(deleteCheckinSchema)
		.mutation(async ({ input, ctx }) => {
			const { id, respondWithLast } = input;

			if (!ctx.session) throw new Error("Not logged in");

			const checkin = await getCheckin(id);
			if (!checkin) throw new Error("Checkin not found");

			if (
				checkin.student_id !== ctx.session.currUserId &&
				!ctx.session.admin
			)
				throw new Error("Can not delete checkin for other user");

			await deleteCheckin(id);
			if (respondWithLast) {
				return await getLastCheckin(
					checkin.google_classroom_id!,
					checkin.student_id
				);
			}
			return true;
		})
});

