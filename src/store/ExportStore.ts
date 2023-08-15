import { action, makeObservable, observable } from "mobx";
const { ipcRenderer } = window.require("electron");

class ExportStore {
  @observable
  isModalOpen = false;

  constructor() {
    makeObservable(this);
    ipcRenderer.on("export-glb", () => {
      this.isModalOpen = true;
    });
  }

  export(options) {
    ipcRenderer.send("export-glb", options);
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
