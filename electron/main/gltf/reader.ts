import fs from "fs";
import path from "path";
import { Document, NodeIO } from "@gltf-transform/core";
import { dedup, center, weld } from "@gltf-transform/functions";
import { KHRONOS_EXTENSIONS } from "@gltf-transform/extensions";
import fetch from "node-fetch";
import draco3d from "draco3dgltf";

let _io;
async function getIO() {
  if (!_io) {
    _io = new NodeIO(fetch)
      .setAllowHTTP(true)
      .registerExtensions(KHRONOS_EXTENSIONS)
      .registerDependencies({
        "draco3d.decoder": await draco3d.createDecoderModule(),
        "draco3d.encoder": await draco3d.createEncoderModule(),
      });
  }
  return _io;
}

/** 读取模型文件 */
export function readModelFile(modelPath: string): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const io = await getIO();
      const doc = await io.read(modelPath);
      await doc.transform(weld(), dedup(), center({ pivot: "center" }));
      const glb = await io.writeBinary(doc);
      resolve(Buffer.from(glb.buffer));
    } catch (e) {
      console.log(e);
    }
  });
}

export function transformGlTFToGlB(buffer: Buffer) {
  try {
    const glTFData = JSON.parse(buffer.toString());
  } catch (e) {
    console.log(e);
  }
}
