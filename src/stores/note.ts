import type { Node, NodeConfig } from "konva/lib/Node";
import { create } from "zustand";

interface NoteStore {
  selectedNote: Node<NodeConfig> | null;
  setSelectedNote: (note: Node<NodeConfig> | null) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  selectedNote: null,
  setSelectedNote: (selectedNote) => set({ selectedNote }),
}));
