import { getNotesFromDb } from "@/app/actions";
import { World } from "@/components/world";

export default async function () {
  const initialNotes = await getNotesFromDb();
  return <World initialNotes={initialNotes} />;
}
