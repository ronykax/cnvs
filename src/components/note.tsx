import type Konva from "konva";
import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { useCallback, useRef } from "react";
import { Group, Rect, Text } from "react-konva";
import { useNoteStore } from "@/stores/note";

const NOTE_WIDTH = 400;
const NOTE_HEIGHT = 400;
const NOTE_PADDING = 16;

export function Note({ color, id }: { color: string; id: string }) {
  const { selectedNote, setSelectedNote } = useNoteStore();

  const groupRef = useRef<Konva.Group | null>(null);

  const moveToTop = useCallback(
    (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
      e.currentTarget.moveToTop();
      if (selectedNote !== e.currentTarget) {
        setSelectedNote(null);
      }
    },
    [setSelectedNote, selectedNote]
  );

  const handleDoubleTapOrClick = useCallback(() => {
    if (selectedNote === groupRef.current) {
      setSelectedNote(null);
    } else {
      setSelectedNote(groupRef.current);
    }
  }, [setSelectedNote, selectedNote]);

  const isSelected = selectedNote !== null && groupRef.current === selectedNote;

  return (
    <Group
      draggable
      name={id}
      onClick={moveToTop}
      onDblClick={handleDoubleTapOrClick}
      onDblTap={handleDoubleTapOrClick}
      onDragStart={moveToTop}
      ref={groupRef}
      x={90}
      y={90}
    >
      <Rect
        fill={color}
        height={NOTE_WIDTH}
        shadowBlur={5}
        shadowColor="rgba(0,0,0,0.25)"
        shadowOffsetY={0}
        stroke={isSelected ? "rgba(255,40,0,0.5)" : "rgba(0,0,0,0.25)"}
        strokeWidth={isSelected ? 4 : 1}
        width={NOTE_HEIGHT}
      />
      <Text
        fontFamily="Nanum Pen Script, Nanum Pen Script Fallback"
        fontSize={20}
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        width={NOTE_WIDTH - NOTE_PADDING * 2}
        x={NOTE_PADDING}
        y={NOTE_PADDING}
      />
    </Group>
  );
}
