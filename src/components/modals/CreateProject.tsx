import { Prisma } from "@prisma/client";
import Modal from "./Modal";
import CreateProjectForm from "../forms/CreateProjectForm";
import type {Class, Project} from "@/pages/myprojects/index";

type Props = {
	classes: Class[];
	onCreate?: (
		data: Project
	) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
};

export default function CreateProjectModal({
	classes,
	onCreate,
	open,
	setOpen
}: Props) {
	return (
		<Modal
			isOpen={open}
			onRequestClose={() => setOpen(false)}
			title="Create Project"
		>
			<CreateProjectForm
				classes={classes}
				onCreate={project => {
					onCreate?.(project);
					setOpen(false);
				}}
			/>
		</Modal>
	);
}

