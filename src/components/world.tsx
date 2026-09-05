"use client";

import { select } from "d3-selection";
import { zoom, zoomIdentity, zoomTransform } from "d3-zoom";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createNote } from "@/app/actions";
import type { notesTable } from "@/db/schema";
import type { Camera } from "@/types";
import { useWorldStore } from "@/world-store";
import { Note } from "./note";

const INITIAL_CAMERA: Camera = { scale: 1, x: 0, y: 0 };

export function World({
  initialNotes,
}: {
  initialNotes: (typeof notesTable.$inferSelect)[];
}) {
  useState(() => {
    useWorldStore.getState().setNotes(initialNotes);
  });

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [camera, setCamera] = useState<Camera>(INITIAL_CAMERA);
  const notes = useWorldStore((state) => state.notes);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport === null) {
      return;
    }

    const selection = select(viewport);

    const behavior = zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.1, 10])
      .filter((event) => {
        switch (event.type) {
          case "mousedown":
            return false;
          case "touchstart":
            return event.touches.length >= 2;
          case "wheel":
            return event.ctrlKey;
          default:
            return true;
        }
      })
      .on("zoom", (event) => {
        const { x, y, k } = event.transform;
        const next = { scale: k, x, y };
        setCamera(next);
      });

    selection.call(behavior);

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        return;
      }
      event.preventDefault();
      const { k } = zoomTransform(viewport);
      behavior.translateBy(selection, -event.deltaX / k, -event.deltaY / k);
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });

    selection.call(
      behavior.transform,
      zoomIdentity
        .translate(INITIAL_CAMERA.x, INITIAL_CAMERA.y)
        .scale(INITIAL_CAMERA.scale)
    );

    return () => {
      viewport.removeEventListener("wheel", handleWheel);
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
        className="relative h-screen w-screen cursor-default touch-none select-none overflow-hidden"
        // blur
        // onClick={() => console.log("blur")}
        ref={viewportRef}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <defs>
            <pattern
              height={32 * camera.scale}
              id="dots"
              patternUnits="userSpaceOnUse"
              width={32 * camera.scale}
              x={camera.x}
              y={camera.y}
            >
              <circle
                cx={(32 * camera.scale) / 2}
                cy={(32 * camera.scale) / 2}
                fill="rgba(0,0,0,0.35)"
                r={Math.max(0.5, 1.5 * camera.scale)}
              />
            </pattern>
          </defs>
          <rect fill="url(#dots)" height="100%" width="100%" />
        </svg>

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

      <div className="fixed bottom-0 left-0 flex items-center gap-2 rounded-tr-sm bg-zinc-100 px-4 py-2 font-mono text-xs">
        <span>{camera.scale.toFixed(3)}</span>
        <div className="h-2.5 w-px bg-black" />
        <span>{camera.x.toFixed(3)}</span>
        <span>{camera.y.toFixed(3)}</span>
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
