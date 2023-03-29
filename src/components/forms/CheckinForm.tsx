import { CreateCheckinInput } from "@/lib/api/routers/checkin";
import { trpc } from "@/lib/api/trpc";
import { Checkin } from "@prisma/client";
import { useSession } from "next-auth/react";
import Form from "./Form";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

type Props = {
	classId: string;
	assignments: { [key: string]: any }[];
	onCreate?: (checkin: Checkin) => void;
};

export default function CheckinForm({ classId, assignments, onCreate }: Props) {
	const { data: session } = useSession();
	const { mutateAsync: createCheckin } = trpc.checkin.create.useMutation();
	return (
		<Form
			onSubmit={async (data: CreateCheckinInput) => {
				if (session) {
					const checkin = await createCheckin({
						...data,
						classId,
						userId: session.currUserId
					});
					if (onCreate) onCreate(checkin as Checkin);
				}
			}}
		>
			<FormSelect
				name="status"
				label="Were you productive since last class?"
				options={{ required: "Fill in productivity" }}
			>
				<option value="5">Very Productive</option>
				<option value="4">Mostly</option>
				<option value="3">Meh</option>
				<option value="2">Not Really</option>
				<option value="1">Not</option>
			</FormSelect>
			<FormSelect
				name="assignment"
				label="What assignment are you working on?"
				options={{ required: "Fill in what you are working on" }}
			>
				{assignments.map((assignment, i) => {
					return (
						<option key={i} value={assignment.title}>
							{assignment.title}
						</option>
					);
				})}
			</FormSelect>
			<FormInput
				name="working_on"
				label="What have you done since the last class?"
				options={{
					required: "Fill in what you have done since last classs"
				}}
			/>
			<FormInput
				name="working_on_other"
				label="If you chose other, what are you going to do?"
			/>
		</Form>
	);
}

