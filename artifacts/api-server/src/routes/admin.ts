import { Router, type IRouter } from "express";
import { eq, gt, and } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db, reviewsTable, projectsTable, blogTable, bookingsTable, adminSettingsTable, passwordResetTokensTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  GetAdminStatsResponse,
  GetAdminMeResponse,
} from "@workspace/api-zod";
import { sendPasswordResetEmail } from "../lib/mailer.js";

const router: IRouter = Router();

const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "masterkey2025";
const ADMIN_SESSION_KEY = "admin_authenticated";

async function getAdminPassword(): Promise<string> {
  const row = await db
    .select()
    .from(adminSettingsTable)
    .where(eq(adminSettingsTable.key, "admin_password"))
    .limit(1);
  return row[0]?.value ?? ENV_ADMIN_PASSWORD;
}

function getBaseUrl(req: Parameters<typeof router.post>[1] extends (req: infer R, ...a: unknown[]) => unknown ? R : never): string {
  const domains = process.env.REPLIT_DOMAINS?.split(",");
  if (domains && domains[0]) return `https://${domains[0]}`;
  return `${req.protocol}://${req.get("host")}`;
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const currentPassword = await getAdminPassword();
  if (parsed.data.password !== currentPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  if (req.session) {
    (req.session as unknown as Record<string, unknown>)[ADMIN_SESSION_KEY] = true;
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
  const authenticated = req.session && (req.session as unknown as Record<string, unknown>)[ADMIN_SESSION_KEY] === true;
  if (!authenticated) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.json(GetAdminMeResponse.parse({ authenticated: true }));
});

router.post("/admin/forgot-password", async (req, res): Promise<void> => {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await db.delete(passwordResetTokensTable);
  await db.insert(passwordResetTokensTable).values({ token, expiresAt, used: false });

  const baseUrl = getBaseUrl(req as Parameters<typeof router.post>[1] extends (req: infer R, ...a: unknown[]) => unknown ? R : never);
  const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;

  try {
    await sendPasswordResetEmail(resetUrl);
    res.json({ message: "Reset link sent to the admin email address." });
  } catch {
    req.log.error("Failed to send password reset email");
    res.status(503).json({ error: "Failed to send email. Check email configuration." });
  }
});

router.post("/admin/reset-password", async (req, res): Promise<void> => {
  const { token, newPassword } = req.body as { token?: string; newPassword?: string };
  if (!token || !newPassword || newPassword.length < 8) {
    res.status(400).json({ error: "Token and a password of at least 8 characters are required." });
    return;
  }

  const now = new Date();
  const rows = await db
    .select()
    .from(passwordResetTokensTable)
    .where(and(eq(passwordResetTokensTable.token, token), eq(passwordResetTokensTable.used, false), gt(passwordResetTokensTable.expiresAt, now)))
    .limit(1);

  if (rows.length === 0) {
    res.status(400).json({ error: "Invalid or expired reset token. Please request a new link." });
    return;
  }

  await db
    .update(passwordResetTokensTable)
    .set({ used: true })
    .where(eq(passwordResetTokensTable.token, token));

  await db
    .insert(adminSettingsTable)
    .values({ key: "admin_password", value: newPassword, updatedAt: new Date() })
    .onConflictDoUpdate({ target: adminSettingsTable.key, set: { value: newPassword, updatedAt: new Date() } });

  res.json({ message: "Password updated successfully." });
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
