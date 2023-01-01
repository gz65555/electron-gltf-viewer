import {
  BindingTarget,
  InputBindingPlugin,
  InputParams,
  ParamsParser,
  ParamsParsers,
  parseParams,
} from "@tweakpane/core";

import { TextureNameController as Texture2DController } from "./controller/Texture2DController";
import "./sass/plugin.scss";
import { ShaderData, Texture2D, WebGLEngine } from "oasis-engine";
import { Texture2DInputParams } from "./type";

export const Texture2DInputPlugin: InputBindingPlugin<
  Texture2D,
  Texture2D,
  Texture2DInputParams
> = {
  id: "input-texture2d",
  type: "input",
  css: "__css__",
  accept(exValue: unknown, params: InputParams) {
    const p = ParamsParsers;
    const result = parseParams<Texture2DInputParams>(params, {
      view: p.required.constant("input-texture2d"),
      engine: p.required.raw as ParamsParser<WebGLEngine>,
      onUploaded: p.optional.function as ParamsParser<
        (texture2D: Texture2D) => void
      >,
      key: p.required.string,
    });

    return result
      ? {
          initialValue: exValue as Texture2D,
          params: result,
        }
      : null;
  },
  binding: {
    reader: (_args) => {
      return (exValue: unknown): Texture2D => {
        if (exValue instanceof ShaderData) {
          return (
            (exValue.getTexture(_args.params.key) as Texture2D) ??
            ({ name: "None" } as Texture2D)
          );
        } else {
          return { name: "None" } as Texture2D;
        }
      };
    },
    writer(_args) {
      return (target: BindingTarget, inValue) => {
        target.write(inValue);
      };
    },
  },
  controller(args) {
    return new Texture2DController(args.document, {
      engine: args.params.engine,
      onUploaded: args.params.onUploaded,
      value: args.value,
      viewProps: args.viewProps,
    });
  },
};
