"use server";

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
