import { trpc } from "@/lib/api/trpc";
import { Project } from "@prisma/client";
import { useSession } from "next-auth/react";
import Form from "./Form";
import FormSelect from "./FormSelect";
import FormInput from "./FormInput";
import { CreateOrEditTaskInput } from "@/lib/api/routers/project";

type Props = {
	project: Project;
	onCreate?: (project: Project) => void;
};

export default function CreateTaskForm({ project, onCreate }: Props) {
	const { data: session } = useSession();
	return (
		<Form
			onSubmit={async (data: CreateOrEditTaskInput) => {
				if (session) {
					const result = await trpc.project.createOrEditTask.mutate({
						...data,
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
				defaultValue={project.tasks.length + 1}
				options={{ valueAsNumber: true, required: "Fill in order" }}
			/>
			<FormInput
				name="name"
				label="Name"
				options={{ required: "Fill in name" }}
			/>
			<FormSelect name="status" label="Status">
				<option value="New">New</option>
				<option value="In Progress">In Progress</option>
				<option value="Complete">Complete</option>
			</FormSelect>
			<FormInput
				name="description"
				label="Description"
				options={{ required: "Fill in description" }}
			/>
		</Form>
	);
}

