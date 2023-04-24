import prisma from "@/lib/database/prisma";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { enforceAuthentication } from "@/utils/enforcement";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { Page, PageSection } from "@/components/Page";
import { Button, PillButton } from "@/components/Button";
import { MdAssignmentAdd, MdDeleteOutline } from "react-icons/md";
import { trpc } from "@/lib/api/trpc";
import { useEffect, useMemo, useState } from "react";
import CreateProjectModal from "@/components/modals/CreateProject";
import { ClassStatus } from "@/lib/enums/class";

type Props = {
	projects: string;
	classes: string;
};

type Project = Prisma.ProjectGetPayload<{
	include: { google_classroom: true };
}>;

type ProjectProps = Prisma.ProjectGetPayload<{
	include: { google_classroom: true };
}> & {
	onDelete?: () => void;
};

type CreateProjectButtonProps = {
	classes: Prisma.GEnrollmentGetPayload<{
		include: { google_classroom: true };
	}>[];
	onCreate?: (project: Project) => void;
};

export const getServerSideProps = enforceAuthentication(async context => {
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions
	);
	const [projects, classes] = await Promise.all([
		prisma.project.findMany({
			where: {
				student_id: session!.currUserId
			},
			select: {
				id: true,
				name: true,
				google_classroom: {
					select: {
						class_dict: true
					}
				}
			}
		}),
		prisma.gEnrollment.findMany({
			where: {
				owner_id: session!.currUserId,
				status: ClassStatus.Active
			},
			select: {
				google_classroom: {
					select: {
						id: true,
						google_classroom_id: true,
						class_dict: true
					}
				}
			}
		})
	]);
	return {
		props: {
			projects: JSON.stringify(projects),
			classes: JSON.stringify(classes)
		}
	};
});

function Project({ id, name, google_classroom, onDelete }: ProjectProps) {
	return (
		<div className="border-b-2 last:border-b-0 px-4 sm:px-6 pt-3 pb-1 border-gray-300">
			<div className="flex flex-wrap justify-between gap-4">
				<div className="flex flex-col w-72 sm:w-1/2">
					<Link href={`/myprojects/${id}`} className="text-lg">
						{name}
					</Link>
					<span className="text-gray-500">
						{google_classroom?.class_dict!.name}
					</span>
				</div>
				<div className="flex justify-between sm:justify-start items-center w-full sm:w-auto gap-4">
					<div className="flex gap-2">
						<Button
							onClick={async () => {
								await trpc.project.delete.mutate({
									id
								});
								onDelete?.();
							}}
							title="Delete Project"
						>
							<MdDeleteOutline size={20} />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function CreateProjectButton({ classes, onCreate }: CreateProjectButtonProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<CreateProjectModal
				classes={classes}
				onCreate={onCreate}
				open={open}
				setOpen={setOpen}
			/>
			<PillButton onClick={() => setOpen(true)} title="Create Project">
				<MdAssignmentAdd size={20} />
			</PillButton>
		</>
	);
}

export default function Projects({
	projects: encodedProjects,
	classes: encodedClasses
}: Props) {
	const [projects, setProjects] = useState<Project[]>([]);
	const classes = useMemo(() => JSON.parse(encodedClasses), [encodedClasses]);

	useEffect(() => {
		setProjects(JSON.parse(encodedProjects));
	}, [encodedProjects]);

	return (
		<Page
			pageTitle="Your Projects"
			pageTitleSuffix={
				<CreateProjectButton
					classes={classes}
					onCreate={project => setProjects([...projects, project])}
				/>
			}
		>
			<PageSection padding="none">
				{projects.map(project => {
					return (
						<Project
							key={project.id}
							{...project}
							onDelete={() => {
								setProjects(
									projects.filter(p => p.id !== project.id)
								);
							}}
						/>
					);
				})}
			</PageSection>
		</Page>
	);
}

