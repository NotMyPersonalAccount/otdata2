import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/usermap/UserMap"), {
	ssr: false
});

export default function UserMap() {
	return <Map />;
}

