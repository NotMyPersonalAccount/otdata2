import { GoogleClassroom, Prisma, User } from "@prisma/client";
import prisma from ".";

export async function createCheckin(
	classroomId: string,
	classroomName: string,
	googleClassroomId: string,
	userId: string,
	description: string,
	status: string,
	working_on: string
) {
	return await prisma.checkin.create({
		data: {
			google_classroom_id: googleClassroomId,
			description,
			status,
			working_on,
			student_id: userId,
			google_classroom_name: classroomName,
			classroom_id: classroomId
		}
	});
}

		}
	});
}

