import { GEnrollment } from '@prisma/client';
import prisma from '.';

export async function getEnrollmentByUser(userId: string): Promise<GEnrollment[]> {
	return await prisma.gEnrollment.findMany({
		where: {
			owner_id: userId
		},
		include: {
			google_classroom: true
		}
	});
}

