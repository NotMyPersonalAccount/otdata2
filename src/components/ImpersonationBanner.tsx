import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function ImpersonationBanner() {
	const router = useRouter();
	const { data: session, update } = useSession();
	return session &&
		session.originalData?.currUserId !== session.currUserId ? (
		<div className="flex flex-wrap justify-between bg-red-500 text-white text-lg px-4 py-2">
			<p>Viewing as {session.name}</p>
			<button
				className="bg-red-700 px-4 rounded-md"
				onClick={async () => {
					await update(session.originalData);
					router.replace(router.asPath);
				}}
			>
				Exit
			</button>
		</div>
	) : null;
}

