import { useControls, Leva, folder } from "leva";
import { Entity } from "oasis-engine";
import { useEffect } from "react";
import { Pane } from "tweakpane";
export function EntityInspector(props: { entity: Entity }) {
  const { entity } = props;
  const {
    transform: { position, rotation, scale },
  } = entity;

  useEffect(() => {
    const pane = new Pane();
    pane.title = entity.name;
    const params = {
      position: entity.transform.position,
      rotation: entity.transform.rotation,
      scale: entity.transform.scale,
    };
    pane.addInput(params, "position", {});
    pane.addInput(params, "rotation", {});
    pane.addInput(params, "scale", {});

    return () => {
      pane.dispose();
    };
  }, [entity.instanceId]);

  return <></>;
}
