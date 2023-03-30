import Navbar from "@/components/Navbar";
import { trpc } from "@/lib/api/trpc";
import "@/styles/globals.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

dayjs.extend(relativeTime);

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session}>
			<Navbar />
			{pageProps.error ? pageProps.error : <Component {...pageProps} />}
		</SessionProvider>
	);
}
