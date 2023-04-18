import { Project, ProjectTask } from "@prisma/client";
import Modal from "./Modal";
import CreateOrEditTaskForm from "../forms/CreateOrEditTaskForm";

type Props = {
	project: Project;
	task?: ProjectTask;
	onCreate?: (project: Project) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
};

export default function CreateOrEditTaskModal({
	project,
	task,
	onCreate,
	open,
	setOpen
}: Props) {
	return (
		<Modal
			isOpen={open}
			onRequestClose={() => setOpen(false)}
			title={task ? "Edit Task" : "Create Task"}
		>
			<CreateOrEditTaskForm
				project={project}
				task={task}
				onCreate={project => {
					onCreate?.(project);
					setOpen(false);
				}}
			/>
		</Modal>
	);
}

