import { Button, Drawer, Tree } from "antd";
import { useState } from "react";
import { ExplorerTree } from "./ExplorerTree";

export const Explorer = function () {
  const [open, setOpen] = useState(false);
  const [childrenDrawer, setChildrenDrawer] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  return (
    <div>
      <Button
        onClick={showDrawer}
        style={{ position: "fixed", bottom: "10px", left: 10 }}
      >
        Open Explorer
      </Button>
      <Drawer
        bodyStyle={{ padding: 0 }}
        headerStyle={{ padding: "10px 0px", userSelect: "none" }}
        title="Multi-level drawer"
        width={250}
        height={200}
        closable={true}
        onClose={onClose}
        open={open}
        mask={false}
        placement={"bottom"}
      >
        <div style={{ display: "flex" }}>
          <ExplorerTree></ExplorerTree>
        </div>
      </Drawer>
    </div>
  );
};
