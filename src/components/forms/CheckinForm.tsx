import { useForm } from "react-hook-form";
import Form from "./Form";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

type Props = {
	assignments: { [key: string]: any }[];
};

export default function CheckinForm({ assignments }: Props) {
	const { register, handleSubmit, formState } = useForm();

	return (
		<Form
			onSubmit={handleSubmit(async data => {
				await new Promise(resolve => setTimeout(resolve, 2000));
				console.log(data);
			})}
			formState={formState}
		>
			<FormSelect
				label="Were you productive since last class?"
				options={register("status")}
			>
				<option value="5">Very Productive</option>
				<option value="4">Mostly</option>
				<option value="3">Meh</option>
				<option value="2">Not Really</option>
				<option value="1">Not</option>
			</FormSelect>
			<FormSelect
				label="What assignment are you working on?"
				options={register("assignment")}
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
				label="What have you done since the last class?"
				options={register("working_on")}
			/>
			<FormInput
				label="If you chose other, what are you going to do?"
				options={register("working_on_other")}
			/>
		</Form>
	);
}

