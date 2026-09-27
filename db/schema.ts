import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const inquiries = sqliteTable(
  "inquiries",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("idx_inquiries_created_at").on(table.createdAt),
    index("idx_inquiries_email_created_at").on(table.email, table.createdAt),
  ],
);
