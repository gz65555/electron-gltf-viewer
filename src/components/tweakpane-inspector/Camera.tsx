import { Camera } from "oasis-engine";
import { useEffect } from "react";
import { Pane } from "tweakpane";

export function CameraInspector(props: { camera: Camera }) {
  const { camera } = props;

  useEffect(() => {
    const pane = new Pane();
    pane.title = "Camera";
    pane.addInput(camera, "isOrthographic", { label: "isOrtho" });
    pane.addInput(camera, "nearClipPlane", {
      label: "near",
      min: 0.1,
      step: 0.25,
    });
    pane.addInput(camera, "farClipPlane", { label: "far", step: 0.25 });
    const fovInput = pane.addInput(camera, "fieldOfView", {
      min: 0.1,
      max: 180,
      step: 1,
      label: "fov",
    });
    const orthoSizeInput = pane.addInput(camera, "orthographicSize", {
      label: "orthoSize",
    });

    fovInput.hidden = camera.isOrthographic;
    orthoSizeInput.hidden = !camera.isOrthographic;

    pane.on("change", () => {
      fovInput.hidden = camera.isOrthographic;
      orthoSizeInput.hidden = !camera.isOrthographic;
    });
    return () => {
      pane.dispose();
    };
  }, []);

  return <></>;
}
