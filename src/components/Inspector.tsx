import { InspectorType } from "@/store/enum";
import { useRootStore } from "@/store/RootStore";
import { observer } from "mobx-react-lite";
import { BaseMaterial, Camera, Entity } from "oasis-engine";
import { CameraInspector } from "./leva/Camera";
import { EntityInspector } from "./leva/Entity";
import { MaterialInspector } from "./leva/Material";

export const Inspector = observer(function () {
  const {
    inspectorData: { type, data },
  } = useRootStore();
  if (type === InspectorType.Entity) {
    return <EntityInspector entity={data as Entity} />;
  }
  if (type === InspectorType.SceneCamera) {
    return <CameraInspector camera={data as Camera} />;
  }
  if (type === InspectorType.Material) {
    // @ts-ignore
    return <MaterialInspector material={data as BaseMaterial} />;
  }
  return null;
});
