import { trpc } from "@/lib/api/trpc";
import { Project, ProjectTask } from "@prisma/client";
import { useSession } from "next-auth/react";
import Form from "./Form";
import FormSelect from "./FormSelect";
import FormInput from "./FormInput";
import { CreateOrEditTaskInput } from "@/lib/api/routers/project";
import { TaskStatus } from "@/lib/enums/project";

type Props = {
	project: Project;
	task?: ProjectTask;
	onCreate?: (project: Project) => void;
};

export default function CreateOrEditTaskForm({
	project,
	task,
	onCreate
}: Props) {
	const { data: session } = useSession();
	return (
		<Form
			onSubmit={async (data: CreateOrEditTaskInput) => {
				if (session) {
					const result = await trpc.project.createOrEditTask.mutate({
						...data,
						id: task?.id,
						projectId: project.id
					});
					onCreate?.(result);
				}
			}}
		>
			<FormInput
				name="order"
				label="Order"
				type="number"
				min={1}
				max={project.tasks.length + 1}
				defaultValue={task?.order ?? project.tasks.length + 1}
				options={{ valueAsNumber: true, required: "Fill in order" }}
			/>
			<FormInput
				name="name"
				label="Name"
				defaultValue={task?.name}
				options={{ required: "Fill in name" }}
			/>
			<FormSelect
				name="status"
				label="Status"
				defaultValue={task?.status}
			>
				{Object.values(TaskStatus).map(status => (
					<option key={status} value={status}>
						{status}
					</option>
				))}
			</FormSelect>
			<FormInput
				name="description"
				label="Description"
				defaultValue={task?.description}
				options={{ required: "Fill in description" }}
			/>
		</Form>
	);
}

