import type Konva from "konva";
import { FilePlus2Icon, Trash2Icon } from "lucide-react";
import { type RefObject, useCallback } from "react";

export function Buttons({
  showDeleteButton,
  layerRef,
}: {
  stageRef: RefObject<Konva.Stage | null>;
  showDeleteButton: boolean;
  layerRef: RefObject<Konva.Layer | null>;
}) {
  const handleTrash = useCallback(() => {
    if (!layerRef.current) {
      return;
    }

    const notes = layerRef.current.find(".balls");
    notes[0].destroy();
  }, [layerRef]);

  return (
    <div className="fixed right-8 bottom-8 flex items-center gap-2">
      {showDeleteButton ? (
        <button
          className="rounded-full border-2 border-zinc-200 bg-zinc-100 p-4 duration-75 hover:scale-110"
          onClick={handleTrash}
          type="button"
        >
          <Trash2Icon className="size-8 text-red-500" />
        </button>
      ) : null}

      <button
        className="rounded-full border-2 border-zinc-200 bg-zinc-100 p-4 duration-75 hover:scale-110"
        type="button"
      >
        <FilePlus2Icon className="size-8" />
      </button>
    </div>
  );
}
