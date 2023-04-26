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
<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> e679b59 (squash project)
import CreateProjectModal from "@/components/modals/CreateProject";
import { ClassStatus } from "@/lib/enums/class";

export type Project = Awaited<ReturnType<typeof getProjects>>[0];
export type Class = Awaited<ReturnType<typeof getClasses>>[0];

type Props = {
	projects: Project[];
	classes: Class[];
};

type ProjectProps = Project & {
	onDelete?: () => void;
};

type CreateProjectButtonProps = {
	classes: Class[];
	onCreate?: (project: Project) => void;
};

async function getProjects(userId: string) {
	return await prisma.project.findMany({
		where: {
			student_id: userId
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
	});
}

async function getClasses(userId: string) {
	return await prisma.gEnrollment.findMany({
		where: {
			owner_id: userId,
			status: ClassStatus.Active
		},
		select: {
			id: true,
			google_classroom: {
				select: {
					id: true,
					google_classroom_id: true,
					class_dict: true
				}
			}
		}
	});
}

export const getServerSideProps = enforceAuthentication<Props>(
	async context => {
		const session = await getServerSession(
			context.req,
			context.res,
			authOptions
		);
		const [projects, classes] = await Promise.all([
			getProjects(session!.currUserId),
			getClasses(session!.currUserId)
		]);
		return {
			props: {
				projects: projects,
				classes: classes
			}
		};
	}
);

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
	projects: initialProjects,
	classes
}: Props) {
	const [projects, setProjects] = useState(initialProjects);
	useEffect(() => setProjects(initialProjects), [initialProjects]);

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

