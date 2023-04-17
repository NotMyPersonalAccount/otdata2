import classNames from "classnames";
import {
	ButtonHTMLAttributes,
	DetailedHTMLProps,
	useMemo,
	useState
} from "react";
import Spinner from "./Spinner";

type Props = { loading?: boolean } & DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

export function Button({
	className,
	loading: initiallyLoading,
	...props
}: Props) {
	const [loading, setLoading] = useState(initiallyLoading ?? false);
	useMemo(() => setLoading(initiallyLoading!), [initiallyLoading]);

	return (
		<button
			{...props}
			className={classNames(className)}
			disabled={props.disabled || loading}
			onClick={async event => {
				if (!loading && props.onClick) {
					setLoading(true);
					await props.onClick?.(event);
					setLoading(false);
				}
			}}
		>
			{loading && <Spinner />}
			<div className={classNames({ "h-0 invisible": loading })}>
				{props.children}
			</div>
		</button>
	);
}

export function PillButton({ className, ...props }: Props) {
	return (
		<Button
			className={classNames(
				className,
				"px-4 py-2 self-start h-10 bg-blue-300 hover:bg-blue-400 rounded-lg"
			)}
			{...props}
		></Button>
	);
}

