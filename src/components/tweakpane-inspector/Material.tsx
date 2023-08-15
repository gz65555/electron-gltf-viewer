import {
  BaseMaterial,
  BlendMode,
  Color,
  RenderFace,
  Shader,
  Vector2,
  Vector4,
} from "@galacean/engine";
import { useEffect } from "react";
import { FolderApi, Pane } from "tweakpane";

import { transformEnumToOptions } from "./utils";
import * as TexturePlugin from "./texture2d";
import { rootStore } from "@/store/RootStore";

export enum MaterialPropertyGroup {
  Common = "Common",
  Base = "Base",
  Normal = "Normal",
  Emissive = "Emissive",
  BlinnPhong = "Blinn Phong",
  Clearcoat = "Clearcoat",
  MetalRoughness = "Metal Roughness",
  Occlusion = "Occlusion",
}

const folderVisibleMap: Record<string, MaterialPropertyGroup[]> = {
  pbr: [
    MaterialPropertyGroup.Common,
    MaterialPropertyGroup.Base,
    MaterialPropertyGroup.Normal,
    MaterialPropertyGroup.Emissive,
    MaterialPropertyGroup.Clearcoat,
    MaterialPropertyGroup.MetalRoughness,
    MaterialPropertyGroup.Occlusion,
  ],
  "blinn-phong": [
    MaterialPropertyGroup.Common,
    MaterialPropertyGroup.Base,
    MaterialPropertyGroup.Normal,
    MaterialPropertyGroup.BlinnPhong,
  ],
  unlit: [MaterialPropertyGroup.Common, MaterialPropertyGroup.Base],
};

function createFolders(pane: Pane, groups: MaterialPropertyGroup[]) {
  const folders: Record<string, FolderApi> = {};
  groups.forEach((group) => {
    const folder = pane.addFolder({
      title: group,
      expanded: true,
    });
    folders[group] = folder;
  });
  return folders;
}

function changeFolderVisibility(
  shader: string,
  folders: Record<MaterialPropertyGroup, FolderApi>
) {
  for (let k in folders) {
    const folder: FolderApi = folders[k];
    folder.hidden = true;
  }
  folderVisibleMap[shader].forEach((group) => {
    if (folders[group]) folders[group].hidden = false;
  });
}

const uniformMap = {
  material_BaseTexture: {
    label: "baseTex",
    view: "input-texture2d",
    folder: MaterialPropertyGroup.Base,
  },
  material_BaseColor: {
    label: "baseColor",
    defaultValue: new Color(),
    color: { type: "float", alpha: true },
    view: "text",
    folder: MaterialPropertyGroup.Base,
  },
  material_TilingOffset: {
    label: "tilingOffset",
    defaultValue: new Vector4(1, 1, 0, 0),
    folder: MaterialPropertyGroup.Common,
  },
  material_NormalTexture: {
    label: "texture",
    view: "input-texture2d",
    folder: MaterialPropertyGroup.Normal,
  },
  material_NormalTextureIntensity: {
    label: "intensity",
    defaultValue: 1,
    folder: MaterialPropertyGroup.Normal,
  },
  material_EmissiveTexture: {
    label: "texture",
    view: "input-texture2d",
    folder: MaterialPropertyGroup.Emissive,
  },
  material_EmissiveColor: {
    label: "color",
    defaultValue: new Color(),
    folder: MaterialPropertyGroup.Emissive,
  },
  material_OcclusionTexture: {
    label: "texture",
    view: "input-texture2d",
    folder: MaterialPropertyGroup.Occlusion,
  },
  material_OcclusionIntensity: {
    label: "intensity",
    defaultValue: 0,
    min: 0,
    max: 1,
    folder: MaterialPropertyGroup.Occlusion,
  },
  material_OcclusionTextureCoord: {
    label: "textureCoord",
    folder: MaterialPropertyGroup.Occlusion,
    defaultValue: new Vector2(),
  },
  material_ClearCoatTexture: {
    label: "texture",
    view: "input-texture2d",
    folder: MaterialPropertyGroup.Clearcoat,
  },
  material_ClearCoat: {
    label: "clearCoat",
    defaultValue: 0,
    min: 0,
    max: 1,
    folder: MaterialPropertyGroup.Clearcoat,
  },
  material_ClearCoatRoughness: {
    label: "roughness",
    defaultValue: 0,
    min: 0,
    max: 1,
    folder: MaterialPropertyGroup.Clearcoat,
  },
  material_RoughnessMetallicTexture: {
    label: "texture",
    view: "input-texture2d",
    folder: MaterialPropertyGroup.MetalRoughness,
  },
  material_Metal: {
    label: "metallic",
    defaultValue: 0,
    min: 0,
    max: 1,
    folder: MaterialPropertyGroup.MetalRoughness,
  },
  material_Roughness: {
    label: "roughness",
    defaultValue: 0,
    min: 0,
    max: 1,
    folder: MaterialPropertyGroup.MetalRoughness,
  },
};

function addTextureInput(
  uniformProperty: string,
  material: BaseMaterial,
  folders: Record<string, FolderApi>,
  options: { label: string; folder: MaterialPropertyGroup }
) {
  folders[options.folder].addBlade({
    view: "texture2d",
    engine: material.engine,
    label: options.label,
    value: material.shaderData.getTexture(uniformProperty),
    onUploaded(texture) {
      material.shaderData.setTexture(uniformProperty, texture);
    },
    onPreview(ctx: CanvasRenderingContext2D) {
      rootStore.imagePreviewStore.show(ctx);
    },
  });
}

function setMaterialShader(
  material: BaseMaterial,
  _,
  value: string,
  folders: any
) {
  material.shader = Shader.find(value);
  const shaderData = material.shaderData;
  shaderData.disableMacro("MATERIAL_OMIT_NORMAL");
  shaderData.disableMacro("MATERIAL_NEED_TILING_OFFSET");
  shaderData.disableMacro("MATERIAL_NEED_WORLD_POS");

  if (value === "unlit") {
    shaderData.enableMacro("MATERIAL_OMIT_NORMAL");
    shaderData.enableMacro("MATERIAL_NEED_TILING_OFFSET");
  } else {
    shaderData.enableMacro("MATERIAL_NEED_WORLD_POS");
    shaderData.enableMacro("MATERIAL_NEED_TILING_OFFSET");
  }

  changeFolderVisibility(material.shader.name, folders);
}

function setMaterialValue(
  material: BaseMaterial,
  property: string,
  value: number
) {
  material.shaderData.setFloat(property, value);
}

const onChangeMap = {
  material_Metal: setMaterialValue,
  material_Roughness: setMaterialValue,
  material_ClearCoat: setMaterialValue,
  material_ClearCoatRoughness: setMaterialValue,
  material_OcclusionIntensity: setMaterialValue,
  shader: setMaterialShader,
};

export function MaterialInspector(props: { material: BaseMaterial }) {
  const material = props.material;
  const shaderData = material.shaderData;

  useEffect(() => {
    const pane = new Pane();
    pane.title = `Material(${material.name})`;

    pane.registerPlugin(TexturePlugin);

    const folders = createFolders(pane, [
      MaterialPropertyGroup.Base,
      MaterialPropertyGroup.Common,
      MaterialPropertyGroup.MetalRoughness,
      MaterialPropertyGroup.Normal,
      MaterialPropertyGroup.Emissive,
      MaterialPropertyGroup.Occlusion,
      MaterialPropertyGroup.Clearcoat,
    ]);

    folders[MaterialPropertyGroup.Base].addInput(
      { shader: material.shader.name },
      "shader",
      {
        options: {
          pbr: "pbr",
          unlit: "unlit",
          blinnPhong: "blinn-phong",
        },
      }
    );
    folders[MaterialPropertyGroup.Common].addInput(material, "alphaCutoff", {
      min: 0,
      max: 1,
    });
    folders[MaterialPropertyGroup.Common].addInput(material, "blendMode", {
      options: transformEnumToOptions(BlendMode),
    });
    folders[MaterialPropertyGroup.Common].addInput(material, "renderFace", {
      options: transformEnumToOptions(RenderFace),
    });
    folders[MaterialPropertyGroup.Common].addInput(material, "isTransparent", {
      label: "transparent",
    });

    const shaderValues: Record<string, any> = {};

    for (let uniformProperty in uniformMap) {
      const options = uniformMap[uniformProperty];

      if (options.view === "input-texture2d") {
        addTextureInput(uniformProperty, material, folders, options);
        continue;
      }

      const value = shaderData.getPropertyValue(uniformProperty);
      shaderValues[uniformProperty] = value ?? options.defaultValue;

      if (folders[options.folder]) {
        folders[options.folder].addInput(
          shaderValues,
          uniformProperty,
          options
        );
      } else {
        pane.addInput(shaderValues, uniformProperty, options);
      }
    }

    pane.on("change", (e) => {
      if (onChangeMap[e.presetKey]) {
        onChangeMap[e.presetKey](material, e.presetKey, e.value, folders);
      }
    });

    return () => {
      pane.dispose();
    };
  }, [material.instanceId]);

  return <></>;
}
