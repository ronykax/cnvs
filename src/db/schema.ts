import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { Color } from "@/types";

export const notes = sqliteTable("notes", {
  color: text("color").$type<Color>().notNull(),
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  x: real("x").notNull(),
  y: real("y").notNull(),
});
