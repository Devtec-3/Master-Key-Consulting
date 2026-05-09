import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, bookingsTable } from "@workspace/db";
import {
  CreateBookingBody,
  UpdateBookingParams,
  UpdateBookingBody,
  ListBookingsResponse,
  UpdateBookingResponse,
} from "@workspace/api-zod";
import { sendBookingNotification } from "../lib/mailer";

const router: IRouter = Router();

router.get("/bookings", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(bookingsTable)
    .orderBy(bookingsTable.createdAt);
  res.json(ListBookingsResponse.parse(rows.map(b => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
  }))));
});

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [booking] = await db
    .insert(bookingsTable)
    .values({ ...parsed.data, status: "new" })
    .returning();

  sendBookingNotification({
    id: booking.id,
    fullName: booking.fullName,
    phone: booking.phone,
    email: booking.email,
    location: booking.location,
    serviceType: booking.serviceType,
    preferredDate: booking.preferredDate,
    message: booking.message,
    howHeard: booking.howHeard ?? undefined,
  }).catch((err) => req.log.error({ err }, "Failed to send booking notification email"));

  res.status(201).json({
    ...booking,
    createdAt: booking.createdAt.toISOString(),
  });
});

router.patch("/bookings/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateBookingParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [booking] = await db
    .update(bookingsTable)
    .set(parsed.data)
    .where(eq(bookingsTable.id, params.data.id))
    .returning();
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json(UpdateBookingResponse.parse({
    ...booking,
    createdAt: booking.createdAt.toISOString(),
  }));
});

export default router;
