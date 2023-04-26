import { trpc } from "@/lib/api/trpc";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Form from "./Form";
import FormSelect from "./FormSelect";
import FormInput from "./FormInput";
import { CreateProjectInput } from "@/lib/api/routers/project";
import type {Class, Project} from "@/pages/myprojects/index";

type Props = {
	classes: Class[];
	onCreate?: (
		project: Project
	) => void;
};

export default function CreateProjectForm({ classes, onCreate }: Props) {
	const { data: session } = useSession();
	return (
		<Form
			onSubmit={async (data: CreateProjectInput) => {
				if (session) {
					const project = await trpc.project.create.mutate(data);
					onCreate?.(project);
				}
			}}
		>
			<FormSelect name="classId" label="Class">
				{classes.map(c => {
					return (
						c.google_classroom && (
							<option
								key={c.id}
								value={c.google_classroom.google_classroom_id!}
							>
								{c.google_classroom.class_dict!.name}
							</option>
						)
					);
				})}
			</FormSelect>
			<FormInput
				name="name"
				label="Name"
				options={{ required: "Fill in name" }}
			/>
		</Form>
	);
}

