import { Dialog } from "@base-ui/react";
import { cn } from "cn";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { CheckIcon, XIcon } from "lucide-react";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { updateNoteInDb } from "@/app/actions";
import type { notesTable } from "@/db/schema";
import type { Camera, Color } from "@/types";
import { useWorldStore } from "@/world-store";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [text, setText] = useState(note.text);

  const elementRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef(camera);
  cameraRef.current = camera;

  useEffect(() => {
    const node = elementRef.current;
    if (node === null) {
      return;
    }

    const behavior = drag<HTMLDivElement, unknown>()
      .on("start", (event) => {
        event.sourceEvent.stopPropagation();
        node.style.cursor = "grabbing";
      })
      .on("drag", (event) => {
        select(node).raise();
        const current = useWorldStore.getState().notes[note.id];
        useWorldStore.getState().updateNote(note.id, {
          x: current.x + event.dx / cameraRef.current.scale,
          y: current.y + event.dy / cameraRef.current.scale,
        });
      })
      .on("end", () => {
        node.style.cursor = "";
        const current = useWorldStore.getState().notes[note.id];
        updateNoteInDb(note.id, { x: current.x, y: current.y });
      });

    select(node).call(behavior);

    return () => {
      select(node).on(".drag", null);
    };
  }, [note.id]);

  const handleTextChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) =>
      setText(e.currentTarget.value),
    []
  );

  useHotkeys("mod+enter", () => handleSave(), {
    enableOnFormTags: ["textarea"],
  });

  const handleSave = useCallback(() => {
    setIsEditDialogOpen(false);
    useWorldStore.getState().updateNote(note.id, { text });
    updateNoteInDb(note.id, { text });
  }, [note.id, text]);

  return (
    <Dialog.Root onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
      <Dialog.Trigger
        nativeButton={false}
        render={
          <div
            className={cn(
              "absolute flex w-sm cursor-grab flex-col gap-2 overflow-hidden rounded-sm p-4 font-medium shadow-md",
              COLORS[note.color]
            )}
            ref={elementRef}
            style={{ left: note.x, top: note.y }}
          >
            <Markdown
              components={{
                a: ({ children, href }) => (
                  <a
                    className="underline"
                    href={href}
                    rel="noopener"
                    target="_blank"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="font-serif italic">
                    {children}
                  </blockquote>
                ),
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
          </div>
        }
      />

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/7.5 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-xs -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm bg-white p-4 shadow-md md:w-sm">
          <div className="flex flex-col gap-1">
            <Dialog.Title className="font-bold">
              January 20, 2008 at 7:39 PM
            </Dialog.Title>
            <Dialog.Description className="font-medium text-sm opacity-80">
              Use{" "}
              <span className="rounded-sm bg-black/7.5 px-1 font-mono font-semibold tracking-tight">
                cmd + return
              </span>{" "}
              to save.
            </Dialog.Description>
          </div>

          <textarea
            className={cn(
              "mt-4 block min-h-96 w-full resize-none rounded-sm p-4 font-mono font-semibold tracking-tighter focus:outline-none",
              COLORS[note.color]
            )}
            onChange={handleTextChange}
            value={text}
          />

          <div className="mt-4 flex gap-4">
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
                  onClick={handleSave}
                  type="button"
                />
              }
            >
              <CheckIcon className="size-4" />
              Save
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
