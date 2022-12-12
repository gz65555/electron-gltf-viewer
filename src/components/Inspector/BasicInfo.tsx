import { PanelItemContainer } from "../Panel/PanelItemContainer";
import { PanelItemLabel } from "../Panel/PanelItemLabel";
import { validateBytes } from "gltf-validator";
import { useRootStore } from "@/store/RootStore";
import { useState } from "react";

export function BasicInfo() {
  const {
    glTFData: { info },
  } = useRootStore();
  return (
    <>
      <PanelItemContainer>
        <PanelItemLabel>{"drawcall"}</PanelItemLabel>
        <PanelItemLabel css={{ maxWidth: 160 }}>
          {info.drawCallCount}
        </PanelItemLabel>
      </PanelItemContainer>
      <PanelItemContainer>
        <PanelItemLabel>{"triangles"}</PanelItemLabel>
        <PanelItemLabel css={{ maxWidth: 160 }}>
          {info.totalTriangleCount}
        </PanelItemLabel>
      </PanelItemContainer>
      <PanelItemContainer>
        <PanelItemLabel css={{ maxWidth: 160 }}>
          {"vertices"}
        </PanelItemLabel>
        <PanelItemLabel css={{ maxWidth: 160 }}>
          {info.totalVertexCount}
        </PanelItemLabel>
      </PanelItemContainer>
    </>
  );
}
