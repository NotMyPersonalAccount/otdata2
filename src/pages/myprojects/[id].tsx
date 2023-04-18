import { enforceAuthentication } from "@/utils/enforcement";
import prisma from "@/lib/database/prisma";
import { sendError } from "@/utils/error_handling";
import { Project, ProjectTask } from "@prisma/client";
import { Page, PageSection } from "@/components/Page";
import { Button, PillButton } from "@/components/Button";
import {
	MdAssignmentAdd,
	MdDeleteOutline,
	MdModeEditOutline
} from "react-icons/md";
import { useState } from "react";
import CreateTaskModal from "@/components/modals/CreateTask";
import { trpc } from "@/lib/api/trpc";

type Props = {
	data: string;
};

type CreateTaskButtonProps = {
	project: Project;
	onCreate?: (project: Project) => void;
};

type TaskRowProps = {
	project: Project;
	task: ProjectTask;
	onEdit?: (project: Project) => void;
};

export const getServerSideProps = enforceAuthentication(async context => {
	const project = await prisma.project.findUnique({
		where: {
			id: context.query.id as string
		}
	});
	if (!project) return sendError("Project not found");
	return {
		props: {
			data: JSON.stringify(project)
		}
	};
});

function CreateTaskButton({ project, onCreate }: CreateTaskButtonProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<CreateTaskModal
				project={project}
				onCreate={onCreate}
				open={open}
				setOpen={setOpen}
			/>
			<PillButton onClick={() => setOpen(true)}>
				<MdAssignmentAdd />
			</PillButton>
		</>
	);
}

function TaskRow({ project, task, onEdit }: TaskRowProps) {
	const [editOpen, setEditOpen] = useState(false);
	return (
		<tr>
			<td>
				<div className="flex flex-wrap gap-1">
					<Button onClick={() => setEditOpen(true)}>
						<MdModeEditOutline size={20} />
					</Button>
					<Button
						onClick={async () => {
							const result = await trpc.project.deleteTask.mutate(
								{
									id: task.id,
									projectId: project.id
								}
							);
							onEdit?.(result);
						}}
					>
						<MdDeleteOutline size={20} />
					</Button>
					{task.order}
				</div>
			</td>
			<td>{task.status}</td>
			<td>{task.name}</td>
			<td>{task.description}</td>
		</tr>
	);
}

export default function Project({ data }: Props) {
	const [project, setProject] = useState<Project>(JSON.parse(data));
	return (
		<Page pageTitle={project.name}>
			<PageSection
				title="Tasks"
				titleSuffix={
					<CreateTaskButton project={project} onCreate={setProject} />
				}
				className="overflow-x-auto"
			>
				<table>
					<thead>
						<tr>
							<th></th>
							<th>Status</th>
							<th>Name</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{project.tasks.map(task => {
							return (
								<TaskRow
									key={task.id}
									project={project}
									task={task}
									onEdit={setProject}
								/>
							);
						})}
					</tbody>
				</table>
			</PageSection>
		</Page>
	);
}

