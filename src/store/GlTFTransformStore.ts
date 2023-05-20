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
        const buffer = buffers[bufferView.buffer];
        const originUint8Array = result.resources[buffer.uri];
        const bufferViewBuffer = new Uint8Array(
          originUint8Array.buffer,
          bufferView.byteOffset,
          bufferView.byteLength
        );

        let outUint8Array = originUint8Array;

        // console.log(bufferView);

        const tangent0: Vector4[] = [];
        const tangent1: Vector4[] = [];

        for (let j = 0; j < accessor.count; j++) {
          const data = new Float32Array(
            originUint8Array.buffer,
            j * bufferView.byteStride + accessor.byteOffset ?? 0,
            4
          );
          console.log(data[3]);
          // tangent0.push(tangent);
        }
        {
          const accessorTypeSize = 16;
          const accessorByteSize =
            accessorTypeSize * Float32Array.BYTES_PER_ELEMENT;
          const outUint8Array = new Uint8Array(
            accessor.count * accessorByteSize
          );
          const byteStride = bufferView.byteStride;

          for (let i = 0; i < accessor.count; i++) {
            for (let j = 0; j < accessorByteSize; j++) {
              outUint8Array[i * accessorByteSize + j] =
                originUint8Array[i * byteStride + accessorByteOffset + j];
            }
          }
          const float32Array = new Float32Array(outUint8Array.buffer);
          for (let j = 0; j < accessor.count; j++) {
            const tangent = new Vector4(
              float32Array[0 + j * 4],
              float32Array[1 + j * 4],
              float32Array[2 + j * 4],
              float32Array[3 + j * 4]
            );
            tangent1.push(tangent);
          }
        }

        for (let i = 0; i < accessor.count; i++) {
          // console.log(`tangent w`, tangent0[i].w, tangent1[i].w);
        }
      });
    }
    return result.json;
  }
}
