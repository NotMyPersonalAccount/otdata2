import { trpc } from "@/lib/api/trpc";
import { Project } from "@prisma/client";
import { useSession } from "next-auth/react";
import Form from "./Form";
import FormSelect from "./FormSelect";
import FormInput from "./FormInput";
import { CreateOrEditCheckinInput } from "@/lib/api/routers/project";
import { CheckinStatus, TaskStatus } from "@/lib/enums/project";

type Props = {
	project: Project;
	onCreate?: (project: Project) => void;
};

export default function CreateProjectCheckinForm({ project, onCreate }: Props) {
	const { data: session } = useSession();
	return (
		<Form
			onSubmit={async (data: CreateOrEditCheckinInput) => {
				if (session) {
					const result =
						await trpc.project.createOrEditCheckin.mutate({
							...data,
							projectId: project.id
						});
					onCreate?.(result);
				}
			}}
		>
			<FormSelect name="taskId" label="Task">
				{project.tasks.map(task => (
					<option key={task.id} value={task.id}>
						{task.name}
					</option>
				))}
			</FormSelect>
			<FormSelect name="status" label="Status">
				{Object.values(CheckinStatus).map(status => (
					<option key={status} value={status}>
						{status}
					</option>
				))}
			</FormSelect>
			<FormInput
				name="description"
				label="Description"
				options={{ required: "Fill in description" }}
			/>
		</Form>
	);
}

