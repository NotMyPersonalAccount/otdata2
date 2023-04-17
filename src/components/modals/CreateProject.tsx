import { Prisma, Project } from "@prisma/client";
import Modal from "./Modal";
import CreateProjectForm from "../forms/CreateProjectForm";

type Props = {
	classes: Prisma.GEnrollmentGetPayload<{
		include: { google_classroom: true };
	}>[];
	onCreate?: (
		data: Prisma.ProjectGetPayload<{
			include: { google_classroom: true };
		}>
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

