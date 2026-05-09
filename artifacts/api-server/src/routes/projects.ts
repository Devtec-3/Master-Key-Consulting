import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import {
  CreateProjectBody,
  ListProjectsQueryParams,
  GetProjectParams,
  UpdateProjectParams,
  UpdateProjectBody,
  DeleteProjectParams,
  ListProjectsResponse,
  ListFeaturedProjectsResponse,
  GetProjectResponse,
  UpdateProjectResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/projects", async (req, res): Promise<void> => {
  const query = ListProjectsQueryParams.safeParse(req.query);
  let rows;
  if (query.success && query.data.serviceType) {
    rows = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.serviceType, query.data.serviceType))
      .orderBy(projectsTable.createdAt);
  } else {
    rows = await db.select().from(projectsTable).orderBy(projectsTable.createdAt);
  }
  res.json(ListProjectsResponse.parse(rows.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }))));
});

router.get("/projects/featured", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.featured, true))
    .orderBy(projectsTable.createdAt);
  res.json(ListFeaturedProjectsResponse.parse(rows.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }))));
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProjectParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, params.data.id));
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(GetProjectResponse.parse({
    ...project,
    createdAt: project.createdAt.toISOString(),
  }));
});

router.post("/projects", async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db.insert(projectsTable).values(parsed.data).returning();
  res.status(201).json({
    ...project,
    createdAt: project.createdAt.toISOString(),
  });
});

router.patch("/projects/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateProjectParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db
    .update(projectsTable)
    .set(parsed.data)
    .where(eq(projectsTable.id, params.data.id))
    .returning();
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(UpdateProjectResponse.parse({
    ...project,
    createdAt: project.createdAt.toISOString(),
  }));
});

router.delete("/projects/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteProjectParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(projectsTable).where(eq(projectsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
