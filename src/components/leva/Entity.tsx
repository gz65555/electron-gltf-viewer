import { useControls, Leva, folder } from "leva";
import { Entity } from "oasis-engine";
import React from "react";

export function EntityInspector(props: { entity: Entity }) {
  const { entity } = props;
  const {
    transform: { position, rotation, scale },
  } = entity;
  useControls({
    // @ts-ignore
    position: {
      x: position.x,
      y: position.y,
      z: position.z,
      onChange: (v) => {},
    },
    // @ts-ignore
    rotation: {
      x: rotation.x,
      y: rotation.y,
      z: rotation.z,
      onChange: (v) => {
        console.log(v.x);
      },
    },
    // @ts-ignore
    scale: { x: scale.x, y: scale.y, z: scale.z, onChange: (v) => {} },
  });
  return (
    <Leva
      titleBar={{
        title: entity.name,
        drag: false,
        position: { x: 0, y: 0 },
        filter: false,
      }}
      hidden={false}
      flat={false}
      fill={false}
      hideCopyButton={true}
    ></Leva>
  );
}
