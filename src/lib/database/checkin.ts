import { GoogleClassroom, Prisma, User } from "@prisma/client";
import prisma from ".";

export async function createCheckin(
	classroom: GoogleClassroom,
	user: User,
	description: string,
	status: string,
	working_on: string
) {
	return await prisma.checkin.create({
		data: {
			google_classroom_id: classroom.google_classroom_id,
			description,
			status,
			working_on,
			student_id: user.id,
			google_classroom_name: (classroom.class_dict as Prisma.JsonObject)
				.name as string,
			classroom_id: classroom.id
		}
	});
}

