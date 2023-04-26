import { PillButton } from "@/components/Button";
import CheckinForm from "@/components/forms/CheckinForm";
import { trpc } from "@/lib/api/trpc";
import prisma from "@/lib/database/prisma";
import { enforceAuthentication } from "@/utils/enforcement";
import { sendError } from "@/utils/error_handling";
import { Checkin, GoogleClassroom } from "@prisma/client";
import dayjs from "dayjs";
import { ReactNode, useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { Page, PageSection } from "@/components/Page";
import { getServerSessionCached } from "@/lib/auth";

type Props = {
	data: string;
	lastCheckinData: string;
};

type CheckinValueProps = {
	label: string;
	children: ReactNode;
};

export const getServerSideProps = enforceAuthentication<Props>(async context => {
	const session = await getServerSessionCached(
		context.req,
		context.res,
		authOptions
	);

	const _class = await prisma.googleClassroom.findFirst({
		where: {
			google_classroom_id: context.query.id as string
		}
	});
	if (!_class) return sendError("Class not found");

	const lastCheckinData = await prisma.checkin.findFirst({
		where: {
			classroom_id: _class.id,
			student_id: session!.currUserId
		},
		orderBy: {
			create_date: "desc"
		}
	});

	return {
		props: {
			data: JSON.stringify(_class),
			lastCheckinData: JSON.stringify(lastCheckinData)
		}
	};
});

function CheckinValue({ label, children }: CheckinValueProps) {
	return (
		<p className="break-all">
			<span className="font-bold">{label}: </span>
			{children}
		</p>
	);
}

export default function ClassDash({ data, lastCheckinData }: Props) {
	const _class: GoogleClassroom = JSON.parse(data);
	const [lastCheckin, setLastCheckin] = useState<Checkin>();
	useEffect(() => {
		setLastCheckin(JSON.parse(lastCheckinData));
	}, [lastCheckinData]);
	return (
		<Page pageTitle={_class.class_dict!.name as string}>
			<PageSection title="Checkins">
				<CheckinForm
					classId={_class.google_classroom_id!}
					assignments={_class.coursework_dict?.courseWork ?? []}
					onCreate={setLastCheckin}
				/>
				{lastCheckin && (
					<div>
						<p className="text-2xl font-semibold mt-8 mb-2">
							Last Checkin
						</p>
						<CheckinValue label="Date">
							{dayjs(lastCheckin.create_date).calendar()}
						</CheckinValue>
						<CheckinValue label="Were you productive?">
							{lastCheckin.status}
						</CheckinValue>
						<CheckinValue label="What you did">
							{lastCheckin.description}
						</CheckinValue>
						<CheckinValue label="What you said you would do">
							{lastCheckin.working_on}
						</CheckinValue>
						<PillButton
							className="mt-4"
							variant="destructive"
							onClick={async () => {
								const newLastCheckin =
									await trpc.checkin.delete.mutate({
										id: lastCheckin.id,
										respondWithLast: true
									});
								setLastCheckin(newLastCheckin as Checkin);
							}}
						>
							Delete Last Checkin
						</PillButton>
					</div>
				)}
			</PageSection>
		</Page>
	);
}

