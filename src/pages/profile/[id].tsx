import { getStudentProfile } from "@/utils/mongoose";
import { enforceTeacher } from "@/utils/enforcement";

export const getServerSideProps = enforceTeacher(async context => {
	return await getStudentProfile(parseInt(context.query.id as string));
});

import Profile from "@/pages/profile";
export default Profile;

