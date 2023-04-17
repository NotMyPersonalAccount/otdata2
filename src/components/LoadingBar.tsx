import "nprogress/nprogress.css";
import { useEffect } from "react";
import nProgress from "nprogress";
import { useRouter } from "next/router";

nProgress.configure({
	showSpinner: false
});

export default function LoadingBar() {
	const router = useRouter();
	useEffect(() => {
		const handleStart = () => nProgress.start();
		const handleDone = () => nProgress.done();
		router.events.on("routeChangeStart", handleStart);
		router.events.on("routeChangeComplete", handleDone);
		router.events.on("routeChangeError", handleDone);

		return () => {
			router.events.off("routeChangeStart", handleStart);
			router.events.off("routeChangeComplete", handleDone);
			router.events.off("routeChangeError", handleDone);
		};
	}, [router]);
	return null;
}

