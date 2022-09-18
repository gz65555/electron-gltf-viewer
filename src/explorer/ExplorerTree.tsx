import {
  DownOutlined,
  FrownFilled,
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Tree } from "antd";
import React from "react";
const treeData = [
  {
    title: "Mesh",
    key: "0-0-0",
    icon: <MehOutlined />,
  },
  {
    title: "Animation",
    key: "0-0-1",
    icon: ({ selected }) => (selected ? <FrownFilled /> : <FrownOutlined />),
  },
  {
    title: "Material",
    key: "0-0-2",
    icon: ({ selected }) => (selected ? <FrownFilled /> : <FrownOutlined />),
  },
  {
    title: "Texture",
    key: "0-0-3",
    icon: ({ selected }) => (selected ? <FrownFilled /> : <FrownOutlined />),
  },
];

function TreeItem(props: { name: string; icon: JSX.Element }) {
  return (
    <div
      onClick={() => {
        console.log(1);
      }}
      style={{ marginLeft: 2, cursor: "pointer" }}
    >
      {props.icon}
      <span style={{ marginLeft: 2, userSelect: "none" }}>{props.name}</span>
    </div>
  );
}

export const ExplorerTree = () => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <TreeItem name={"Mesh"} icon={<MehOutlined />} />
    <TreeItem name={"Animation"} icon={<MehOutlined />} />
    <TreeItem name={"Material"} icon={<MehOutlined />} />
    <TreeItem name={"Texture"} icon={<MehOutlined />} />
  </div>
);
