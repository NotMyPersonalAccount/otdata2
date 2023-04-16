import classNames from "classnames";
import Head from "next/head";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type HTMLProps<T extends HTMLElement> = DetailedHTMLProps<HTMLAttributes<T>, T>;
type Props = HTMLProps<HTMLDivElement> & {
	pageTitle: string;
	pageTitleProps?: HTMLProps<HTMLHeadingElement>;
};
type SectionProps = HTMLProps<HTMLDivElement> & {
	title?: string;
	titleProps?: HTMLProps<HTMLHeadingElement>;
	padding?: "sm" | "lg" | "none";
};

export function Page({ pageTitle, pageTitleProps, ...props }: Props) {
	return (
		<>
			<Head>
				<title>{pageTitle} - OTData</title>
			</Head>
			<div
				{...props}
				className={classNames("p-4 sm:p-12 xl:px-36", props.className)}
			>
				<h1
					{...pageTitleProps}
					className={classNames(
						"text-4xl font-bold mb-4",
						pageTitleProps?.className
					)}
				>
					{pageTitle}
				</h1>
				{props.children}
			</div>
		</>
	);
}

export function PageSection({
	title,
	titleProps,
	padding,
	...props
}: SectionProps) {
	return (
		<div className="mx-1 sm:mx-2 flex flex-col">
			{title && (
				<h2
					{...titleProps}
					className={classNames(
						"text-2xl font-bold mb-2",
						titleProps?.className
					)}
				>
					{title}
				</h2>
			)}
			<div
				{...props}
				className={classNames(
					"bg-gray-200 rounded-lg grow",
					{
						"px-4 lg:px-12 py-8": padding === "lg" || !padding,
						"px-4 sm:px-8 py-4": padding === "sm"
					},
					props?.className
				)}
			>
				{props.children}
			</div>
		</div>
	);
}

