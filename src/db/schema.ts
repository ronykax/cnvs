import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  age: int().notNull(),
  email: text().notNull().unique(),
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});
