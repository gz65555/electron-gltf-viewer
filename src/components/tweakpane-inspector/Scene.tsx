import { useControls, Leva, folder } from "leva";
import { Scene } from "oasis-engine";

export function SceneInspector(props: { scene: Scene }) {
  useControls({
    environment: {
      value: "None",
      options: ["None", "Basic", "CountrySide"],
    },
    showEnv: {
      value: false,
    },
    ambientColor: {
      value: {
        r: 248,
        g: 214,
        b: 40,
      },
    },
    ambientIntensity: {
      value: 1,
      min: 0,
      max: 10,
    },
    specularIntensity: {
      value: 1,
      min: 0,
      max: 10,
    },
  });
  return (
    <Leva
      titleBar={{
        title: "Scene",
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
