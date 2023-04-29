import { BaseInputParams } from "@tweakpane/core";
import { Texture2D, WebGLEngine } from "oasis-engine";

export interface Texture2DInputParams extends BaseInputParams {
  view: "input-texture2d";
  engine: WebGLEngine;
  onUploaded: OnUploaded;
  onPreview?: Function;
  key: string;
}

export type OnUploaded = (texture2D: Texture2D) => void;
