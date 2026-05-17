import { Router } from "express";

const router = Router();

router.get("/healthz", (_req: any, res: any) => {
  // Bypass the strict workspace Zod typing completely
  const data = { status: "ok" };
  res.json(data);
});

export default router;
