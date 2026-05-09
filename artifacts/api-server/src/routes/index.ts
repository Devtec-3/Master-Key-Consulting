import { Router, type IRouter } from "express";
import healthRouter from "./health";
import reviewsRouter from "./reviews";
import projectsRouter from "./projects";
import blogRouter from "./blog";
import bookingsRouter from "./bookings";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(reviewsRouter);
router.use(projectsRouter);
router.use(blogRouter);
router.use(bookingsRouter);
router.use(adminRouter);

export default router;
