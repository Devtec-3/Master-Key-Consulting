import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, blogTable } from "@workspace/db";
import {
  CreateBlogPostBody,
  GetBlogPostParams,
  UpdateBlogPostParams,
  UpdateBlogPostBody,
  DeleteBlogPostParams,
  ListBlogPostsResponse,
  ListAllBlogPostsResponse,
  GetBlogPostResponse,
  UpdateBlogPostResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function mapPost(p: typeof blogTable.$inferSelect) {
  return {
    ...p,
    createdAt: p.createdAt.toISOString(),
    tags: p.tags ?? [],
  };
}

router.get("/blog", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(blogTable)
    .where(eq(blogTable.published, true))
    .orderBy(blogTable.createdAt);
  res.json(ListBlogPostsResponse.parse(rows.map(mapPost)));
});

router.get("/blog/all", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(blogTable)
    .orderBy(blogTable.createdAt);
  res.json(ListAllBlogPostsResponse.parse(rows.map(mapPost)));
});

router.get("/blog/:slug", async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const params = GetBlogPostParams.safeParse({ slug: rawSlug });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [post] = await db
    .select()
    .from(blogTable)
    .where(eq(blogTable.slug, params.data.slug));
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(GetBlogPostResponse.parse(mapPost(post)));
});

router.post("/blog", async (req, res): Promise<void> => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const slug = toSlug(parsed.data.title);
  const [post] = await db
    .insert(blogTable)
    .values({
      ...parsed.data,
      slug,
      tags: parsed.data.tags ?? [],
      published: parsed.data.published ?? false,
    })
    .returning();
  res.status(201).json(mapPost(post));
});

router.patch("/blog/:id/update", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateBlogPostParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.title) {
    updateData.slug = toSlug(parsed.data.title);
  }
  const [post] = await db
    .update(blogTable)
    .set(updateData)
    .where(eq(blogTable.id, params.data.id))
    .returning();
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(UpdateBlogPostResponse.parse(mapPost(post)));
});

router.delete("/blog/:id/delete", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteBlogPostParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(blogTable).where(eq(blogTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
