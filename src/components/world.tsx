"use client";

import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import { useEffect, useRef, useState } from "react";
import type { Camera } from "@/types";
import { Note } from "./note";

const INITIAL_CAMERA: Camera = { scale: 1, x: 0, y: 0 };

export function World() {
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

  return (
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
        <Note camera={camera} color="blue" />
        <Note camera={camera} color="pink" />
        <Note camera={camera} color="yellow" />
        <Note camera={camera} color="orange" />
        <Note camera={camera} color="purple" />
        <Note camera={camera} color="green" />
      </div>
    </div>
  );
}
