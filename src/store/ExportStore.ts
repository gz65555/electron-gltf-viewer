import { action, makeObservable, observable } from "mobx";
import { rootStore } from "./RootStore";
const { ipcRenderer } = window.require("electron");

export interface ExportOptions {
  ktx2: boolean;
  meshopt: boolean;
  meshQuantize: boolean;
  type: "glTF" | "glb";
}

class ExportStore {
  @observable
  isModalOpen = false;

  constructor() {
    makeObservable(this);
    ipcRenderer.on("export-glb", () => {
      this.isModalOpen = true;
    });
  }

  async export(options: ExportOptions) {
    rootStore.startLoading();
    const buffer = await rootStore.gltfTransformStore.getTransformedIO(options);
    rootStore.stopLoading();
    ipcRenderer.send("export-glb", options, buffer);
    this.isModalOpen = false;
  }

  @action
  closeModal() {
    this.isModalOpen = false;
  }

  @action
  async openModal() {
    this.isModalOpen = true;
  }
}

export const exportStore = new ExportStore();
