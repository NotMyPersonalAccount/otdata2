import { FindUserInput } from "@/lib/api/routers/user";
import { trpc } from "@/lib/api/trpc";
import { User } from "@prisma/client";
import Form from "./Form";
import FormInput from "./FormInput";

type Props = {
	onFind?: (data: User[]) => void;
};

export default function FindStudentForm({ onFind }: Props) {
	return (
		<Form
			onSubmit={async (data: FindUserInput) => {
				onFind?.((await trpc.user.find.query(data)) as User[]);
			}}
			submitLabel="Search"
		>
			<FormInput name="first_name" label="First Name" />
			<FormInput name="last_name" label="Last Name" />
			<FormInput name="aeries_id" label="Aeries ID" />
		</Form>
	);
}

