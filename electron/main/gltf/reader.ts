import { NodeIO, Document } from "@gltf-transform/core";
import {
  dedup,
  center,
  weld,
  unweld,
  tangents,
} from "@gltf-transform/functions";
import { KHRONOS_EXTENSIONS } from "@gltf-transform/extensions";
import { generateTangents } from "mikktspace";
import path from "path";
import fetch from "node-fetch";
import draco3d from "draco3dgltf";
import { BrowserWindow } from "electron";
import convert from "fbx2gltf";
import fs from "fs-extra";

export let contextDocument: Document | undefined = undefined;

const CONVERTED_GLB_PATH = path.join(process.cwd(), "temp/temp.glb");

export async function openFile(win: BrowserWindow, filepath: string) {
  // 如果是第一次打开，返回 false
  if (!win) return false;
  // 如果软件已经打开，直接发送文件打开消息
  win.webContents.send("appendLoading");
  const buffer = await readModelFile(filepath);
  win.webContents.send("file-opened", buffer);
  return true;
}

let _io: NodeIO;
export async function getIO() {
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
      if (modelPath.endsWith(".fbx")) {
        await fs.ensureDir(path.dirname(CONVERTED_GLB_PATH));
        modelPath = await convertFBX2GlTF(modelPath, CONVERTED_GLB_PATH);
      }
      const io = await getIO();
      const doc = await io.read(modelPath);
      contextDocument = doc;
      await doc.transform(
        unweld(),
        tangents({ generateTangents, overwrite: true }),
        weld(),
        dedup(),
        center({ pivot: "center" })
      );

      const glb = await io.writeBinary(doc);
      resolve(Buffer.from(glb.buffer));
    } catch (e) {
      console.log(e);
    }
  });
}

export function convertFBX2GlTF(
  fromPath: string,
  destPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    convert(fromPath, destPath, ["-b"]).then(
      (destPath) => {
        resolve(destPath);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export function transformGlTFToGlB(buffer: Buffer) {
  try {
    const glTFData = JSON.parse(buffer.toString());
  } catch (e) {
    console.log(e);
  }
}
