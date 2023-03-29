import { ReactNode } from "react";
import { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form";

type Props = {
	register?: UseFormRegister<FieldValues>;
	name: string;
	label: string;
	children: ReactNode;
	options?: RegisterOptions;
};

export default function FormSelect({
	register,
	name,
	label,
	children,
	options
}: Props) {
	return (
		<div className="flex flex-col gap-2 w-full justify-between">
			<label className="text-lg font-semibold">{label}</label>
			<select
				className="outline outline-1 outline-black hover:outline-2 hover:outline-blue-500 focus:outline-2 focus:outline-blue-500 px-2 py-2 rounded-md"
				{...register!(name, options)}
			>
				{children}
			</select>
		</div>
	);
}

