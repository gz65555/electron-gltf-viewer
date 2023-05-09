import {
  BladeApi,
  BladePlugin,
  InputParams,
  ParamsParser,
  ParamsParsers,
  parseParams,
  BaseBladeParams,
} from "@tweakpane/core";

import { Texture2DController } from "./controller/Texture2DController";
import "./sass/plugin.scss";
import { OnUploaded, Texture2DInputParams } from "./type";
import type { Texture2D, WebGLEngine } from "oasis-engine";

export interface Texture2DBladeParams extends BaseBladeParams {
  texture: Texture2D;
  engine: WebGLEngine;
  view: "texture2d";
  onUploaded: OnUploaded;
  onPreview?: Function;
}

export const Texture2DBladePlugin: BladePlugin<Texture2DBladeParams> = {
  id: "texture2d",
  type: "blade",
  css: "__css__",
  accept(params: InputParams) {
    console.log("accept", params);
    const p = ParamsParsers;
    const result = parseParams<any>(params, {
      view: p.required.constant("texture2d"),
      engine: p.required.raw as ParamsParser<WebGLEngine>,
      onUploaded: p.optional.function as ParamsParser<
        (texture2D: Texture2D) => void
      >,
      onPreview: p.optional.function,
    });

    console.log(result ? { params: result } : null);
    return result ? { params: result } : null;
  },
  api(args) {
    if (!(args.controller instanceof Texture2DController)) {
      return null;
    }
    return new BladeApi(args.controller);
  },
  controller(args) {
    // Create a controller for the plugin
    return new Texture2DController(args.document, {
      engine: args.params.engine,
      value: args.params.texture ?? { name: "None" } as Texture2D,
      viewProps: args.viewProps,
      onPreview: args.params.onPreview,
      onUploaded: args.params.onUploaded,
    });
  },
};
