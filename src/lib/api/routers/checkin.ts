import { createCheckin } from "@/lib/database/checkin";
import { getClassroomByGoogleId } from "@/lib/database/class";
import { getUserById } from "@/lib/database/user";
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
				_class,
				user,
				working_on,
				status,
				assignment + " " + working_on_other
			);
		})
});

