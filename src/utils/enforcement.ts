import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { forceLogin, sendError } from "./error_handling";

export function enforceTeacher<T>(
	innerFn?: GetServerSideProps
): GetServerSideProps {
	return enforceAuthentication(async (context: GetServerSidePropsContext) => {
		const session = await getServerSession(
			context.req,
			context.res,
			authOptions
		);
		if (session!.role !== "Teacher")
			return sendError("You are not a teacher");
			return innerFn ? innerFn(context) : { props: {} };
		});
}

export function enforceAdmin<T>(
	innerFn?: GetServerSideProps
): GetServerSideProps {
	return enforceAuthentication(async (context: GetServerSidePropsContext) => {
		const session = await getServerSession(
			context.req,
			context.res,
			authOptions
		);
		if (!session!.admin) return sendError("You are not an admin");
		return innerFn ? innerFn(context) : { props: {} };
	});
}

export function enforceAuthentication<T>(
	innerFn?: GetServerSideProps
): GetServerSideProps {
	return async (context: GetServerSidePropsContext) => {
		const session = await getServerSession(
			context.req,
			context.res,
			authOptions
		);
		if (session === null) return forceLogin();
		return innerFn ? innerFn(context) : { props: {} };
	};
}

