import { PanelItemContainer } from "../Panel/PanelItemContainer";
import { PanelItemLabel } from "../Panel/PanelItemLabel";
import { useRootStore } from "@/store/RootStore";
import { observer } from "mobx-react-lite";

export const BasicInfo = observer(() => {
  const { glTFData, gltfSize } = useRootStore();
  const { info } = glTFData;
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
        <PanelItemLabel css={{ maxWidth: 160 }}>{"vertices"}</PanelItemLabel>
        <PanelItemLabel css={{ maxWidth: 160 }}>
          {info.totalVertexCount}
        </PanelItemLabel>
      </PanelItemContainer>
      <PanelItemContainer>
        <PanelItemLabel css={{ maxWidth: 160 }}>{"size"}</PanelItemLabel>
        <PanelItemLabel css={{ maxWidth: 160 }}>
          {gltfSize.toFixed(2)}
        </PanelItemLabel>
      </PanelItemContainer>
    </>
  );
});
