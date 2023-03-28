import { getUserByAeriesId } from "@/lib/database/user";
import { enforceAuthentication } from "@/utils/enforcement";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
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
	return {
		props: {
			data: JSON.stringify(await getUserByAeriesId(session!.aeriesid))
		}
	};
});

function ProfileSection({ title, children }: any) {
	return (
		<div className="bg-gray-200 rounded-xl px-8 py-4 w-80">
			<h1 className="text-2xl font-bold">{title}</h1>
			{children}
		</div>
	);
}

function ProfileInfo({ title, children }: any) {
	return (
		<div>
			<span>
				<span className="font-bold">{title}: </span>
				{children}
			</span>
		</div>
	);
}

export default function Profile({ data }: Props) {
	const user: User = JSON.parse(data);
	return (
		<div className="mx-6 my-6">
			<h1 className="text-4xl">
				{user.first_name} {user.last_name} ({user.pronouns})
			</h1>
			<div className="ml-2 my-4">
				<div className="flex flex-wrap gap-4">
					<ProfileSection title="General">
						<ProfileInfo title="Address">
							<span className="ml-2">
								<p>{user.aeries_street}</p>
								<p>
									{user.aeries_city}, {user.aeries_state} {user.aeries_zipcode}
								</p>
							</span>
						</ProfileInfo>
						<ProfileInfo title="Ethnicity">
							{user.user_ethnicity?.join(", ")}
						</ProfileInfo>
					</ProfileSection>
					<ProfileSection title="Contact">
						<ProfileInfo title="Email">{user.ot_email}</ProfileInfo>
						<ProfileInfo title="Phone Number">
							{user.mobile}
						</ProfileInfo>
					</ProfileSection>
				</div>
			</div>
		</div>
	);
}

