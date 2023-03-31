import { router } from "..";
import { checkinRouter } from "./checkin";
import { userRouter } from "./user";

export const appRouter = router({
	checkin: checkinRouter,
	user: userRouter
});

export type AppRouter = typeof appRouter;

