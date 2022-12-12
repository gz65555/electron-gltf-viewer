import { useRootStore } from "@/store/RootStore";
import FullscreenOutlined from "@ant-design/icons/FullscreenOutlined";
import FullscreenExitOutlined from "@ant-design/icons/FullscreenExitOutlined";
import { observer } from "mobx-react-lite";
import { FloatButton } from "./FloatButton";
import VideoCameraOutlined from "@ant-design/icons/lib/icons/VideoCameraOutlined";
import { InspectorType } from "@/store/enum";

const FullScreenButton = observer(function () {
  const rootStore = useRootStore();
  return (
    <FloatButton
      // css={{ opacity: 0.6 }}
      onClick={() => {
        rootStore.toggleFullScreen();
      }}
    >
      {rootStore.isFullScreen ? (
        <FullscreenExitOutlined />
      ) : (
        <FullscreenOutlined />
      )}
    </FloatButton>
  );
});

const UIButtons = observer(function () {
  const rootStore = useRootStore();
  return !rootStore.isFullScreen ? (
    <>
      <FloatButton onClick={()=>{
        rootStore.toggleInspector(InspectorType.SceneCamera)
      }} css={{ marginRight: 20 }}>
        <VideoCameraOutlined />
      </FloatButton>
    </>
  ) : null;
});

export const BottomPanel = observer(function () {
  const { hasGlTF } = useRootStore();
  return hasGlTF ? (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        width: "90%",
        display: "flex",
        flexDirection: "row-reverse",
        left: "5%",
      }}
    >
      <FullScreenButton />
      <UIButtons />
    </div>
  ) : null;
});
