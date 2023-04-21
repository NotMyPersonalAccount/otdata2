import { PrismaClient } from "@prisma/client";
import { classroom_v1 } from "googleapis";

declare global {
	var prismaClient: PrismaClient?;

	namespace PrismaJson {
		type Class = classroom_v1.Schema$Course;
		type Teacher = classroom_v1.Schema$UserProfile;
		type CourseWork = {
			courseWork: classroom_v1.Schema$CourseWork[];
		};
	}
}

