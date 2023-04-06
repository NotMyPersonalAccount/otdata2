import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import ImpersonationModal from "@/components/modals/Impersonation";
import ImpersonationBanner from "@/components/ImpersonationBanner";

dayjs.extend(relativeTime);

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session}>
			<Navbar />
			<ImpersonationBanner/>
			<ImpersonationModal />
			{pageProps.error ? pageProps.error : <Component {...pageProps} />}
		</SessionProvider>
	);
}
