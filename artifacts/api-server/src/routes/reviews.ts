import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";
import {
  CreateReviewBody,
  UpdateReviewParams,
  UpdateReviewBody,
  DeleteReviewParams,
  ListReviewsResponse,
  ListAllReviewsResponse,
  UpdateReviewResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviews", async (req, res): Promise<void> => {
  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.approved, true))
    .orderBy(reviewsTable.createdAt);
  res.json(ListReviewsResponse.parse(reviews.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }))));
});

router.get("/reviews/all", async (req, res): Promise<void> => {
  const reviews = await db
    .select()
    .from(reviewsTable)
    .orderBy(reviewsTable.createdAt);
  res.json(ListAllReviewsResponse.parse(reviews.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }))));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [review] = await db
    .insert(reviewsTable)
    .values({ ...parsed.data, approved: false })
    .returning();
  res.status(201).json({
    ...review,
    createdAt: review.createdAt.toISOString(),
  });
});

router.patch("/reviews/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateReviewParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [review] = await db
    .update(reviewsTable)
    .set(parsed.data)
    .where(eq(reviewsTable.id, params.data.id))
    .returning();
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(UpdateReviewResponse.parse({
    ...review,
    createdAt: review.createdAt.toISOString(),
  }));
});

router.delete("/reviews/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteReviewParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(reviewsTable).where(eq(reviewsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
