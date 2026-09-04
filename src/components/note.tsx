import { Dialog } from "@base-ui/react";
import { cn } from "cn";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { CheckIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { notesTable } from "@/db/schema";
import type { Camera, Color } from "@/types";

const COLORS: Record<Color, string> = {
  blue: "bg-pastel-blue",
  green: "bg-pastel-green",
  orange: "bg-pastel-orange",
  pink: "bg-pastel-pink",
  purple: "bg-pastel-purple",
  red: "bg-pastel-red",
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
    <Dialog.Root>
      <Dialog.Trigger
        nativeButton={false}
        render={
          <div
            className={cn(
              "group absolute flex w-sm flex-col gap-2 overflow-hidden rounded-sm p-4 font-medium shadow-md",
              COLORS[note.color]
            )}
            ref={noteRef}
            style={{ left: notePos.x, top: notePos.y }}
          />
        }
      >
        <Markdown
          components={{
            h1: ({ children }) => (
              <h1 className="font-bold text-2xl">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-bold text-xl">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-bold text-lg">{children}</h3>
            ),
            input: ({ checked, type }) => (
              <input
                checked={checked}
                className={type === "checkbox" ? "mr-1" : ""}
                readOnly
                type={type}
              />
            ),
            li: ({ children, className }) => {
              const isTask = className?.includes("task-list-item");
              return (
                <li className={className}>
                  {!isTask && <strong className="mr-1.25 ml-0.5">•</strong>}{" "}
                  {children}
                </li>
              );
            },
            ul: ({ children }) => <ul>{children}</ul>,
          }}
          remarkPlugins={[remarkGfm]}
        >
          {note.text}
        </Markdown>

        <a className="absolute right-0 bottom-0 size-5" href="/">
          <svg
            aria-label="edit note"
            className="size-full"
            fill="none"
            height="1"
            viewBox="0 0 1 1"
            width="1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 1L0.5 0.5L1 0V1H0Z" fill="rgba(0,0,0,0.25)" />
          </svg>
        </a>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/10 backdrop-blur-sm" />
        <Dialog.Popup
          className={cn(
            "fixed top-1/2 left-1/2 w-sm -translate-x-1/2 -translate-y-1/2 rounded-sm p-4 shadow-md",
            COLORS[note.color]
          )}
        >
          <div className="flex flex-col gap-1">
            <Dialog.Title className="font-semibold text-2xl">
              Edit note
            </Dialog.Title>
            <Dialog.Description className="font-medium opacity-80">
              January 20, 2008 at 7:39 PM
            </Dialog.Description>

            <textarea
              className="mt-4 min-h-96 rounded-sm bg-black/10 p-4 font-medium"
              defaultValue={note.text}
            />

            <div className="mt-4 flex gap-2">
              <Dialog.Close
                render={
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-sm bg-red-400 px-3 py-2 font-medium shadow-sm"
                    type="button"
                  />
                }
              >
                <XIcon className="size-4" />
                Cancel
              </Dialog.Close>
              <Dialog.Close
                render={
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-sm bg-green-400 px-3 py-2 font-medium shadow-sm"
                    type="button"
                  />
                }
              >
                <CheckIcon className="size-4" />
                Save
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
