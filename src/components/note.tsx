import { cn } from "cn";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { useEffect, useRef, useState } from "react";
import type { Camera } from "@/types";

const COLORS: Record<string, string> = {
  blue: "bg-pastel-blue",
  green: "bg-pastel-green",
  orange: "bg-pastel-orange",
  pink: "bg-pastel-pink",
  purple: "bg-pastel-purple",
  yellow: "bg-pastel-yellow",
};

export function Note({ camera, color }: { camera: Camera; color: string }) {
  const [note, setNote] = useState({ x: 100, y: 100 });
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
        setNote((yesNote) => ({
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
        "absolute w-sm rounded-sm bg-pastel-green p-4 font-medium shadow-md",
        COLORS[color]
      )}
      ref={noteRef}
      style={{ left: note.x, top: note.y }}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </div>
  );
}
