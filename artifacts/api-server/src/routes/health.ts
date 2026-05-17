import { Router } from "express"; // Removed type IRouter
import { HealthCheckResponse } from "@workspace/api-zod";

const router = Router(); // Removed strict : IRouter typing

router.get("/healthz", (_req: any, res: any) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

export default router;

