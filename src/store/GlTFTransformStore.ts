import { makeObservable } from "mobx";
import { WebIO, Document } from "@gltf-transform/core";
import { KHRONOS_EXTENSIONS } from "@gltf-transform/extensions";
import { Vector4 } from "@galacean/engine";

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
    // const meshes = this._doc.getRoot().listMeshes();
    // for (let i = 0; i < meshes.length; i++) {
    //   const primitives = meshes[i].listPrimitives();
    //   primitives.forEach((primitive) => {
    //     const attribute = primitive.getAttribute("TANGENT");
    //     const buf = attribute.getBuffer();
    //     const uri = buf.getURI();
    //     console.log(uri);
    //   });
    // }
    // console.log(meshes);
  }

  public async generateJSON() {
    const result = await io.writeJSON(this._doc, {});
    return result.json;
  }
}
