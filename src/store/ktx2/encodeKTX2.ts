import { Document, Transform } from "@gltf-transform/core";
import { KHRTextureBasisu } from "@gltf-transform/extensions";
import { ktx2Encoder } from "./ktx2-encoder";

export function encodeKTX2(): Transform {
  return async function (document: Document) {
    const textures = document.getRoot().listTextures();
    if (textures.length > 0) {
      document.createExtension(KHRTextureBasisu).setRequired(true);
    }
    const promises = textures
      .filter((info) => info.getMimeType() !== "image/ktx2")
      .map((textureInfo) => {
        textureInfo.setMimeType("image/ktx2");
        const imageBuffer = textureInfo.getImage();
        return ktx2Encoder.encode(imageBuffer.buffer);
      });
    const compressedTextures = await Promise.all(promises);
    compressedTextures.forEach((buffer, index) => {
      console.log("finish encode", textures[0].getName());
      const info = textures[index];
      info.setImage(buffer);
    });
  };
}
