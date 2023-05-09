import {
  Value,
  BladeController,
  ViewProps,
  createBlade,
} from "@tweakpane/core";
import { Texture2D, WebGLEngine } from "oasis-engine";
import { OnUploaded } from "../type";

import { Texture2DView as TextureNameView } from "../view/Texture2DView";

interface Config {
  value: Value<Texture2D>;
  viewProps: ViewProps;
  engine: WebGLEngine;
  onUploaded?: OnUploaded;
  onPreview?: Function;
}

export class Texture2DController extends BladeController<TextureNameView> {
  public readonly value: Value<Texture2D>;
  public readonly engine: WebGLEngine;
  public readonly onUploaded: OnUploaded | undefined;
  public readonly onPreview: Function | undefined;

  constructor(doc: Document, config: Config) {
    super({
      view: new TextureNameView(doc, { name: config.value.rawValue.name }),
      blade: createBlade(),
      viewProps: config.viewProps,
    });
    this.engine = config.engine;
    this.onUploaded = config.onUploaded;
    this.onPreview = config.onPreview;

    const value = config.value.rawValue;
    this.value = config.value;

    // @ts-ignore
    if (value.getPixelBuffer) {
      this.putTexture2DToCanvas(value);
    }

    this.view.input.addEventListener("change", (event) => {
      const files = (event?.target as HTMLInputElement).files;
      if (!files || !files.length) return;

      const file = files[0];
      createImageBitmap(file).then((imageBitmap) => {
        const texture = new Texture2D(
          this.engine,
          imageBitmap.width,
          imageBitmap.height
        );
        texture.setImageSource(imageBitmap);
        texture.name = file.name;
        texture.generateMipmaps();
        this.value.setRawValue(texture);
        this.putTexture2DToCanvas(texture);
        this.onUploaded && this.onUploaded(texture);
      });
    });

    this.view.textElem.addEventListener("click", () => {
      if (this.value.rawValue instanceof Texture2D) {
        this.onPreview && this.onPreview(this.view.ctx);
      }
    });
  }

  putTexture2DToCanvas(texture2D: Texture2D) {
    const arrayBufferView = new Uint8ClampedArray(
      texture2D.width * texture2D.height * 4
    );
    texture2D.getPixelBuffer(arrayBufferView);
    const imageD = new ImageData(
      arrayBufferView,
      texture2D.width,
      texture2D.height
    );
    createImageBitmap(imageD).then((imageData) => {
      const ctx = this.view.ctx;
      ctx.drawImage(imageData, 0, 0, ctx.canvas.width, ctx.canvas.height);
    });
  }
}
