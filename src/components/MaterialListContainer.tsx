import { useRootStore } from "@/store/RootStore";
import { observer } from "mobx-react-lite";
import { Material } from "oasis-engine";
import { AssetContainer, AssetName } from "./Panel/AssetContainer";
import { ListItemContainer } from "./Panel/ListItemContainer";

function MaterialItem(props: { material: Material }) {
  return (
    <ListItemContainer>
      <AssetContainer>
        <AssetName>{props.material.name}</AssetName>
      </AssetContainer>
    </ListItemContainer>
  );
}

export const MaterialListContainer = observer(function () {
  const {
    glTFResource: { materials },
  } = useRootStore();
  return (
    <>
      {materials.map((material) => (
        <MaterialItem key={material.instanceId} material={material} />
      ))}
    </>
  );
});
