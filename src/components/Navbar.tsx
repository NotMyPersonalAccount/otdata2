import hamburgerIcon from "../../public/hamburger.svg";
import classNames from "classnames";
import dayjs from "dayjs";
import { useSession, signIn, signOut } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link, { LinkProps } from "next/link";

function NavbarLink(
	props: LinkProps & {
		children: ReactNode;
		roles?: string[];
	}
) {
	const { data: session, status } = useSession();
	if (
		status !== "loading" &&
		props.roles &&
		!props.roles.includes(session!.role)
	)
		return null;
	return (
		<Skeleton>
			<Link className="block" {...props} />
		</Skeleton>
	);
}

function Skeleton({ children }: { children: ReactNode }) {
	const { status } = useSession();
	const [color, setColor] = useState("");
	useEffect(() => {
		setColor(Math.random() < 0.5 ? "bg-gray-700" : "bg-gray-600");
	}, []);
	return status === "loading" ? (
		<div className={classNames(color, "h-2 my-2")}>
			<div className="h-0 overflow-hidden">{children}</div>
		</div>
	) : (
		<>{children}</>
	);
}

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
				"md:flex justify-between items-center bg-black text-white px-4 py-2 transition-all duration-200 ease-in-out overflow-hidden",
				{ "max-h-12": !toggled, "max-h-48": toggled }
			)}
		>
			<div className="flex flex-1 justify-between">
				<Link className="text-2xl" href="/">
					OTData
				</Link>
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
			<div className="my-2 flex flex-col md:flex-row items-start md:items-center md:gap-4 text-lg">
				{status === "unauthenticated" ? (
					<button
						onClick={() =>
							signIn("google", { callbackUrl: "/profile" })
						}
					>
						Login
					</button>
				) : (
					<>
						<NavbarLink href="/myprojects" roles={["Student"]}>
							Projects
						</NavbarLink>
						<NavbarLink href="/findstudent" roles={["Teacher"]}>
							Find
						</NavbarLink>
						<NavbarLink
							href="/checkin"
							roles={["Student", "Teacher"]}
						>
							Classes
						</NavbarLink>
						<NavbarLink href="/profile">
							{session?.name ?? "Hello there, An!"}
						</NavbarLink>
						<Skeleton>
							<button
								onClick={() => signOut({ callbackUrl: "/" })}
							>
								Logout
							</button>
						</Skeleton>
					</>
				)}
				<p className="w-16">{time}</p>
			</div>
		</div>
	);
}

