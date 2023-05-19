import {
  BladeApi,
  BladePlugin,
  InputParams,
  ParamsParser,
  ParamsParsers,
  parseParams,
  BaseBladeParams,
  LabeledValueController,
  ValueMap,
  createValue,
  LabelPropsObject,
} from "@tweakpane/core";

import { Texture2DController } from "./controller/Texture2DController";
import "./sass/plugin.scss";
import { OnUploaded, Texture2DInputParams } from "./type";
import type { Texture2D, WebGLEngine } from "@galacean/engine";

export interface Texture2DBladeParams extends BaseBladeParams {
  value: Texture2D;
  engine: WebGLEngine;
  view: "texture2d";
  onUploaded: OnUploaded;
  onPreview?: Function;
  label: string;
}

export const Texture2DBladePlugin: BladePlugin<Texture2DBladeParams> = {
  id: "texture2d",
  type: "blade",
  css: "__css__",
  accept(params: InputParams) {
    const p = ParamsParsers;
    const result = parseParams<any>(params, {
      view: p.required.constant("texture2d"),
      value: p.optional.raw as ParamsParser<WebGLEngine>,
      engine: p.required.raw as ParamsParser<WebGLEngine>,
      onUploaded: p.optional.function as ParamsParser<
        (texture2D: Texture2D) => void
      >,
      onPreview: p.optional.function,
      label: p.required.string,
    });

    return result ? { params: result } : null;
  },
  api(args) {
    if (!(args.controller instanceof LabeledValueController)) {
      return null;
    }
    if (!(args.controller.valueController instanceof Texture2DController)) {
      return null;
    }
    return new BladeApi(args.controller);
  },
  controller(args) {
    // Create a controller for the plugin
    const texture2dController = new Texture2DController(args.document, {
      engine: args.params.engine,
      value: createValue<Texture2D>(
        args.params.value ?? ({ name: "None" } as Texture2D)
      ),
      viewProps: args.viewProps,
      onPreview: args.params.onPreview,
      onUploaded: args.params.onUploaded,
    });

    return new LabeledValueController<Texture2D, Texture2DController>(
      args.document,
      {
        blade: args.blade,
        props: ValueMap.fromObject<LabelPropsObject>({
          label: args.params.label,
        }),
        valueController: texture2dController,
      }
    );
  },
};
