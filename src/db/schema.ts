import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import type { Color } from "@/types";

export const notesTable = sqliteTable("notes", {
  color: text("color").$type<Color>().notNull(),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(6)),
  text: text("text").notNull(),
  x: real("x").notNull(),
  y: real("y").notNull(),
});
