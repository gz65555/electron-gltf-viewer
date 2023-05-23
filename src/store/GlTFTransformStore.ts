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
    const meshes = result.json.meshes;
    const buffers = result.json.buffers;
    for (let i = 0; i < meshes.length; i++) {
      const primitives = meshes[i].primitives;
      primitives.forEach((primitive, index) => {
        const tangentAccessorIndex = primitive.attributes["TANGENT"];
        const accessor = result.json.accessors[tangentAccessorIndex];
        const accessorByteOffset = accessor.byteOffset ?? 0;
        const bufferView = result.json.bufferViews[accessor.bufferView];
        const bufferViewOffset = bufferView.byteOffset ?? 0;
        const buffer = buffers[bufferView.buffer];
        const originUint8Array = result.resources[buffer.uri];

        for (let j = 0; j < accessor.count; j++) {
          const data = new Float32Array(
            originUint8Array.buffer,
            bufferViewOffset + j * bufferView.byteStride + accessorByteOffset,
            4
          );
          console.log(data[3]);
        }
      });
    }
    return result.json;
  }
}
