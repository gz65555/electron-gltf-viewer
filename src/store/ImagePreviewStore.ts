import { action, makeAutoObservable, observable } from "mobx";

export class ImagePreviewStore {
  @observable
  visible = false;

  @observable
  url: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  @action
  show(ctx: CanvasRenderingContext2D) {
    ctx.canvas.toBlob((blob) => {
      this.url = URL.createObjectURL(blob);
      this.visible = true;
    });
  }

  @action
  hide() {
    this.visible = false;
  }
}
