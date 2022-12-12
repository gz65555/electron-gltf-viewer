import { IGlTF } from "@/types/IGlTF";
import { TreeDataNode } from "antd";
import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
  toJS,
} from "mobx";
import { Camera, Entity, GLTFResource, Scene, WebGLEngine } from "oasis-engine";
import { createContext, useContext } from "react";
import { EntityStore } from "./EntityStore";
import { validateBytes } from "gltf-validator";
import { InspectorType } from "./enum";

export class RootStore {
  @observable
  treeData: TreeDataNode[] = [];

  entities = new Map<string, Entity>();

  @observable
  selectedItemId: string = "";

  @observable
  selectedType = "entity";

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
  inspectorData: { type: InspectorType; data: Entity | Camera | Scene } = {
    type: InspectorType.None,
    data: null,
  };

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
    };
  };

  constructor() {
    makeObservable(this);
    window['root'] = this;
  }

  @action
  select(id: string, type = "entity") {
    this.selectedItemId = id;
    this.selectedType = type;
    this.entityStore.bindValue(this.selectedItem);
    if (id !== null) {
      this.toggleInspector(InspectorType.Entity, this.selectedItem);
    }
  }

  @action
  toggleInspector(type: InspectorType, data?: Entity) {
    this.inspectorData.type = type;
    if (type === InspectorType.Entity) {
      this.inspectorData.data = data;
    } else if (type === InspectorType.SceneCamera) {
      this.inspectorData.data = this.sceneCamera;
    }
  }

  @computed
  get selectedItem(): Entity | undefined {
    return this.entities.get(this.selectedItemId);
  }

  @action
  async initGlTF(asset: GLTFResource, bytes: Uint8Array) {
    const rootEntity = asset.defaultSceneRoot;
    this.glTFResource = asset;
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
    this.glTFData = await validateBytes(bytes);
  }

  @action
  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
  }

  getExpands() {
    const expands: string[] = [];
    const currentId = this.selectedItemId;
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
