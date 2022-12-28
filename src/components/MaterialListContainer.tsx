import { InspectorType } from "@/store/enum";
import { useRootStore } from "@/store/RootStore";
import { observer } from "mobx-react-lite";
import { Material } from "oasis-engine";
import React from "react";
import { AssetContainer, AssetName } from "./Panel/AssetContainer";
import { ListItemContainer } from "./Panel/ListItemContainer";

function MaterialItem(props: {
  material: Material;
  selected: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) {
  const mtl = props.material;
  return (
    <ListItemContainer onClick={props.onClick}>
      <AssetContainer is-selected={props.selected ? "true" : "false"}>
        <AssetName>{props.material.name}</AssetName>
      </AssetContainer>
    </ListItemContainer>
  );
}

export const MaterialListContainer = observer(function () {
  const root = useRootStore();
  const {
    glTFResource: { materials },
  } = root;

  return (
    <>
      {materials.map((material, index) => (
        <MaterialItem
          selected={index === root.selectedMaterialId}
          onClick={() => {
            root.selectMaterial(index);
          }}
          key={material.instanceId}
          material={material}
        />
      ))}
    </>
  );
});
