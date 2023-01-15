import fs from "fs";
import path from "path";
import { Document, NodeIO } from "@gltf-transform/core";
import { dedup, center, weld } from "@gltf-transform/functions";
import { KHRONOS_EXTENSIONS } from "@gltf-transform/extensions";
import fetch from "node-fetch";
import draco3d from "draco3dgltf";
import { BrowserWindow } from "electron";

export async function openFile(win: BrowserWindow, filepath: string) {
  // 如果是第一次打开，返回 false
  if (!win) return false;
  // 如果软件已经打开，直接发送文件打开消息
  win.webContents.send("appendLoading");
  const buffer = await readModelFile(filepath);
  win.webContents.send("file-opened", buffer);
  return true;
}

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
