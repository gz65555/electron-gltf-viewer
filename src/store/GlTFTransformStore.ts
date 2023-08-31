import { makeObservable } from "mobx";
import { WebIO, Document } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { Vector4 } from "@galacean/engine";
import { ExportOptions } from "./ExportStore";
import { encodeKTX2 } from "./ktx2/encodeKTX2";

const io = new WebIO();
io.registerExtensions(ALL_EXTENSIONS);

export class GlTFTransformStore {
  public static async create(info: Uint8Array) {
    const store = new GlTFTransformStore();
    await store.init(info);
    return store;
  }

  private _doc!: Document;

  private constructor() {
    // makeObservable(this);
  }

  public async init(info: Uint8Array) {
    this._doc = await io.readBinary(info);
  }

  public async getTransformedIO(options: ExportOptions) {
    const doc = this._doc;
    if (options.ktx2) {
      await doc.transform(encodeKTX2());
    }
    return io.writeBinary(doc);
  }

  public async generateJSON() {
    const result = await io.writeJSON(this._doc, {});
    return result.json;
  }
}
