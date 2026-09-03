"use client";

import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createNote } from "@/app/actions";
import type { notesTable } from "@/db/schema";
import type { Camera } from "@/types";
import { Note } from "./note";

const INITIAL_CAMERA: Camera = { scale: 1, x: 0, y: 0 };

export function World({
  notes: notesFromDb,
}: {
  notes: (typeof notesTable.$inferSelect)[];
}) {
  const [notes, setNotes] =
    useState<(typeof notesTable.$inferSelect)[]>(notesFromDb);

  const viewportRef = useRef<HTMLDivElement | null>(null);

  const [camera, setCamera] = useState<Camera>(INITIAL_CAMERA);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport === null) {
      return;
    }

    const selection = select(viewport);

    const behavior = zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.1, 10])
      .on("zoom", (event) => {
        const { x, y, k } = event.transform;
        setCamera({ scale: k, x, y });
      });

    selection.call(behavior);

    selection.call(
      behavior.transform,
      zoomIdentity
        .translate(INITIAL_CAMERA.x, INITIAL_CAMERA.y)
        .scale(INITIAL_CAMERA.scale)
    );

    return () => {
      selection.on(".zoom", null);
    };
  }, []);

  const handleNewNote = useCallback(async () => {
    const result = await createNote({
      color: "blue",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      x: 10,
      y: 10,
    });

    if (typeof result === "string") {
      console.error(result);
    } else {
      setNotes((e) => [...e, result]);
    }
  }, []);

  return (
    <>
      <div
        className="h-screen w-screen cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing"
        ref={viewportRef}
      >
        <div
          className="relative"
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
            transformOrigin: "0 0",
          }}
        >
          {notes.map((note) => (
            <Note camera={camera} key={note.id} note={note} />
          ))}
        </div>
      </div>

      <button
        className="fixed right-6 bottom-6 rounded-full bg-zinc-200 p-4"
        onClick={handleNewNote}
        type="button"
      >
        <PlusIcon className="size-6" />
      </button>
    </>
  );
}
