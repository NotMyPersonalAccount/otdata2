import { UserSchema } from "@/models/User";
import { getStudentProfile } from "@/utils/mongoose";
import { enforceAuthentication } from "@/utils/nextauth";
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
	return await getStudentProfile(session!.aeriesid);
});

function ProfileSection({ title, children }: any) {
	return (
		<div className="bg-gray-200 rounded-xl px-8 py-4 w-80">
			<h1 className="text-2xl font-bold">{title}</h1>
			{children}
		</div>
	);
}

function ProfileInfo({ title, value }: any) {
	return (
		<div>
			<span>
				<span className="font-bold">{title}: </span>
				{value}
			</span>
		</div>
	);
}

export default function Profile({ data }: Props) {
	const user: UserSchema = JSON.parse(data);

	return (
		<div className="mx-6 my-6">
			<h1 className="text-4xl">
				{user.fname} {user.lname} ({user.pronouns})
			</h1>
			<div className="flex flex-wrap gap-4 my-4 ml-2">
				<ProfileSection title="General">
					<ProfileInfo title="Aeries ID" value={user.aeriesid} />
				</ProfileSection>
			</div>
		</div>
	);
}

