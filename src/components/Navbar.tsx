import hamburgerIcon from "../../public/hamburger.svg";
import classNames from "classnames";
import dayjs from "dayjs";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
	const [toggled, setToggled] = useState(false);
	const { data: session, status } = useSession();

	const [time, setTime] = useState("");
	useEffect(() => {
		function updateTime() {
			setTime(dayjs().format("h:mm:ss"));
		}

		const interval = setInterval(updateTime, 1000);
		updateTime();
		return () => clearInterval(interval);
	}, []);

	return (
		<div
			className={classNames(
				"md:flex justify-between items-center bg-black text-white px-4 py-2 transition-all duration-200 ease-in-out",
				{ "max-h-12": !toggled, "max-h-48": toggled }
			)}
		>
			<div className="flex flex-1 justify-between">
				<Link className="text-2xl" href="/">OTData</Link>
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
						<Link href="/checkin">
							Classes
						</Link>
						<Link href="/profile">{session?.user?.name}</Link>
						<button onClick={() => signOut({ callbackUrl: "/" })}>
							Logout
						</button>
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
				<p>{time}</p>
			</div>
		</div>
	);
}

