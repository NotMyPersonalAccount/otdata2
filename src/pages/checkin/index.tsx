import prisma from "@/lib/database/prisma";
import { enforceAuthentication } from "@/utils/enforcement";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]";
import { Page, PageSection } from "@/components/Page";

type ParsedClass = {
	id: string;
	name: string;
	status: string;
	teacherName: string;
};

type Props = {
	classes: ParsedClass[];
};

export const getServerSideProps = enforceAuthentication(async context => {
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions
	);

	const data = await prisma.gEnrollment.findMany({
		where: {
			owner_id: session!.currUserId
		},
		include: {
			google_classroom: true
		}
	});
	const parsedData = data.map(enrollment => {
		const classInfo = enrollment.google_classroom!
			.class_dict! as Prisma.JsonObject;
		const teacherInfo = enrollment.google_classroom!
			.teacher_dict! as Prisma.JsonObject;

		return {
			id: classInfo.id as string,
			name: enrollment.user_classname ?? (classInfo.name as string),
			status: enrollment.status,
			teacherName: (teacherInfo.name as Prisma.JsonObject)
				.fullName as string
		};
	});
	parsedData.sort((a, b) => {
		return a.status === b.status
			? a.name.localeCompare(b.name)
			: a.status === "Active"
			? -1
			: 1;
	});

	return {
		props: {
			classes: parsedData
		}
	};
});

function Class({ id, name, status, teacherName }: ParsedClass) {
	return (
		<div className="border-b-2 last:border-b-0 px-4 sm:px-6 pt-3 pb-1 border-gray-300">
			<div className="flex flex-wrap justify-between gap-4">
				<div className="flex flex-col w-72 sm:w-1/2">
					<Link href={`/classdash/${id}`} className="text-lg">
						{name}
					</Link>
					<span className="text-gray-500">{teacherName}</span>
				</div>
				<div className="flex justify-between sm:justify-start items-center w-full sm:w-auto gap-4">
					<span>{status === "Active" ? "Active" : "Inactive"}</span>
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

export default function ClassList({ classes }: Props) {
	return (
		<Page pageTitle="Your Classes">
			<PageSection>
				{classes.map(c => (
					<Class key={c.id} {...c} />
				))}
			</PageSection>
		</Page>
	);
}

