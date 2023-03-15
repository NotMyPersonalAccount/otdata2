import hamburgerIcon from "../../public/hamburger.svg";
import classNames from "classnames";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
	const [toggled, setToggled] = useState(false);
	const { data: session, status } = useSession();

	return (
		<div
			className={classNames(
				"md:flex justify-between items-center bg-black text-white px-4 py-2 transition-all duration-200 ease-in-out",
				{ "max-h-12": !toggled, "max-h-48": toggled }
			)}
		>
			<div className="flex flex-1 justify-between">
				<span className="text-2xl">OTData</span>
				<button
					className="md:hidden"
					onClick={() => setToggled(!toggled)}
				>
					<Image
						src={hamburgerIcon}
						alt="Toggle Menu"
						width={24}
						height={24}
					/>
				</button>
			</div>
			<div className={classNames("my-2 md:flex gap-2")}>
				{status == "authenticated" ? (
					<>
						<span className="block">Classes</span>
						<span className="block">{session?.user?.name}</span>
						<button onClick={() => signOut()}>Logout</button>
					</>
				) : (
					<>
						<button
							onClick={() =>
								signIn("google", { callbackUrl: "/profile" })
							}
						>
							Login
						</button>
					</>
				)}
			</div>
		</div>
	);
}

