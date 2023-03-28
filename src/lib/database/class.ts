import { GEnrollment, Prisma } from "@prisma/client";
import prisma from ".";

export async function getClassroomByGoogleId<
	T extends
		| Prisma.GoogleClassroomFindUniqueArgs
		| Omit<Prisma.GoogleClassroomFindUniqueArgs, "where">
>(
	id: string,
	findArgs: T = {} as T
): Promise<Prisma.GoogleClassroomGetPayload<T> | null> {
	return (await prisma.googleClassroom.findUnique({
		...findArgs,
		where: {
			...(findArgs as Prisma.GoogleClassroomFindUniqueArgs).where,
			google_classroom_id: id
		}
	})) as Prisma.GoogleClassroomGetPayload<T>;
}

export async function getEnrollmentByUser(
	userId: string
): Promise<GEnrollment[]> {
	return await prisma.gEnrollment.findMany({
		where: {
			owner_id: userId
		},
		include: {
			google_classroom: true
		}
	});
}

