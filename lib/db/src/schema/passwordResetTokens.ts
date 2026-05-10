import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const passwordResetTokensTable = pgTable("password_reset_tokens", {
  token: text("token").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  used: boolean("used").notNull().default(false),
});
