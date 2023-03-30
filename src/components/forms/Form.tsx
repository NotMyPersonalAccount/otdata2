import classNames from "classnames";
import {
	Children,
	createElement,
	HTMLProps,
	ReactElement,
	ReactNode
} from "react";
import { FieldValues, useForm } from "react-hook-form";
import Button from "../Button";

type Props = Omit<HTMLProps<HTMLFormElement>, "onSubmit"> & {
	children: ReactNode;
	onSubmit: (data: any) => Promise<void>;
};

export default function Form({
	className,
	onSubmit,
	children,
	...props
}: Props) {
	const { register, handleSubmit, setError, formState } = useForm({
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
				{Children.map(children, child => {
					const element = child as ReactElement;
					return element?.props?.name
						? createElement(element.type, {
								...{
									...element.props,
									register,
									key: element.props.name
								}
						  })
						: element;
				})}
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
			<Button loading={formState.isSubmitting}>Submit</Button>
		</form>
	);
}

