import { enforceTeacher } from "@/utils/enforcement";
import Profile from "@/pages/profile";
import { getUserByAeriesId } from "@/lib/database/user";

export const getServerSideProps = enforceTeacher(async context => {
	return {
		props: {
			data: await getUserByAeriesId(parseInt(context.query.id as string))
		}
	};
});

export default Profile;

