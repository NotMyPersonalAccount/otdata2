import prisma from "@/lib/database/prisma";
import { enforceAuthentication } from "@/utils/enforcement";
import { GEnrollment, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]";
import { Page, PageSection } from "@/components/Page";
import { Button } from "@/components/Button";
import { MdDeleteOutline } from "react-icons/md";
import { trpc } from "@/lib/api/trpc";
import { useEffect, useState } from "react";

type ParsedClass = {
	id: string;
	googleId: string;
	name: string;
	status: string;
	teacherName: string;
};

type Props = {
	classes: ParsedClass[];
};

type ClassProps = ParsedClass & {
	onDelete?: (_class: GEnrollment) => void;
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
			id: enrollment.id,
			googleId: classInfo.id as string,
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

function Class({
	id,
	googleId,
	name,
	status,
	teacherName,
	onDelete
}: ClassProps) {
	return (
		<div className="border-b-2 last:border-b-0 px-4 sm:px-6 pt-3 pb-1 border-gray-300">
			<div className="flex flex-wrap justify-between gap-4">
				<div className="flex flex-col w-72 sm:w-1/2">
					<Link href={`/classdash/${googleId}`} className="text-lg">
						{name}
					</Link>
					<span className="text-gray-500">{teacherName}</span>
				</div>
				<div className="flex justify-between sm:justify-start items-center w-full sm:w-auto gap-4">
					<span>{status === "Active" ? "Active" : "Inactive"}</span>
					<div className="flex gap-2">
						{/* TODO: Use icons here */}
						<span>E</span>
						<Button
							onClick={async () => {
								const _class = await trpc.class.delete.mutate({
									id
								});
								onDelete?.(_class);
							}}
						>
							<MdDeleteOutline size={20} />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function ClassList({ classes: initialClasses }: Props) {
	const [classes, setClasses] = useState(initialClasses);
	useEffect(() => {
		setClasses(initialClasses);
	}, [initialClasses]);

	return (
		<Page pageTitle="Your Classes">
			<PageSection padding="none">
				{classes.map(c => (
					<Class
						key={c.id}
						{...c}
						onDelete={(_class: GEnrollment) => {
							setClasses(classes =>
								classes.filter(c => c.id !== _class.id)
							);
						}}
					/>
				))}
			</PageSection>
		</Page>
	);
}

