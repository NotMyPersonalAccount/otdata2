import Button from "@/components/Button";
import CheckinForm from "@/components/forms/CheckinForm";
import { trpc } from "@/lib/api/trpc";
import { getClassroomByGoogleId } from "@/lib/database/class";
import { enforceAuthentication } from "@/utils/enforcement";
import { sendError } from "@/utils/error_handling";
import { Checkin, GoogleClassroom, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { ReactNode, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";

type Props = {
	data: string;
};

type CheckinValueProps = {
	label: string;
	children: ReactNode;
};

export const getServerSideProps = enforceAuthentication(async context => {
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions
	);
	const _class = await getClassroomByGoogleId(context.query.id as string, {
		include: {
			checkins: {
				where: {
					student_id: session!.currUserId
				},
				orderBy: {
					create_date: "desc"
				},
				take: 1
			}
		}
	});
	if (!_class) return sendError("Class not found");

	return {
		props: {
			data: JSON.stringify(_class)
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

export default function ClassDash({ data }: Props) {
	const _class: GoogleClassroom & {
		checkins: Checkin[];
		class_dict: Prisma.JsonObject;
		coursework_dict: Prisma.JsonObject;
	} = JSON.parse(data);
	const [lastCheckin, setLastCheckin] = useState(_class?.checkins?.[0]);
	const { mutateAsync: deleteCheckin } = trpc.checkin.delete.useMutation();
	return (
		<div className="p-4 sm:px-12">
			<h1 className="text-4xl font-bold mb-4">
				{_class.class_dict!.name as string}
			</h1>
			<div className="bg-gray-200 px-4 lg:px-12 py-8 rounded-xl">
				<CheckinForm
					classId={_class.google_classroom_id!}
					assignments={
						_class.coursework_dict!.courseWork as {
							[key: string]: any;
						}[]
					}
					onCreate={setLastCheckin}
				/>
				{lastCheckin && (
					<div>
						<p className="text-2xl font-semibold mt-8 mb-2">
							Last Checkin
						</p>
						<CheckinValue label="Date">
							{dayjs(lastCheckin.create_date).fromNow()}
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
						<Button
							className="mt-4 bg-red-400 hover:bg-red-500"
							onClick={async () => {
								const newLastCheckin = await deleteCheckin({
									id: lastCheckin.id,
									respondWithLast: true
								});
								setLastCheckin(newLastCheckin as Checkin);
							}}
						>
							Delete Last Checkin
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

