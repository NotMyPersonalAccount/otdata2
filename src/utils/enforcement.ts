import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { forceLogin, sendError } from "./error_handling";
import { Role } from "@/lib/enums/role";

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
		const session = await getServerSession(
			context.req,
			context.res,
			authOptions
		);
		if (session!.role !== Role.Teacher)
			return sendError("You are not a teacher");
		return innerFn?.(context) ?? { props: {} };
	});

export const enforceAdmin: Enforcement = innerFn =>
	enforceAuthentication(async context => {
		const session = await getServerSession(
			context.req,
			context.res,
			authOptions
		);
		if (!session!.admin) return sendError("You are not an admin");
		return innerFn?.(context) ?? { props: {} };
	});

export const enforceAuthentication: Enforcement = innerFn => async context => {
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions
	);
	if (session === null) return await forceLogin(context);
	return innerFn?.(context) ?? { props: {} };
};

