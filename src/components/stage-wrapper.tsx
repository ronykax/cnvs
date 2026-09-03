import type Konva from "konva";
import { type RefObject, useCallback } from "react";
import { Layer, Shape, Stage } from "react-konva";
import { Note } from "./note";

const gridSpacing = 50;
const gridRange = 2000;

export function StageWrapper({
  stageRef,
  layerRef,
}: {
  stageRef: RefObject<Konva.Stage | null>;
  layerRef: RefObject<Konva.Layer | null>;
}) {
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;

      if (stage === null) {
        return;
      }

      // 1. Two-finger trackpad panning
      if (!e.evt.ctrlKey) {
        stage.position({
          x: stage.x() - e.evt.deltaX,
          y: stage.y() - e.evt.deltaY,
        });
        return;
      }

      // 2. Pinch to zoom
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition() || {
        x: stage.width() / 2,
        y: stage.height() / 2,
      };

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      // Inverted sign: pinch out zooms out, pinch in zooms in
      const zoomFactor = 1 - e.evt.deltaY * 0.01;
      let newScale = oldScale * zoomFactor;

      // Clamp zoom range
      newScale = Math.max(0.1, Math.min(10, newScale));

      stage.scale({ x: newScale, y: newScale });
      stage.position({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      });
    },
    [stageRef]
  );

  const drawGrid = useCallback((context: Konva.Context, shape: Konva.Shape) => {
    context.beginPath();
    for (let x = -gridRange; x <= gridRange; x += gridSpacing) {
      for (let y = -gridRange; y <= gridRange; y += gridSpacing) {
        // moveTo avoids connecting lines between dots
        context.moveTo(x + 1, y);
        context.arc(x, y, 2, 0, Math.PI * 2);
      }
    }
    context.fillShape(shape);
  }, []);

  return (
    <Stage
      draggable
      height={typeof window === "undefined" ? 0 : window.innerHeight}
      onWheel={handleWheel}
      ref={stageRef}
      width={typeof window === "undefined" ? 0 : window.innerWidth}
    >
      <Layer listening={false}>
        <Shape fill="rgba(0,0,0,0.25)" listening={false} sceneFunc={drawGrid} />
      </Layer>

      <Layer ref={layerRef}>
        <Note color="#FFC9C9" id="wrQZY1" />
        <Note color="#B3F2BB" id="q8LmFx" />
        <Note color="#A5D8FE" id="5uLdNV" />
        <Note color="#FFEC99" id="mWyOWp" />
      </Layer>
    </Stage>
  );
}
