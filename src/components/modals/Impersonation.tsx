import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import FindStudentForm from "../forms/FindStudentForm";
import { User } from "@prisma/client";
import { useRouter } from "next/router";

export default function ImpersonationModal() {
	const router = useRouter();
	const { data: session, update } = useSession();
	const [users, setUsers] = useState<User[]>([]);
	const [open, setOpen] = useState(false);
	useEffect(() => {
		if (session?.admin || session?.originalData) {
			const listener = (e: KeyboardEvent) => {
				if (e.ctrlKey && e.key === "i") {
					setOpen(true);
				}
			};
			window.addEventListener("keydown", listener);
			return () => window.removeEventListener("keydown", listener);
		}
		setOpen(false);
	}, [session]);

	return (
		<Modal isOpen={open} onRequestClose={() => setOpen(false)}>
			<FindStudentForm onFind={setUsers} />
			<div className="mt-8 text-lg">
				{users.map(user => (
					<div
						key={user.id}
						className="cursor-pointer"
						onClick={async () => {
							await update({
								admin: user.is_admin,
								role: user.role!,
								currUserId: user.id,
								aeriesId: user.aeries_id!,
								name: `${user.first_name} ${user.last_name}`
							});
							await router.replace(router.asPath);
							setOpen(false);
						}}
					>
						{user.first_name} {user.last_name} ({user.ot_email})
					</div>
				))}
			</div>
		</Modal>
	);
}

