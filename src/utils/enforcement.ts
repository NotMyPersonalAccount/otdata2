import { GetServerSideProps } from "next";
import { forceLogin, sendError } from "./error_handling";
import { Role } from "@/lib/enums/role";
import { getServerSessionCached } from "@/lib/auth";

type Enforcement = <T extends { [key: string]: any }>(
	innerFn?: GetServerSideProps<T | ErrorProps>
) => GetServerSideProps<T | ErrorProps>;

type ErrorProps =
	| {
			error: string;
	  }
	| {};

export const enforceTeacher: Enforcement = innerFn =>
	enforceAuthentication(async context => {
		const session = await getServerSessionCached(
			context.req,
			context.res
		);
		if (session!.role !== Role.Teacher)
			return sendError("You are not a teacher");
		return innerFn?.(context) ?? { props: {} };
	});

export const enforceAdmin: Enforcement = innerFn =>
	enforceAuthentication(async context => {
		const session = await getServerSessionCached(
			context.req,
			context.res
		);
		if (!session!.admin) return sendError("You are not an admin");
		return innerFn?.(context) ?? { props: {} };
	});

export const enforceAuthentication: Enforcement = innerFn => async context => {
	const session = await getServerSessionCached(
		context.req,
		context.res
	);
	if (session === null) return await forceLogin(context);
	const result = (await innerFn?.(context)) as {
		props: { [key: string]: any } | undefined;
	};
	return result
		? { ...result, props: { ...result.props, session } }
		: { props: {} };
};

