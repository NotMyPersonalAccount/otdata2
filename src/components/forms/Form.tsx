import classNames from "classnames";
import {
	Children,
	cloneElement,
	createElement,
	HTMLProps,
	isValidElement,
	ReactNode
} from "react";
import {
	Control,
	FieldValues,
	useForm,
	UseFormRegister
} from "react-hook-form";
import { PillButton } from "../Button";

type Props = Omit<HTMLProps<HTMLFormElement>, "onSubmit"> & {
	submitLabel?: string;
	children: ReactNode;
	onSubmit: (data: any) => Promise<void>;
};

function addFormProps(
	children: ReactNode,
	register: UseFormRegister<FieldValues>,
	control: Control
) {
	return Children.map(children, (child: ReactNode): ReactNode => {
		if (!isValidElement(child)) return child;

		if (child.props.name)
			return createElement(child.type, {
				...child.props,
				register,
				control
			});
		if (child.props.children)
			return cloneElement<typeof child.props>(child, {
				children: addFormProps(child.props.children, register, control)
			});
		return child;
	});
}

export default function Form({
	submitLabel,
	className,
	onSubmit,
	children,
	...props
}: Props) {
	const { control, register, handleSubmit, setError, formState } = useForm({
		reValidateMode: "onSubmit"
	});

	return (
		<form
			{...props}
			className={classNames("flex flex-col gap-4", className)}
			onSubmit={handleSubmit(async data => {
				try {
					await onSubmit(data);
				} catch (e) {
					setError("root", {
						type: "server",
						message: (e as Error).message
					});
				}
			})}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max gap-4">
				{addFormProps(children, register, control)}
			</div>
			<div>
				{Object.entries(formState.errors).map(([name, error]) => {
					return error ? (
						<div key={name} className="text-red-500 font-semibold">
							{error.message as string}
						</div>
					) : undefined;
				})}
			</div>
			<PillButton loading={formState.isSubmitting}>
				{submitLabel ?? "Submit"}
			</PillButton>
		</form>
	);
}

