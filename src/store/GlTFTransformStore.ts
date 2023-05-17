import { makeObservable } from "mobx";
import { WebIO, Document } from "@gltf-transform/core";
import { KHRONOS_EXTENSIONS } from "@gltf-transform/extensions";

const io = new WebIO();
io.registerExtensions(KHRONOS_EXTENSIONS);

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

  public async generateJSON() {
    const result = await io.writeJSON(this._doc, {});
    return result.json;
  }
}
