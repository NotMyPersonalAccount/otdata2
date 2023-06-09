import { enforceAuthentication } from "@/utils/enforcement";
import prisma from "@/lib/database/prisma";
import { sendError } from "@/utils/error_handling";
import { Project, ProjectCheckin, ProjectTask } from "@prisma/client";
import { Page, PageSection } from "@/components/Page";
import { Button, PillButton } from "@/components/Button";
import {
	MdAssignmentAdd,
	MdDeleteOutline,
	MdModeEditOutline
} from "react-icons/md";
import { useState } from "react";
import CreateTaskModal from "@/components/modals/CreateOrEditTask";
import { trpc } from "@/lib/api/trpc";
import CreateOrEditTaskModal from "@/components/modals/CreateOrEditTask";
import dayjs from "dayjs";
import CreateProjectCheckinModal from "@/components/modals/CreateProjectCheckin";
import { TaskStatus } from "@/lib/enums/project";
import { useSession } from "next-auth/react";

type Props = {
	data: string;
};

type SectionProps = {
	project: Project;
	setProject: (project: Project) => void;
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

type CheckinRowProps = {
	project: Project;
	checkin: ProjectCheckin;
	onDelete?: (project: Project) => void;
};

export const getServerSideProps = enforceAuthentication<Props>(
	async context => {
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
	}
);

function TaskSection({ project, setProject }: SectionProps) {
	const { data: session } = useSession();
	return (
		<PageSection
			title="Tasks"
			titleSuffix={
				session?.currUserId === project.student_id && (
					<CreateTaskButton project={project} onCreate={setProject} />
				)
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
	);
}

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
			<PillButton onClick={() => setOpen(true)} title="Create Task">
				<MdAssignmentAdd />
			</PillButton>
		</>
	);
}

function TaskRow({ project, task, onEdit }: TaskRowProps) {
	const { data: session } = useSession();
	const [editOpen, setEditOpen] = useState(false);
	return (
		<tr>
			<td>
				<div className="flex flex-wrap gap-1">
					<CreateOrEditTaskModal
						project={project}
						task={task}
						onCreate={onEdit}
						open={editOpen}
						setOpen={setEditOpen}
					/>
					{session?.currUserId === project.student_id && (
						<>
							<Button
								onClick={() => setEditOpen(true)}
								title="Edit Task"
							>
								<MdModeEditOutline size={20} />
							</Button>
							<Button
								onClick={async () => {
									const result =
										await trpc.project.deleteTask.mutate({
											id: task.id,
											projectId: project.id
										});
									onEdit?.(result);
								}}
								title="Delete Task"
							>
								<MdDeleteOutline size={20} />
							</Button>
						</>
					)}
					{task.order}
				</div>
			</td>
			<td>
				{task.status === TaskStatus.Complete
					? `${task.status} ${dayjs(task.complete_date).calendar()}`
					: task.status}
			</td>
			<td>{task.name}</td>
			<td>{task.description}</td>
		</tr>
	);
}

function CheckinSection({ project, setProject }: SectionProps) {
	const { data: session } = useSession();
	return (
		<PageSection
			title="Checkins"
			titleSuffix={
				session?.currUserId === project.student_id && (
					<CreateCheckinButton
						project={project}
						onCreate={setProject}
					/>
				)
			}
			className="overflow-x-auto"
		>
			<table>
				<thead>
					<tr>
						{session?.currUserId === project.student_id && (
							<th></th>
						)}
						<th>Date</th>
						<th>Task</th>
						<th>Status</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{project.checkins.map(checkin => {
						return (
							<CheckinRow
								key={checkin.id}
								project={project}
								checkin={checkin}
								onDelete={setProject}
							/>
						);
					})}
				</tbody>
			</table>
		</PageSection>
	);
}

function CreateCheckinButton({ project, onCreate }: CreateTaskButtonProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<CreateProjectCheckinModal
				project={project}
				onCreate={onCreate}
				open={open}
				setOpen={setOpen}
			/>
			<PillButton onClick={() => setOpen(true)} title="Create Checkin">
				<MdAssignmentAdd />
			</PillButton>
		</>
	);
}

function CheckinRow({ project, checkin, onDelete }: CheckinRowProps) {
	const { data: session } = useSession();
	return (
		<tr>
			{session?.currUserId === project.student_id && (
				<td>
					<Button
						onClick={async () => {
							const result =
								await trpc.project.deleteCheckin.mutate({
									id: checkin.id,
									projectId: project.id
								});
							onDelete?.(result);
						}}
						title="Delete Checkin"
					>
						<MdDeleteOutline size={20} />
					</Button>
				</td>
			)}
			<td>{dayjs(checkin.create_date).calendar()}</td>
			<td>
				{project.tasks.find(t => t.id === checkin.working_on_id)!.name}
			</td>
			<td>{checkin.status}</td>
			<td>{checkin.description}</td>
		</tr>
	);
}

export default function Project({ data }: Props) {
	const [project, setProject] = useState<Project>(JSON.parse(data));
	return (
		<Page pageTitle={project.name}>
			<TaskSection project={project} setProject={setProject} />
			<CheckinSection project={project} setProject={setProject} />
		</Page>
	);
}

