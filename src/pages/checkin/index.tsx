import prisma from "@/lib/database/prisma";
import { enforceAuthentication } from "@/utils/enforcement";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useMemo } from "react";
import { authOptions } from "../api/auth/[...nextauth]";

type Props = {
	data: string;
};

type GEnrollmentWithGoogleClassroom = Prisma.GEnrollmentGetPayload<{
	include: {
		google_classroom: true;
	};
}>;

type ClassProps = {
	class: GEnrollmentWithGoogleClassroom;
};

export const getServerSideProps = enforceAuthentication(async context => {
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions
	);
	return {
		props: {
			data: JSON.stringify(
				await prisma.gEnrollment.findMany({
					where: {
						owner_id: session!.currUserId
					},
					include: {
						google_classroom: true
					}
				})
			)
		}
	};
});

function Class(props: ClassProps) {
	const _class = props.class;
	const classInfo = _class.google_classroom!.class_dict! as Prisma.JsonObject;
	const teacherInfo = _class.google_classroom!
		.teacher_dict! as Prisma.JsonObject;
	return (
		<div className="border-b-2 last:border-b-0 px-4 sm:px-6 pt-3 pb-1 border-gray-300">
			<div className="flex flex-wrap justify-between gap-4">
				<div className="flex flex-col w-72 sm:w-1/2">
					<Link
						href={`/classdash/${classInfo.id}`}
						className="text-lg"
					>
						{classInfo.name as string}
					</Link>
					<span className="text-gray-500">
						{
							(teacherInfo.name as Prisma.JsonObject)
								.fullName as string
						}
					</span>
				</div>
				<div className="flex justify-between sm:justify-start items-center w-full sm:w-auto gap-4">
					<span>
						{_class.status === "Active" ? "Active" : "Inactive"}
					</span>
					<div className="flex gap-2">
						{/* TODO: Use icons here */}
						<span>E</span>
						<span>T</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function ClassList({ data }: Props) {
	const classes = useMemo(() => {
		const parsed: GEnrollmentWithGoogleClassroom[] = JSON.parse(data);
		parsed.sort((a, b) => {
			if (a.status === "Active" && b.status !== "Active") return -1;
			if (a.status !== "Active" && b.status === "Active") return 1;

			const nameA =
				a.user_classname ??
				((a.google_classroom!.class_dict as Prisma.JsonObject)
					.name as string);
			const nameB =
				b.user_classname ??
				((b.google_classroom!.class_dict as Prisma.JsonObject)
					.name as string);
			return nameA.localeCompare(nameB);
		});
		return parsed;
	}, [data]);
	return (
		<div className="p-4 sm:p-12 xl:px-48">
			<h1 className="text-4xl font-bold mb-4">Your Classes</h1>
			<div className="bg-gray-200 mx-1 sm:mx-2 rounded-lg">
				{classes.map(c => (
					<Class key={c.id.toString()} class={c} />
				))}
			</div>
		</div>
	);
}

