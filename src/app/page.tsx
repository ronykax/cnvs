import { World } from "@/components/world";
import { db } from "@/db";
import { notesTable } from "@/db/schema";

export default async function () {
  const notes = await db.select().from(notesTable);

  return <World notes={notes} />;
}
