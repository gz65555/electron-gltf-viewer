import { jsonViewerStore } from "@/store/JSONViewerStore";
import { rootStore } from "@/store/RootStore";
import * as oasisEngine from "@galacean/engine";
import {
  BackgroundMode,
  Color,
  BackgroundTextureFillMode,
} from "@galacean/engine";
import { useEffect } from "react";
import { ListApi, Pane } from "tweakpane";
import { JSONViewerModal } from "../JSONViewerModal";
import * as TexturePlugin from "./texture2d";
import { toJS } from "mobx";

export function SceneInspector(props: { scene: oasisEngine.Scene }) {
  const { scene } = props;

  useEffect(() => {
    const pane = new Pane();
    pane.title = "Scene";

    pane.registerPlugin(TexturePlugin);

    const backgroundFolder = pane.addFolder({
      title: "background",
      expanded: false,
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

    const options = toJS(
      rootStore.hdrSelection.map((v) => ({
        text: v.label,
        value: v.value,
      }))
    );

    const hdrListApi = backgroundFolder.addBlade({
      view: "list",
      label: "scene",
      options: options,
      value: options[0].value,
    }) as ListApi<any>;

    hdrListApi.on("change", (e) => {
      rootStore.changeHDR(e.value);
      const item = rootStore.hdrSelection.find(
        (item) => item.value === e.value
      );
      (scene.background.sky.material as oasisEngine.SkyBoxMaterial).texture =
        item.rawValue;
    });

    const backgroundTextureInput = backgroundFolder.addBlade({
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
    });

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

    pane.addSeparator();
    const viewGlTFButton = pane.addButton({ title: "View GlTF" });
    viewGlTFButton.on("click", () => {
      jsonViewerStore.openModal();
    });

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

  return <>{/* <JSONViewerModal/> */}</>;
}
