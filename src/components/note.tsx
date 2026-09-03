import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { useCallback } from "react";
import { Group, Rect, Text } from "react-konva";

const NOTE_WIDTH = 400;
const NOTE_HEIGHT = 400;
const NOTE_PADDING = 16;

export function Note({ color }: { color: string }) {
  const moveToTop = useCallback(
    (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) =>
      e.currentTarget.moveToTop(),
    []
  );

  return (
    <Group
      draggable
      name="balls"
      onClick={moveToTop}
      onDragStart={moveToTop}
      x={90}
      y={90}
    >
      <Rect
        cornerRadius={8}
        fill={color}
        height={NOTE_WIDTH}
        shadowBlur={5}
        shadowColor="rgba(0,0,0,0.25)"
        shadowOffsetY={0}
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
