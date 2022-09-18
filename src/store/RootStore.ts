import { TreeDataNode } from "antd";
import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
  toJS,
} from "mobx";
import { Entity } from "oasis-engine";
import { createContext, useContext } from "react";
import { EntityStore } from "./EntityStore";

export class RootStore {
  @observable
  treeData: TreeDataNode[] = [];

  entities = new Map<number, Entity>();

  @observable
  selectedItemId: number = -1;

  @observable
  selectedType = "entity";

  entityStore = new EntityStore();

  constructor() {
    makeObservable(this);
  }

  @action
  select(id: number, type = "entity") {
    this.selectedItemId = id;
    this.selectedType = type;
    this.entityStore.bindValue(this.selectedItem);
  }

  @computed
  get selectedItem(): Entity | undefined {
    return this.entities.get(this.selectedItemId);
  }

  @action
  initGlTF(rootEntity: Entity) {
    const entities = this.entities;
    function recursiveEntities(entity: Entity, childrenData: TreeDataNode[]) {
      entities.set(entity.instanceId, entity);
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
  }
}

export const RootContext = createContext(new RootStore());

export const useRootStore = () => {
  return useContext(RootContext);
};
