import { Project } from "@prisma/client";
import Modal from "./Modal";
import CreateProjectCheckinForm from "../forms/CreateProjectCheckinForm";

type Props = {
	project: Project;
	onCreate?: (project: Project) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
};

export default function CreateProjectCheckinModal({
	project,
	onCreate,
	open,
	setOpen
}: Props) {
	return (
		<Modal
			isOpen={open}
			onRequestClose={() => setOpen(false)}
			title="Create Checkin"
		>
			<CreateProjectCheckinForm
				project={project}
				onCreate={project => {
					onCreate?.(project);
					setOpen(false);
				}}
			/>
		</Modal>
	);
}

