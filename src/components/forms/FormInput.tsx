import { ForwardedRef, forwardRef, Ref } from "react";
import { FieldRefs, RefCallBack, UseFormRegisterReturn } from "react-hook-form";

type Props = {
	label: string;
	options: UseFormRegisterReturn<string>;
};

export default function FormInput({ label, options }: Props) {
	return (
		<div className="flex flex-col gap-2 w-64 md:w-96">
			<label className="text-lg font-semibold">{label}</label>
			<input
				className="outline outline-1 outline-black hover:outline-2 hover:outline-blue-500 focus:outline-2 focus:outline-blue-500 px-2 py-2 rounded-md"
				{...options}
			/>
		</div>
	);
}

