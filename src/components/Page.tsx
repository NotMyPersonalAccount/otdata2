import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type HTMLProps<T extends HTMLElement> = DetailedHTMLProps<HTMLAttributes<T>, T>;
type SectionProps = {
	children: React.ReactNode;
	title: string;
	titleProps?: HTMLProps<HTMLHeadingElement>;
	sectionProps?: HTMLProps<HTMLDivElement>;
	padded?: boolean;
	transparent?: boolean;
};

export function Page(props: HTMLProps<HTMLDivElement>) {
	return (
		<div
			{...props}
			className={classNames("p-4 sm:p-12 xl:px-36", props.className)}
		/>
	);
}

export function PageSection({
	children,
	title,
	titleProps,
	sectionProps,
	padded,
	transparent
}: SectionProps) {
	return (
		<>
			<h1
				{...titleProps}
				className={classNames(
					"text-4xl font-bold mb-4",
					titleProps?.className
				)}
			>
				{title}
			</h1>
			<div
				{...sectionProps}
				className={classNames(
					"mx-1 sm:mx-2",
					{
						"bg-gray-200 rounded-lg": !transparent,
						"px-4 lg:px-12 py-8": padded
					},
					sectionProps?.className
				)}
			>
				{children}
			</div>
		</>
	);
}

