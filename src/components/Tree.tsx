import * as React from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MUITreeItem from "@mui/lab/TreeItem";
import { styled } from "../theme/stitches.config";
import { useRootStore } from "@/store/RootStore";
import { Camera, Entity, Light } from "@galacean/engine";
import { observer } from "mobx-react-lite";
import { IconFont } from "./CustomIcon";

const StyledTreeLabel = styled("div", {
  fontSize: "$1",
  fontWeight: 200,
  color: "$white60",
  display: "flex",
  alignItems: "center",
});

// https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=689787
enum IconType {
  Renderer = "icon-box",
  Camera = "icon-video",
  Light = "icon-light_on",
  Bone = "icon-bone-solid",
}

const TreeItem = (
  props: React.PropsWithChildren<{
    nodeId: string;
    label: string;
    type: IconType;
  }>
) => {
  return (
    <MUITreeItem
      sx={{ ":hover": { backgroundColor: "rgb(32,33,36)" }, marginLeft: 0 }}
      nodeId={props.nodeId}
      label={
        <StyledTreeLabel>
          <IconFont type={props.type}></IconFont>
          <span style={{ marginLeft: 3 }}>{props.label}</span>
        </StyledTreeLabel>
      }
    >
      {props.children}
    </MUITreeItem>
  );
};

function getEntityType(entity: Entity): IconType {
  if (entity.getComponent(Camera)) {
    return IconType.Camera;
  }
  // @ts-ignore
  if (entity.getComponent(Light)) {
    return IconType.Light;
  }
  return IconType.Renderer;
}

function NodeItem({
  entity,
  children,
}: React.PropsWithChildren<{ entity: Entity }>) {
  return (
    <TreeItem
      nodeId={entity.instanceId + ""}
      label={entity.name}
      type={getEntityType(entity)}
    >
      {children}
    </TreeItem>
  );
}

function recursiveGenerateTreeItem(root: Entity) {
  return (
    <NodeItem key={root.instanceId} entity={root}>
      {root.children.map((child) => recursiveGenerateTreeItem(child))}
    </NodeItem>
  );
}

function generateSearchItems(searchText: string, entities: Entity[]) {
  return entities
    .filter((entity) => entity.name.includes(searchText))
    .map((entity) => <NodeItem key={entity.instanceId} entity={entity} />);
}

export const Tree = observer(function () {
  const rootStore = useRootStore();
  const { glTFRoot, entities, searchText, glTFId } = rootStore;

  const platEntities = React.useMemo(() => {
    const treeItems = [];
    for (const item of entities.values()) {
      treeItems.push(item);
    }
    return treeItems;
  }, []);

  const entityTree = React.useMemo(
    () => recursiveGenerateTreeItem(glTFRoot),
    [glTFId]
  );

  const isSearch = searchText.length > 0;

  return (
    <>
      {
        <TreeView
          selected={rootStore.selectedEntityId}
          onNodeSelect={(e, nodeId: string) => {
            rootStore.select(nodeId);
          }}
          style={{ color: "white", overflowX: "hidden" }}
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
        >
          {isSearch
            ? generateSearchItems(searchText, platEntities)
            : entityTree}
        </TreeView>
      }
    </>
  );
});
