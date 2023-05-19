import { AnimationClip, Entity, Script } from "@galacean/engine";
import { action, makeObservable, observable } from "mobx";

export class AnimationStore {
  @observable
  public animationNames: string[] = [];
  @observable
  public frameTime = 0;
  @observable
  public duration = 0;
  @observable
  public isPlaying = false;
  @observable
  selectedIndex: number = 0;

  public selectedClip: AnimationClip;

  private _entity: Entity;
  private _animationClips: AnimationClip[] = [];

  constructor() {
    makeObservable(this);
  }

  init(clips: AnimationClip[], entity: Entity) {
    if (!clips) return;
    this._animationClips = clips;
    this._entity = entity;
    const onUpdate = this.onUpdate.bind(this);
    entity.addComponent(
      class extends Script {
        onUpdate(dt) {
          onUpdate(dt);
        }
      }
    );
    this.selectAnimation(0);
  }

  @action
  selectAnimation(index: number) {
    this.selectedIndex = index;
    this.selectedClip = this._animationClips[index];
    this.frameTime = 0;
    console.log(this);
    this.duration = Math.ceil(this.selectedClip.length);
    //@ts-ignore
    // TODO: linked issue: https://github.com/oasis-engine/engine/issues/1134
    this.selectedClip._sampleAnimation(this._entity, 0);
  }

  @action
  setFrameTime(frameTime: number) {
    this.frameTime = frameTime;
    //@ts-ignore
    // TODO: linked issue: https://github.com/oasis-engine/engine/issues/1134
    this.selectedClip._sampleAnimation(this._entity, frameTime);
  }

  @action
  playAnimation() {
    if (!this.selectedClip) return;
    this.isPlaying = true;
  }

  @action
  pauseAnimation() {
    this.isPlaying = false;
  }

  @action
  onUpdate(deltaTime: number) {
    if (!this.isPlaying || !this.selectedClip || !this.duration) return;
    this.frameTime += deltaTime / 1000;
    if (this.frameTime > this.duration) {
      this.frameTime %= this.duration;
    }
    //@ts-ignore
    // TODO: linked issue: https://github.com/oasis-engine/engine/issues/1134
    this.selectedClip._sampleAnimation(this._entity, this.frameTime);
  }
}
