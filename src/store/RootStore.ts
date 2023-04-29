import { TreeDataNode } from "antd";
import { action, computed, makeObservable, observable } from "mobx";
import {
  Camera,
  Entity,
  GLTFResource,
  Material,
  Scene,
  WebGLEngine,
} from "oasis-engine";
import { createContext, useContext } from "react";
import { EntityStore } from "./EntityStore";
import { validateBytes } from "gltf-validator";
import { InspectorType } from "./enum";
import { AnimationStore } from "./AnimationStore";
import { ImagePreviewStore } from "./ImagePreviewStore";

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

  entityStore = new EntityStore();

  engine: WebGLEngine;

  sceneCamera: Camera;

  glTFRoot: Entity;

  glTFResource: GLTFResource;

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

  animationStore = new AnimationStore();
  imagePreviewStore = new ImagePreviewStore();

  /** from glTF validator */
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
  }

  @action
  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
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

export const rootStore = new RootStore();

export const RootContext = createContext(rootStore);

export const useRootStore = () => {
  return useContext(RootContext);
};
