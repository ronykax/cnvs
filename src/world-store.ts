import { create } from "zustand";
import type { notesTable } from "./db/schema";

type Note = typeof notesTable.$inferSelect;

interface WorldState {
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  notes: Record<string, Note>;
  setNotes: (notes: Note[]) => void;
  updateNote: (id: string, changes: Partial<Note>) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  addNote: (note) =>
    set((state) => ({ notes: { ...state.notes, [note.id]: note } })),
  deleteNote: (id) =>
    set((state) => {
      const { [id]: _, ...notes } = state.notes;
      return { notes };
    }),
  notes: {},
  setNotes: (notes) =>
    set({ notes: Object.fromEntries(notes.map((n) => [n.id, n])) }),
  updateNote: (id, changes) =>
    set((state) => ({
      notes: { ...state.notes, [id]: { ...state.notes[id], ...changes } },
    })),
}));
