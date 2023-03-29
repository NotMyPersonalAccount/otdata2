import CheckinForm from "@/components/forms/CheckinForm";
import { getClassroomByGoogleId } from "@/lib/database/class";
import { enforceAuthentication } from "@/utils/enforcement";
import { sendError } from "@/utils/error_handling";
import { Checkin, GoogleClassroom, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";

type Props = {
	data: string;
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

export default function ClassDash({ data }: Props) {
	const _class: GoogleClassroom & {
		checkins: Checkin[];
		class_dict: Prisma.JsonObject;
		coursework_dict: Prisma.JsonObject;
	} = JSON.parse(data);
	const [lastCheckin, setLastCheckin] = useState(_class?.checkins?.[0]);
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
						<p>
							<span className="font-bold">Date: </span>
							{dayjs(lastCheckin.create_date).fromNow()}
						</p>
						<p>
							<span className="font-bold">
								Were you productive?:{" "}
							</span>
							{lastCheckin.status}
						</p>
						<p>
							<span className="font-bold">What you did: </span>
							{lastCheckin.description}
						</p>
						<p>
							<span className="font-bold">
								What you said you would do:{" "}
							</span>
							{lastCheckin.working_on}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

