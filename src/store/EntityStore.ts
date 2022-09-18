import { Vector3Store } from "@/inspector/components/InputVector3";
import { makeObservable } from "mobx";
import { Entity } from "oasis-engine";

export class EntityStore {
  rotation: Vector3Store = new Vector3Store();
  scale: Vector3Store = new Vector3Store();
  position: Vector3Store = new Vector3Store();

  constructor() {
    // makeObservable(this);
  }

  bindValue(entity: Entity) {
    if (entity) {
      this.position.bindValue(entity.transform.position);
      this.rotation.bindValue(entity.transform.rotation);
      this.scale.bindValue(entity.transform.scale);
    }
  }
}
