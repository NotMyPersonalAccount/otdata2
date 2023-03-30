import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLProps } from "react";

type Props = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

export default function Button({ className, ...props }: Props) {
	return (
		<button
			className={classNames(
				className,
				"px-2 py-2 w-24 h-10 bg-blue-300 hover:bg-blue-400 rounded-lg"
			)}
			{...props}
		></button>
	);
}

