import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { User } from "@prisma/client";
import FindStudentForm from "../forms/FindStudentForm";
import { useState } from "react";
import { Page } from "../Page";
import Link from "next/link";

// Fixes Leaflet map icons not showing for Next.js
//
// See here: https://github.com/PaulLeCam/react-leaflet/issues/808
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
	iconUrl: markerIcon.src,
	iconRetinaUrl: markerIcon2x.src,
	shadowUrl: markerShadow.src
});

export default function UserMap() {
	const [users, setUsers] = useState<User[]>([]);

	return (
		<>
			<Page>
				<FindStudentForm onFind={setUsers} />
			</Page>
			<MapContainer
				center={[37.8044, -122.2712]}
				zoom={13}
				scrollWheelZoom={false}
				style={{ height: "100vh" }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{users.map((user, i) => {
					if (user.latitude && user.longitude)
						return (
							<Marker
								key={i}
								position={[user.latitude!, user.longitude!]}
							>
								<Popup>
									<Link
										className="font-bold"
										href={`/profile/${user.aeries_id}`}
									>
										{user.first_name} {user.last_name}
									</Link>{" "}
									({user.grade})
									<br />
									{user.aeries_street}
									<br />
									{user.aeries_city}, {user.aeries_state}{" "}
									{user.aeries_zipcode}
									<br />
									<br />
									{user.cohort}
								</Popup>
							</Marker>
						);
					return null;
				})}
			</MapContainer>
		</>
	);
}

