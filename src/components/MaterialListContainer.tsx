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
  const {
    glTFResource: { materials },
  } = useRootStore();

  const [selectedKey, setSelected] = React.useState(null);
  return (
    <>
      {materials.map((material, index) => (
        <MaterialItem
          selected={selectedKey === index}
          onClick={() => {
            if (selectedKey === index) {
              setSelected(null);
            } else {
              setSelected(index);
            }
          }}
          key={material.instanceId}
          material={material}
        />
      ))}
    </>
  );
});
