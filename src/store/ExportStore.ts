import { action, makeObservable, observable } from "mobx";

class ExportStore {
  @observable
  isModalOpen = true;

  constructor() {
    makeObservable(this);
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
