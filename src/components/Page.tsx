import classNames from "classnames";
import Head from "next/head";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type HTMLProps<T extends HTMLElement> = DetailedHTMLProps<HTMLAttributes<T>, T>;
type Props = HTMLProps<HTMLDivElement> & {
	pageTitle: string;
	pageTitleProps?: HTMLProps<HTMLHeadingElement>;
	pageTitleSuffix?: ReactNode;
};
type SectionProps = HTMLProps<HTMLDivElement> & {
	title?: string;
	titleProps?: HTMLProps<HTMLHeadingElement>;
	titleSuffix?: ReactNode;
	padding?: "sm" | "lg" | "none";
};

export function Page({
	pageTitle,
	pageTitleProps,
	pageTitleSuffix,
	...props
}: Props) {
	return (
		<>
			<Head>
				<title>{`${pageTitle} - OTData`}</title>
			</Head>
			<div
				{...props}
				className={classNames("p-4 sm:p-12 xl:px-36", props.className)}
			>
				<div className="flex flex-wrap gap-2 md:gap-4 mb-4">
					<h1
						{...pageTitleProps}
						className={classNames(
							"text-4xl font-bold",
							pageTitleProps?.className
						)}
					>
						{pageTitle}
					</h1>
					{pageTitleSuffix}
				</div>
				{props.children}
			</div>
		</>
	);
}

export function PageSection({
	title,
	titleProps,
	titleSuffix,
	padding,
	...props
}: SectionProps) {
	return (
		<div className="mx-1 sm:mx-2 flex flex-col">
			{title && (
				<div className="flex flex-wrap gap-2 mb-2">
					<h2
						{...titleProps}
						className={classNames(
							"text-2xl font-bold",
							titleProps?.className
						)}
					>
						{title}
					</h2>
					{titleSuffix}
				</div>
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

