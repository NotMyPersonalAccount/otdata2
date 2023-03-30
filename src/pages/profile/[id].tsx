import { enforceTeacher } from "@/utils/enforcement";
import Profile from "@/pages/profile";
import { sendError } from "@/utils/error_handling";
import prisma from "@/lib/database/prisma";

export const getServerSideProps = enforceTeacher(async context => {
	const user = await prisma.user.findUnique({
		where: {
			aeries_id: parseInt(context.query.id as string)
		}
	});
	if (!user) return sendError("User not found");

	return {
		props: {
			data: JSON.stringify(user)
		}
	};
});

export default Profile;

