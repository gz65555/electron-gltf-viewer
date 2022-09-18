import { useRootStore } from "@/store/RootStore";
import {
  DownOutlined,
  FrownFilled,
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Tree } from "antd";
import { observer } from "mobx-react-lite";
import { useContext } from "react";

const treeData = [
  {
    title: "scene",
    key: "0-0",
    children: [
      {
        title: "leaf",
        key: "0-0-0",
      },
      {
        title: "leaf",
        key: "0-0-1",
      },
    ],
  },
];

export const NodeTree = observer(() => {
  const rootStore = useRootStore();
  return (
    <Tree
      rootStyle={{ height: "100%", overflow: "scroll" }}
      // style={{ height: "100%" }}
      showIcon
      defaultExpandAll
      defaultSelectedKeys={["0-0-0"]}
      switcherIcon={<DownOutlined />}
      treeData={rootStore.treeData}
      onSelect={(selectedKeys, info) => {
        rootStore.select(selectedKeys[0] as number);
      }}
    />
  );
});
