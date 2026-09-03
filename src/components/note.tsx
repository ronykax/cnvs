import { cn } from "cn";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { useEffect, useRef, useState } from "react";
import type { notesTable } from "@/db/schema";
import type { Camera, Color } from "@/types";

const COLORS: Record<Color, string> = {
  blue: "bg-pastel-blue",
  green: "bg-pastel-green",
  orange: "bg-pastel-orange",
  pink: "bg-pastel-pink",
  purple: "bg-pastel-purple",
  yellow: "bg-pastel-yellow",
};

export function Note({
  camera,
  note,
}: {
  camera: Camera;
  note: typeof notesTable.$inferSelect;
}) {
  const [notePos, setNotePos] = useState({ x: note.x, y: note.y });
  const noteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = noteRef.current;
    if (node === null) {
      return;
    }

    const behavior = drag<HTMLDivElement, unknown>()
      .on("start", (event) => {
        event.sourceEvent.stopPropagation();
      })
      .on("drag", (event) => {
        setNotePos((yesNote) => ({
          x: yesNote.x + event.dx / camera.scale,
          y: yesNote.y + event.dy / camera.scale,
        }));
        select(node).raise();
      });

    select(node).call(behavior);

    return () => {
      select(node).on(".drag", null);
    };
  }, [camera.scale]);

  return (
    <div
      className={cn(
        "absolute w-sm whitespace-pre-wrap rounded-sm bg-pastel-green p-4 font-medium shadow-md",
        COLORS[note.color]
      )}
      ref={noteRef}
      style={{ left: notePos.x, top: notePos.y }}
    >
      {note.text}
    </div>
  );
}
