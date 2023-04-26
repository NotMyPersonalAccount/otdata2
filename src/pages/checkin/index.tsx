import prisma from "@/lib/database/prisma";
import { enforceAuthentication } from "@/utils/enforcement";
import { GEnrollment } from "@prisma/client";
import Link from "next/link";
import { Page, PageSection } from "@/components/Page";
import { Button } from "@/components/Button";
import { MdDeleteOutline } from "react-icons/md";
import { trpc } from "@/lib/api/trpc";
import { useEffect, useState } from "react";
import { ClassStatus } from "@/lib/enums/class";
import { getServerSessionCached } from "@/lib/auth";

type Class = Awaited<ReturnType<typeof getClasses>>[0];
type ClassProps = Class & {
	onDelete?: (_class: GEnrollment) => void;
};
type Props = {
	classes: Class[];
};

async function getClasses(userId: string) {
	return await prisma.gEnrollment.findMany({
		where: {
			owner_id: userId
		},
		select: {
			id: true,
			user_classname: true,
			status: true,
			google_classroom: {
				select: {
					class_dict: true,
					teacher_dict: true
				}
			}
		}
	});
}

export const getServerSideProps = enforceAuthentication<Props>(
	async context => {
		const session = await getServerSessionCached(
			context.req,
			context.res
		);

		const data = await getClasses(session!.currUserId);
		data.sort((a, b) => {
			return a.status === b.status
				? a.google_classroom!.class_dict!.name!.localeCompare(
						b.google_classroom!.class_dict!.name!
				  )
				: a.status === ClassStatus.Active
				? -1
				: 1;
		});

		return {
			props: {
				classes: data
			}
		};
	}
);

function Class({
	id,
	status,
	user_classname,
	google_classroom,
	onDelete
}: ClassProps) {
	const classInfo = google_classroom!.class_dict!;
	return (
		<div className="border-b-2 last:border-b-0 px-4 sm:px-6 pt-3 pb-1 border-gray-300">
			<div className="flex flex-wrap justify-between gap-4">
				<div className="flex flex-col w-72 sm:w-1/2">
					<Link
						href={`/classdash/${classInfo.id}`}
						className="text-lg"
					>
						{user_classname || classInfo.name}
					</Link>
					<span className="text-gray-500">
						{google_classroom!.teacher_dict!.name!.fullName}
					</span>
				</div>
				<div className="flex justify-between sm:justify-start items-center w-full sm:w-auto gap-4">
					<span>
						{status === ClassStatus.Active
							? ClassStatus.Active
							: ClassStatus.Inactive}
					</span>
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
							title="Delete Class"
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
	useEffect(() => setClasses(initialClasses), [initialClasses]);

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

