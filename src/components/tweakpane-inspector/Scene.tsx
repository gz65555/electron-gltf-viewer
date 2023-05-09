import { rootStore } from "@/store/RootStore";
import * as oasisEngine from "oasis-engine";
import { BackgroundMode, Color, BackgroundTextureFillMode } from "oasis-engine";
import { useEffect } from "react";
import { Pane } from "tweakpane";
import * as TexturePlugin from "./texture2d";

export function SceneInspector(props: { scene: oasisEngine.Scene }) {
  const { scene } = props;

  useEffect(() => {
    const pane = new Pane();
    pane.title = "Scene";

    pane.registerPlugin(TexturePlugin);

    const backgroundFolder = pane.addFolder({
      title: "background",
      expanded: true,
    });

    backgroundFolder.addInput(scene.background, "mode", {
      options: {
        solidColor: BackgroundMode.SolidColor,
        sky: BackgroundMode.Sky,
        texture: BackgroundMode.Texture,
      },
    });

    const backgroundColorInput = backgroundFolder.addInput(
      scene.background,
      "solidColor",
      {
        label: "color",
        defaultValue: new Color(),
        color: { type: "float", alpha: true },
        view: "text",
      }
    );

    const backgroundTextureInput = backgroundFolder.addBlade(
      {
        view: "texture2d",
        engine: scene.engine,
        label: "texture",
        value: scene.background.texture,
        onUploaded(texture) {
          scene.background.texture = texture;
        },
        onPreview(ctx: CanvasRenderingContext2D) {
          rootStore.imagePreviewStore.show(ctx);
        },
      }
    );

    const textureFillModeInput = backgroundFolder.addInput(
      scene.background,
      "textureFillMode",
      {
        options: {
          fitWidth: BackgroundTextureFillMode.AspectFitHeight,
          fitHeight: BackgroundTextureFillMode.AspectFitWidth,
          fill: BackgroundTextureFillMode.Fill,
        },
      }
    );

    function onChangeVisibility() {
      backgroundTextureInput.hidden = !(
        scene.background.mode === BackgroundMode.Texture
      );
      textureFillModeInput.hidden = !(
        scene.background.mode === BackgroundMode.Texture
      );

      backgroundColorInput.hidden = !(
        scene.background.mode === BackgroundMode.SolidColor
      );
    }

    pane.on("change", () => {
      onChangeVisibility();
    });

    onChangeVisibility();

    return () => {
      pane.dispose();
    };
  }, []);

  return <></>;
}
