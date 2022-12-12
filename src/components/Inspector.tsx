import { InspectorType } from "@/store/enum";
import { useRootStore } from "@/store/RootStore";
import { observer } from "mobx-react-lite";
import { Camera, Entity } from "oasis-engine";
import { CameraInspector } from "./leva/Camera";
import { EntityInspector } from "./leva/Entity";
import { SceneInspector } from "./leva/Scene";

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
  return null;
});
