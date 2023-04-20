import { router } from "..";
import { checkinRouter } from "./checkin";
import { classRouter } from "./class";
import { projectRouter } from "./project";
import { userRouter } from "./user";

export const appRouter = router({
	checkin: checkinRouter,
	class: classRouter,
	project: projectRouter,
	user: userRouter
});

export type AppRouter = typeof appRouter;

