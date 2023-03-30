import { enforceTeacher } from "@/utils/enforcement";
import Profile from "@/pages/profile";
import { getUserByAeriesId } from "@/lib/database/user";
import { sendError } from "@/utils/error_handling";

export const getServerSideProps = enforceTeacher(async context => {
	const user = await getUserByAeriesId(parseInt(context.query.id as string));
	if (!user) return sendError("User not found");

	return {
		props: {
			data: JSON.stringify(user)
		}
	};
});

export default Profile;

