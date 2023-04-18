import { Project } from "@prisma/client";
import Modal from "./Modal";
import CreateTaskForm from "../forms/CreateTaskForm";

type Props = {
	project: Project;
	onCreate?: (project: Project) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
};

export default function CreateTaskModal({
	project,
	onCreate,
	open,
	setOpen
}: Props) {
	return (
		<Modal
			isOpen={open}
			onRequestClose={() => setOpen(false)}
			title="Create Task"
		>
			<CreateTaskForm project={project} onCreate={onCreate} />
		</Modal>
	);
}

