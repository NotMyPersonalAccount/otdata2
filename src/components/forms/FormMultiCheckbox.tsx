import {
	Control,
	Controller,
	RegisterOptions
} from "react-hook-form";

type Props = {
	control?: Control;
	name: string;
	label: string;
	choices: { value: string; label: string }[];
	options?: RegisterOptions;
};

export default function FormMultiCheckbox({
	control,
	name,
	label,
	choices
}: Props) {
	return (
		<div className="flex flex-col gap-2 w-full">
			<label className="text-lg font-semibold">{label}</label>
			<Controller
				control={control}
				name={name}
				render={({ field }) => {
					return (
						<fieldset className="flex flex-wrap gap-x-2">
							{choices.map(({ value, label }, i) => {
								return (
									<label key={value} className="flex gap-x-1">
										<input
											type="checkbox"
											value={value}
											onChange={e => {
												let result = field.value ?? [];
												if (e.target.checked) {
													result.push(value);
												} else {
													result = result.filter(
														(v: string) =>
															v !== value
													);
												}
												field.onChange(
													result.length > 0
														? result
														: undefined
												);
											}}
										/>
										{label}
									</label>
								);
							})}
						</fieldset>
					);
				}}
			/>
		</div>
	);
}

