import prisma from "@/lib/database/prisma";
import dayjs from "dayjs";
import { enforceAuthentication } from "@/utils/enforcement";
import { User } from "@prisma/client";
import { ReactNode } from "react";
import { Page, PageSection } from "@/components/Page";
import { getServerSessionCached } from "@/lib/auth";

type Props = {
	data: string;
};

type ProfileSectionProps = {
	title: string;
	children: ReactNode;
};

type ProfileInfoProps = ProfileSectionProps;

export const getServerSideProps = enforceAuthentication<Props>(async context => {
	const session = await getServerSessionCached(
		context.req,
		context.res
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
		<Page
			pageTitle={`${user.first_name} ${user.last_name} (${user.pronouns})`}
		>
			<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-8">
				<PageSection title="General" padding="sm">
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
					<ProfileInfo title="Birthday">
						{user.birthdate ? dayjs(user.birthdate).format("MMMM D, YYYY") : ""}
					</ProfileInfo>
				</PageSection>
				<PageSection title="Contact" padding="sm">
					<ProfileInfo title="Email">{user.ot_email}</ProfileInfo>
					<ProfileInfo title="Phone Number">
						{user.mobile}
					</ProfileInfo>
				</PageSection>
			</div>
		</Page>
	);
}

