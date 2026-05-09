import nodemailer from "nodemailer";
import { logger } from "./logger";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? GMAIL_USER;

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });
  }
  return transporter;
}

export interface BookingNotificationData {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  serviceType: string;
  preferredDate: string;
  message: string;
  howHeard?: string;
  id: number;
}

export async function sendBookingNotification(booking: BookingNotificationData): Promise<void> {
  const t = getTransporter();
  if (!t) {
    logger.warn("Email not configured — skipping booking notification");
    return;
  }

  const whatsappLink = `https://wa.me/${booking.phone.replace(/\D/g, "").replace(/^0/, "234")}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
  .wrapper { max-width: 600px; margin: 32px auto; background: #fff; border-top: 6px solid #CC0000; }
  .header { background: #0A0A0A; padding: 24px 32px; }
  .header h1 { color: #fff; margin: 0; font-size: 22px; letter-spacing: 1px; }
  .header span { color: #C9A84C; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; }
  .body { padding: 32px; }
  .alert { background: #CC0000; color: #fff; padding: 12px 20px; font-weight: bold; font-size: 15px; margin-bottom: 24px; }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 4px; }
  .field value { display: block; font-size: 15px; color: #0A0A0A; font-weight: 500; }
  .message-box { background: #f9f9f9; border-left: 4px solid #CC0000; padding: 16px; margin: 20px 0; font-size: 14px; color: #333; line-height: 1.6; }
  .actions { margin-top: 28px; }
  .btn { display: inline-block; padding: 12px 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 13px; text-decoration: none; margin-right: 10px; margin-bottom: 10px; }
  .btn-whatsapp { background: #25D366; color: #fff; }
  .btn-email { background: #CC0000; color: #fff; }
  .footer { background: #0A0A0A; padding: 16px 32px; font-size: 12px; color: #666; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <span>Master Key Consulting</span>
    <h1>NEW BOOKING REQUEST</h1>
  </div>
  <div class="body">
    <div class="alert">⚡ New booking #${booking.id} received — respond within 24 hours</div>
    <div class="field"><label>Client Name</label><value>${booking.fullName}</value></div>
    <div class="field"><label>Phone Number</label><value>${booking.phone}</value></div>
    <div class="field"><label>Email Address</label><value>${booking.email}</value></div>
    <div class="field"><label>Project Location</label><value>${booking.location}</value></div>
    <div class="field"><label>Service Required</label><value>${booking.serviceType}</value></div>
    <div class="field"><label>Preferred Start Date</label><value>${booking.preferredDate}</value></div>
    ${booking.howHeard ? `<div class="field"><label>How They Found Us</label><value>${booking.howHeard}</value></div>` : ""}
    <div class="field"><label>Project Description</label></div>
    <div class="message-box">${booking.message.replace(/\n/g, "<br/>")}</div>
    <div class="actions">
      <a class="btn btn-whatsapp" href="${whatsappLink}">💬 Chat on WhatsApp</a>
      <a class="btn btn-email" href="mailto:${booking.email}?subject=Re: Your booking request at Master Key Consulting">📧 Reply by Email</a>
    </div>
  </div>
  <div class="footer">Master Key Consulting · Ilorin, Kwara State, Nigeria · Booking ID #${booking.id}</div>
</div>
</body>
</html>
`;

  const text = `
NEW BOOKING REQUEST — Master Key Consulting
===========================================
Booking ID: #${booking.id}

Client: ${booking.fullName}
Phone: ${booking.phone}
Email: ${booking.email}
Location: ${booking.location}
Service: ${booking.serviceType}
Preferred Date: ${booking.preferredDate}
${booking.howHeard ? `How Found: ${booking.howHeard}\n` : ""}
Description:
${booking.message}

WhatsApp: ${whatsappLink}
Reply to: ${booking.email}
`;

  await t.sendMail({
    from: `"Master Key Consulting" <${GMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `📋 New Booking: ${booking.serviceType} — ${booking.fullName}`,
    text,
    html,
  });

  logger.info({ bookingId: booking.id, to: ADMIN_EMAIL }, "Booking notification email sent");
}
