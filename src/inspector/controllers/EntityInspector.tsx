import { useRootStore } from "@/store/RootStore";
import { observer } from "mobx-react-lite";
import { Entity } from "@galacean/engine";
import { Group } from "../components/Group";
import { InputVector3, Vector3Store } from "../components/InputVector3";

export const EntityInspector = observer((props: { item: Entity }) => {
  const { entityStore } = useRootStore();
  return (
    <div>
      <Group title="transform">
        <InputVector3
          label="position"
          item={entityStore.position}
        ></InputVector3>
        <InputVector3
          label="rotation"
          item={entityStore.rotation}
        ></InputVector3>
        <InputVector3 label="scale" item={entityStore.scale}></InputVector3>
      </Group>
    </div>
  );
});
