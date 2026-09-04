"use client";

import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createNote, getNotesFromDb } from "@/app/actions";
import type { Camera } from "@/types";
import { useWorldStore } from "@/world-store";
import { Note } from "./note";

const INITIAL_CAMERA: Camera = { scale: 1, x: 0, y: 0 };

function getSavedCamera(): Camera {
  if (typeof window === "undefined") {
    return INITIAL_CAMERA;
  }
  try {
    const saved = localStorage.getItem("camera");
    return saved ? JSON.parse(saved) : INITIAL_CAMERA;
  } catch {
    return INITIAL_CAMERA;
  }
}

export function World() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [camera, setCamera] = useState<Camera>(INITIAL_CAMERA);
  const notes = useWorldStore((state) => state.notes);
  const setNotes = useWorldStore((state) => state.setNotes);

  useEffect(() => {
    getNotesFromDb().then((data) => {
      if (Array.isArray(data)) {
        setNotes(data);
      }
    });
  }, [setNotes]);

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
        const next = { scale: k, x, y };
        setCamera(next);
        localStorage.setItem("camera", JSON.stringify(next));
      });

    selection.call(behavior);

    const initial = getSavedCamera();

    selection.call(
      behavior.transform,
      zoomIdentity.translate(initial.x, initial.y).scale(initial.scale)
    );

    return () => {
      selection.on(".zoom", null);
    };
  }, []);

  const handleNewNote = useCallback(async () => {
    // `_result` here is string (error) or typeof notesTable.$inferSelect
    const _result = await createNote({
      color: "blue",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      x: 10,
      y: 10,
    });
  }, []);

  return (
    <>
      <div
        className="h-screen w-screen cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing"
        // blur
        // onClick={() => console.log("blur")}
        ref={viewportRef}
      >
        <div
          className="relative"
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
            transformOrigin: "0 0",
          }}
        >
          {Object.values(notes).map((note) => (
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
