import { router } from "..";
import { checkinRouter } from "./checkin";

export const appRouter = router({
	checkin: checkinRouter
});

export type AppRouter = typeof appRouter;

