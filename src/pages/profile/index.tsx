import prisma from "@/lib/database/prisma";
import { enforceAuthentication } from "@/utils/enforcement";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { Page, PageSection } from "@/components/Page";

type Props = {
	data: string;
};

type ProfileSectionProps = {
	title: string;
	children: ReactNode;
};

type ProfileInfoProps = ProfileSectionProps;

export const getServerSideProps = enforceAuthentication(async context => {
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions
	);
	return {
		props: {
			data: JSON.stringify(
				await prisma.user.findUnique({
					where: {
						id: session!.currUserId
					}
				})
			)
		}
	};
});

function ProfileSection({ title, children }: ProfileSectionProps) {
	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-2xl font-bold">{title}</h1>
			<div className="bg-gray-200 rounded-xl px-8 py-4 grow">
				{children}
			</div>
		</div>
	);
}

function ProfileInfo({ title, children }: ProfileInfoProps) {
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
		<Page pageTitle={`${user.first_name} ${user.last_name} (${user.pronouns})`}>
			<PageSection transparent={true}>
				<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-8">
					<ProfileSection title="General">
						<ProfileInfo title="Address">
							<span className="ml-2">
								<p>{user.aeries_street}</p>
								<p>
									{user.aeries_city}, {user.aeries_state}{" "}
									{user.aeries_zipcode}
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
			</PageSection>
		</Page>
	);
}

