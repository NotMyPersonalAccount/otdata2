import Navbar from "@/components/Navbar";
import "@/styles/globals.scss";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import ImpersonationModal from "@/components/modals/Impersonation";
import ImpersonationBanner from "@/components/ImpersonationBanner";
import LoadingBar from "@/components/LoadingBar";

dayjs.extend(calendar);

export default function App({
	Component,
	pageProps: { session, ...pageProps }
}: AppProps) {
	return (
		<SessionProvider session={session}>
			<LoadingBar />
			<Navbar />
			<ImpersonationBanner />
			<ImpersonationModal />
			{pageProps.error ? pageProps.error : <Component {...pageProps} />}
			<Analytics />
		</SessionProvider>
	);
}

