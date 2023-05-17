import { action, makeObservable, observable } from "mobx";
import { rootStore } from "./RootStore";

export class JSONViewerStore {
  object: any = {};
  name: string;

  @observable
  isViewerOpen = false;

  constructor() {
    makeObservable(this);
  }

  @action
  closeModal() {
    this.isViewerOpen = false;
  }

  @action
  async openModal() {
    const json = await rootStore.gltfTransformStore.generateJSON();
    this.name = json.scenes[0].name;
    this.object = json;
    this.isViewerOpen = true;
  }
}

export const jsonViewerStore = new JSONViewerStore();
