import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, reviewsTable, projectsTable, blogTable, bookingsTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  GetAdminStatsResponse,
  GetAdminMeResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "masterkey2025";
const ADMIN_SESSION_KEY = "admin_authenticated";

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  if (req.session) {
    (req.session as Record<string, unknown>)[ADMIN_SESSION_KEY] = true;
  }
  res.json(AdminLoginResponse.parse({ authenticated: true }));
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  if (req.session) {
    req.session.destroy(() => {
      res.json({ authenticated: false });
    });
    return;
  }
  res.json({ authenticated: false });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const authenticated = req.session && (req.session as Record<string, unknown>)[ADMIN_SESSION_KEY] === true;
  if (!authenticated) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.json(GetAdminMeResponse.parse({ authenticated: true }));
});

router.get("/admin/stats", async (req, res): Promise<void> => {
  const [totalBookings] = await db.select({ count: db.$count(bookingsTable) }).from(bookingsTable);
  const [newBookings] = await db.select({ count: db.$count(bookingsTable) }).from(bookingsTable).where(eq(bookingsTable.status, "new"));
  const [publishedPosts] = await db.select({ count: db.$count(blogTable) }).from(blogTable).where(eq(blogTable.published, true));
  const [pendingReviews] = await db.select({ count: db.$count(reviewsTable) }).from(reviewsTable).where(eq(reviewsTable.approved, false));
  const [totalProjects] = await db.select({ count: db.$count(projectsTable) }).from(projectsTable);
  const [totalReviews] = await db.select({ count: db.$count(reviewsTable) }).from(reviewsTable);

  res.json(GetAdminStatsResponse.parse({
    totalBookings: Number(totalBookings?.count ?? 0),
    newBookings: Number(newBookings?.count ?? 0),
    publishedPosts: Number(publishedPosts?.count ?? 0),
    pendingReviews: Number(pendingReviews?.count ?? 0),
    totalProjects: Number(totalProjects?.count ?? 0),
    totalReviews: Number(totalReviews?.count ?? 0),
  }));
});

export default router;
