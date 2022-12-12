import { useControls, Leva, folder } from "leva";
import { Camera } from "oasis-engine";

export function CameraInspector(props: { camera: Camera }) {
  const { camera } = props;
  useControls({
    isOrtho: {
      value: camera.isOrthographic,
      onChange(v) {
        camera.isOrthographic = v;
      },
    },
    fieldOfView: {
      value: camera.fieldOfView,
      min: 0,
      max: 180,
      step: 1,
      onChange: (v) => {
        camera.fieldOfView = v;
      },
      render: (get) => get("isOrtho") === false,
    },
    orthoSize: {
      value: camera.orthographicSize,
      onChange(v) {
        camera.orthographicSize = v;
      },
      render: (get) => get("isOrtho") === true,
    },
    near: {
      value: camera.nearClipPlane,
      step: 0.25,
      onChange: (v) => {
        camera.nearClipPlane = v;
      },
    },
    far: {
      value: camera.farClipPlane,
      step: 0.25,
      onChange: (v) => {
        camera.farClipPlane = v;
      },
    },
  });
  return (
    <Leva
      titleBar={{
        title: "Camera",
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
