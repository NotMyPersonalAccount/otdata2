import { User } from "@prisma/client";
import prisma from ".";

export async function getUserByAeriesId(
	aeriesId: number
): Promise<User | null> {
	return await prisma.user.findFirst({
		where: {
			aeries_id: aeriesId
		}
	});
}

export async function getUserByGoogleId(
	googleId: string
): Promise<User | null> {
	return await prisma.user.findFirst({
		where: {
			google_id: googleId
		}
	});
}

export async function getUserBySchoolEmail(
	email: string
): Promise<User | null> {
	return await prisma.user.findFirst({
		where: {
			ot_email: email
		}
	});
}

