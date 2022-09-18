import { Divider } from "antd";
import { PropsWithChildren } from "react";

export const Group = (props: PropsWithChildren<{ title: string }>) => {
  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: 16, paddingBottom: 5 }}>
        {props.title}
      </div>
      <div>{props.children}</div>
      <Divider></Divider>
    </div>
  );
};
