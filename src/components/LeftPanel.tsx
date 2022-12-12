import { useRootStore } from "@/store/RootStore";
import { observer } from "mobx-react-lite";
import { BasicInfo } from "./Inspector/BasicInfo";
import { MaterialListContainer } from "./MaterialListContainer";
import { AssetContainer, AssetName } from "./Panel/AssetContainer";
import { HeaderContainer } from "./Panel/HeaderContainer";
import { ListItemContainer } from "./Panel/ListItemContainer";
import { PanelContainer } from "./Panel/PanelContainer";
import { PanelHeader } from "./Panel/PanelHeader";
import { PanelItemContainer } from "./Panel/PanelItemContainer";
import { SearchBar } from "./SearchBar";
import { LeftSidebar } from "./Sidebar";
import { Tree } from "./Tree";

const EntitySearchBar = () => {
  const rootStore = useRootStore();
  return (
    <div style={{ paddingLeft: "12px", paddingRight: "12px" }}>
      <SearchBar
        onChange={(value) => {
          rootStore.searchText = value;
        }}
      ></SearchBar>
    </div>
  );
};

export const LeftPanel = observer(() => {
  const store = useRootStore();
  return store.hasGlTF ? (
    <LeftSidebar>
      <HeaderContainer>
        <PanelHeader css={{ marginBottom: 0 }}>Oasis GlTF Viewer</PanelHeader>
      </HeaderContainer>
      <PanelContainer title="基本信息">
        <BasicInfo></BasicInfo>
      </PanelContainer>
      <PanelContainer title="层级树">
        <EntitySearchBar></EntitySearchBar>
        <Tree></Tree>
      </PanelContainer>
      <PanelContainer title="材质">
        <MaterialListContainer />
      </PanelContainer>
    </LeftSidebar>
  ) : null;
});
