import { Leva, useControls } from "leva";
import {
  BaseMaterial,
  BlendMode,
  Color,
  RenderFace,
  Vector2,
  Vector3,
  Vector4,
} from "oasis-engine";
import { transformEnumToOptions } from "./utils";

export function transformValue(v: any) {
  if (v instanceof Vector2) {
    return { x: v.x, y: v.y };
  }

  if (v instanceof Vector3) {
    return { x: v.x, y: v.y, z: v.z };
  }

  if (v instanceof Vector4) {
    return { x: v.x, y: v.y, z: v.z, w: v.w };
  }

  if (v instanceof Color) {
    return { r: v.r, g: v.g, b: v.b, a: v.a };
  }
  return v;
}

const uniformMap = {
  u_baseColor: {
    label: "baseColor",
    defaultValue: { r: 1, g: 1, b: 1, a: 1 },
  },
  u_tilingOffset: {
    label: "tilingOffset",
    defaultValue: { x: 1, y: 1, z: 0, w: 0 },
  },
  u_normalIntensity: { label: "normalIntensity", defaultValue: 1 },
  u_emissiveColor: {
    label: "emissiveColor",
    defaultValue: { r: 0, g: 0, b: 0, a: 1 },
  },
  u_occlusionIntensity: { label: "occlusionIntensity", defaultValue: 1 },
  u_occlusionTextureCoord: { label: "occlusionTextureCoord", defaultValue: 0 },
  u_clearCoat: { label: "clearCoat", defaultValue: 0 },
  u_clearCoatRoughness: { label: "clearCoatRoughness", defaultValue: 0 },
  u_metal: { label: "metallic", defaultValue: 1, min: 0, max: 1 },
  u_roughness: { label: "roughness", defaultValue: 1 },
};

export function MaterialInspector(props: { material: BaseMaterial }) {
  const material = props.material;
  const shaderData = material.shaderData;
  const properties = shaderData.getProperties();
  const dynamicSchema = {};
  properties.forEach((property) => {
    const value = shaderData.getPropertyValue(property);
    if (uniformMap[property.name]) {
      dynamicSchema[property.name] = {
        ...uniformMap[property.name],
        value: transformValue(value),
      };
    }
  });
  const schema = {
    shader: {
      label: "shader",
      value: "unlit",
      options: {
        pbr: "pbr",
        unlit: "unlit",
        blinnPhong: "blinnPhong",
      },
    },
    alphaCutoff: {
      value: material.alphaCutoff,
      min: 0,
      max: 1,
      onChange(v) {
        material.alphaCutoff = v;
      },
    },
    blendMode: {
      value: material.blendMode,
      options: transformEnumToOptions(BlendMode),
      onChange(v) {
        material.blendMode = v;
      },
    },
    renderFace: {
      value: material.renderFace,
      options: transformEnumToOptions(RenderFace),
      onChange(v) {
        material.renderFace = v;
      },
    },
    isTransparent: {
      value: material.isTransparent,
      onChange(v) {
        material.isTransparent = v;
      },
    },
    ...dynamicSchema,
  };
  useControls(schema);
  return (
    <Leva
      titleBar={{
        title: `Material(${material.name ?? "noname"})`,
        drag: false,
        position: { x: 0, y: 0 },
        filter: false,
      }}
      hidden={false}
      flat={false}
      fill={false}
      hideCopyButton={true}
    ></Leva>
  );
}
