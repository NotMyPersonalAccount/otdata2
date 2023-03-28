import { forwardRef, ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
	label: string;
	options: UseFormRegisterReturn<string>;
	children: ReactNode;
};

export default function FormSelect({ label, options, children }: Props) {
	return (
		<div className="flex flex-col gap-2 w-64 md:w-96">
			<label className="text-lg font-semibold">{label}</label>
			<select
				className="outline outline-1 outline-black hover:outline-2 hover:outline-blue-500 focus:outline-2 focus:outline-blue-500 px-2 py-2 rounded-md"
				{...options}
			>
				{children}
			</select>
		</div>
	);
}

