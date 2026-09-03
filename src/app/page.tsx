/** biome-ignore-all lint/correctness/useHookAtTopLevel: no */
"use client";

import type Konva from "konva";
import { useRef } from "react";
import { Buttons } from "@/components/buttons";
import { StageWrapper } from "@/components/stage-wrapper";

export default function () {
  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);

  return (
    <>
      <StageWrapper layerRef={layerRef} stageRef={stageRef} />
      <Buttons
        layerRef={layerRef}
        showDeleteButton={true}
        stageRef={stageRef}
      />
    </>
  );
}
