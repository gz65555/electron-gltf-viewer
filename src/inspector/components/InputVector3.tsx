import { Input, InputNumber } from "antd";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { Vector3 } from "oasis-engine";

export class Vector3Store {
  x: string = "0";
  y: string = "0";
  z: string = "0";

  private _bindVector3: Vector3 | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  bindValue(vector3: Vector3) {
    this.x = vector3.x.toString();
    this.y = vector3.y.toString();
    this.z = vector3.z.toString();
    this._bindVector3 = vector3;
  }

  onValueBlur(v: string, key: string) {
    const num = Number(v);
    if (isNaN(num)) {
      this[key] = "0";
    } else {
      this[key] = num.toString();
    }
    this.syncBindVector3(key, v);
  }

  onValueChange(v: string, key: string) {
    // @ts-ignore
    if (!isNaN(v) || v === "-" || v === "+" || v === ".") {
      this[key] = v;
    }
    this.syncBindVector3(key, v);
  }

  syncBindVector3(key: string, value: string) {
    if (this._bindVector3) {
      const num = Number(value);
      if (isNaN(num)) {
        this._bindVector3[key] = 0;
      } else {
        this._bindVector3[key] = num;
      }
    }
  }
}

export const InputItem = observer(
  (props: { prefix: string; item: Vector3Store }) => {
    const { item, prefix } = props;
    return (
      <Input
        prefix={prefix}
        size="small"
        value={item[prefix]}
        onChange={(e) => {
          item.onValueChange(e.target.value, prefix);
        }}
        onBlur={(e) => {
          item.onValueBlur(e.target.value, prefix);
        }}
      />
    );
  }
);

export const InputVector3 = (props: { label: string; item: Vector3Store }) => {
  const { item } = props;
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: 50 }}>{props.label}</div>
      <div style={{ display: "flex", flex: 1 }}>
        <InputItem prefix={"x"} item={item} />
        <InputItem prefix={"y"} item={item} />
        <InputItem prefix={"z"} item={item} />
      </div>
    </div>
  );
};
