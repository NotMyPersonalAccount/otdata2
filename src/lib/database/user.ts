import { Prisma } from "@prisma/client";
import prisma from ".";

function getUserGetter<T extends keyof Prisma.UserWhereInput>(key: T) {
	return async function <FindArgs extends Prisma.UserFindFirstArgs>(
		value: Prisma.UserWhereInput[T],
		findArgs: FindArgs = {} as FindArgs
	): Promise<Prisma.UserGetPayload<FindArgs> | null> {
		const args = findArgs;
		if (!args.where) args.where = {};
		args.where[key] = value;

		return (await prisma.user.findFirst(
			args
		)) as Prisma.UserGetPayload<FindArgs>;
	};
}

export const getUserById = getUserGetter("id");
export const getUserByAeriesId = getUserGetter("aeries_id");
export const getUserByGoogleId = getUserGetter("google_id");
export const getUserBySchoolEmail = getUserGetter("ot_email");

