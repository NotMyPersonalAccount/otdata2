import { router } from "..";
import { checkinRouter } from "./checkin";
import { projectRouter } from "./project";
import { userRouter } from "./user";

export const appRouter = router({
	checkin: checkinRouter,
	project: projectRouter,
	user: userRouter
});

export type AppRouter = typeof appRouter;

