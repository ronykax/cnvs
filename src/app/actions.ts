"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notesTable } from "@/db/schema";

export async function createNote(note: typeof notesTable.$inferInsert) {
  try {
    const [result] = await db.insert(notesTable).values(note).returning();
    return result;
  } catch {
    return "something went wrong" as string;
  }
}

export async function getNotesFromDb() {
  try {
    return await db.select().from(notesTable);
  } catch {
    return [];
  }
}

export async function updateNoteInDb(
  id: string,
  data: Partial<typeof notesTable.$inferInsert>
) {
  try {
    await db.update(notesTable).set(data).where(eq(notesTable.id, id));
  } catch {
    return "something went wrong" as string;
  }
}
