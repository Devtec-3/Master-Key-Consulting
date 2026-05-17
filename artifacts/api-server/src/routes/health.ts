import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

// FIX: Added ': any' to _req and res
router.get("/healthz", (_req: any, res: any) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

export default router;
