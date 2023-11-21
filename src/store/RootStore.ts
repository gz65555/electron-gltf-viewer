import { TreeDataNode } from "antd";
import { action, computed, makeObservable, observable } from "mobx";
import {
  AssetType,
  BackgroundMode,
  BoundingBox,
  Camera,
  Engine,
  Entity,
  GLTFResource,
  Material,
  PrimitiveMesh,
  Renderer,
  Scene,
  SkyBoxMaterial,
  SphericalHarmonics3,
  TextureCube,
  Vector3,
  WebGLEngine,
} from "@galacean/engine";
import { createContext, useContext } from "react";
import { EntityStore } from "./EntityStore";
import { validateBytes } from "gltf-validator";
import { InspectorType } from "./enum";
import { AnimationStore } from "./AnimationStore";
import { ImagePreviewStore } from "./ImagePreviewStore";
import { GlTFTransformStore } from "./GlTFTransformStore";
import {
  IBLBaker,
  BakerResolution,
  DecodeMode,
  SphericalHarmonics3Baker,
} from "@galacean/tools-baker";

const hdrList = [
  { url: "/hdr/puresky.hdr", type: AssetType.HDR, label: "PureSky" },
  { url: "/hdr/courtyard.hdr", type: AssetType.HDR, label: "CourtYard" },
];

const sh = new SphericalHarmonics3();

export class RootStore {
  @observable
  treeData: TreeDataNode[] = [];

  entities = new Map<string, Entity>();

  @observable
  selectedEntityId: string = "";

  @observable
  selectedMaterialId: number = -1;

  @observable
  inspectorType: InspectorType = InspectorType.Entity;

  @observable
  hasGlTF = false;

  @observable
  isFullScreen: boolean = false;

  @observable
  searchText = "";

  @observable
  isLoading = false;

  entityStore = new EntityStore();

  engine: WebGLEngine;

  scene: Scene;

  sceneCamera: Camera;

  glTFRoot: Entity;

  glTFResource: GLTFResource;

  gltfSize: number = 0;

  @observable
  glTFId: number = -1;

  @observable
  inspectorData: {
    type: InspectorType;
    data: Entity | Camera | Scene | Material;
  } = {
    type: InspectorType.None,
    data: null,
  };

  gltfTransformStore: GlTFTransformStore;
  animationStore = new AnimationStore();
  imagePreviewStore = new ImagePreviewStore();
  @observable
  hdrSelection: Array<{ label: string; value: string; rawValue: TextureCube }> =
    [];

  /** from glTF validator */
  @observable
  glTFData: {
    info: {
      extensionUsed: string[];
      generator: string;
      hasDefaultScene: boolean;
      hasSkins: boolean;
      materialCount: number;
      drawCallCount: number;
      totalTriangleCount: number;
      totalVertexCount: number;
      animationCount: number;
    };
  };

  constructor() {
    makeObservable(this);
    window["root"] = this;
  }

  @action
  select(id: string, type = InspectorType.Entity) {
    this.selectedEntityId = id;
    this.inspectorType = type;
    this.entityStore.bindValue(this.selectedItem);
    if (id !== null) {
      this.toggleInspector(InspectorType.Entity, this.selectedItem);
    }
  }

  @action
  selectMaterial(id: number) {
    if (this.selectedMaterialId === id) {
      this.selectedMaterialId = -1;
      this.toggleInspector(InspectorType.None);
    } else {
      this.selectedMaterialId = id;
      this.toggleInspector(
        InspectorType.Material,
        this.glTFResource.materials[id]
      );
    }
  }

  @action
  toggleInspector(type: InspectorType, data?: Entity | Material) {
    this.inspectorData.type = type;
    this.inspectorData.data = data;
    if (type === InspectorType.SceneCamera) {
      this.inspectorData.data = this.sceneCamera;
    } else if (type === InspectorType.Scene) {
      this.inspectorData.data = this.engine.sceneManager.activeScene;
    }
  }

  @computed
  get selectedItem(): Entity | undefined {
    return this.entities.get(this.selectedEntityId);
  }

  @action
  async initGlTF(asset: GLTFResource, bytes: Uint8Array) {
    this.reset();
    const rootEntity = asset.defaultSceneRoot;
    this.glTFResource = asset;
    this.glTFId = asset.instanceId;
    this.glTFRoot = rootEntity;
    this.engine = rootEntity.engine as WebGLEngine;
    const scene = this.engine.sceneManager.activeScene;
    this.scene = scene;
    this.sceneCamera = this.engine.sceneManager.activeScene
      .findEntityByName("scene-camera")
      .getComponent(Camera);

    const entities = this.entities;
    function recursiveEntities(entity: Entity, childrenData: TreeDataNode[]) {
      entities.set(entity.instanceId + "", entity);
      const entityData = {
        children: [],
        title: entity.name,
        key: entity.instanceId,
      };
      childrenData.push(entityData);
      const children = entity.children;
      if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child) {
            recursiveEntities(child, entityData.children);
          }
        }
      }
    }
    const treeData = [];
    this.entities.clear();
    recursiveEntities(rootEntity, treeData);
    this.treeData = treeData;
    this.hasGlTF = true;
    this.animationStore.init(asset.animations, asset.defaultSceneRoot);
    this.glTFData = await validateBytes(bytes);
    this.gltfSize = calculateSize(asset.defaultSceneRoot);

    this.gltfTransformStore = await GlTFTransformStore.create(bytes);
  }

  async initHDR(engine: Engine) {
    await engine.resourceManager
      .load<TextureCube[]>(hdrList as any)
      .then((hdrs) => {
        hdrs.forEach((hdr, index) => {
          this.hdrSelection[index] = {
            label: hdrList[index].label,
            value: hdrList[index].label,
            rawValue: hdr,
          };
        });
        const scene = engine.sceneManager.activeScene;
        this.scene = scene;
        const skyMaterial = new SkyBoxMaterial(engine);
        skyMaterial.textureDecodeRGBM = true;
        scene.background.sky.material = skyMaterial;
        scene.background.sky.mesh = PrimitiveMesh.createCuboid(engine, 1, 1, 1);
        scene.background.mode = BackgroundMode.Sky;
        this.changeHDR("PureSky");
      });
  }

  changeHDR(hdrLabel: string) {
    const scene = this.scene;
    const item = rootStore.hdrSelection.find((item) => item.value === hdrLabel);
    console.log(item);
    const bakedTexture = IBLBaker.fromTextureCubeMap(
      item.rawValue,
      BakerResolution.R128,
      DecodeMode.RGBM
    );
    SphericalHarmonics3Baker.fromTextureCubeMap(item.rawValue, sh);
    (scene.background.sky.material as SkyBoxMaterial).texture = item.rawValue;
    scene.ambientLight.diffuseSphericalHarmonics = sh;
    scene.ambientLight.specularTexture = bakedTexture;
  }

  @action
  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
  }

  @action
  startLoading() {
    this.isLoading = true;
  }
  @action
  stopLoading() {
    this.isLoading = false;
  }

  @action
  reset() {
    this.isFullScreen = false;
    this.selectedEntityId = "";
    this.selectedMaterialId = -1;
    this.searchText = "";
    this.inspectorData.data = null;
    this.inspectorData.type = InspectorType.None;
  }

  getExpands() {
    const expands: string[] = [];
    const currentId = this.selectedEntityId;
    let entity = this.entities.get(currentId);
    if (entity) {
      while (entity.parent) {
        expands.push(entity.parent.instanceId + "");
        entity = entity.parent;
      }
    }
    return expands;
  }
}

const boundingBox = new BoundingBox();
function calculateSize(entity: Entity) {
  boundingBox.min.set(
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY
  );
  boundingBox.max.set(
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY
  );

  const renderers = entity.getComponentsIncludeChildren(Renderer, []);
  renderers.forEach((renderer, i) => {
    if (renderer.entity.isActive) {
      renderer.update(0);
      BoundingBox.merge(renderer.bounds, boundingBox, boundingBox);
    }
  });
  const extent = new Vector3();
  boundingBox.getExtent(extent);
  return extent.length();
}

export const rootStore = new RootStore();

export const RootContext = createContext(rootStore);

export const useRootStore = () => {
  return useContext(RootContext);
};
