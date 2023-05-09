import { useRootStore } from "@/store/RootStore";
import FullscreenOutlined from "@ant-design/icons/FullscreenOutlined";
import FullscreenExitOutlined from "@ant-design/icons/FullscreenExitOutlined";
import { observer } from "mobx-react-lite";
import { FloatButton } from "./FloatButton";
import VideoCameraOutlined from "@ant-design/icons/lib/icons/VideoCameraOutlined";
import SettingOutlined from "@ant-design/icons/lib/icons/SettingOutlined";
import { InspectorType } from "@/store/enum";
import { ObservedAnimationPlayer } from "./ObservedAnimationPlayer";

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
      <FloatButton
        onClick={() => {
          rootStore.toggleInspector(InspectorType.SceneCamera);
        }}
        css={{ marginRight: 20 }}
      >
        <VideoCameraOutlined />
      </FloatButton>
      <FloatButton
        onClick={() => {
          rootStore.toggleInspector(InspectorType.Scene);
        }}
        css={{ marginRight: 20 }}
      >
        <SettingOutlined />
      </FloatButton>
    </>
  ) : null;
});

export const ToolPanel = observer(function () {
  const { hasGlTF } = useRootStore();
  return hasGlTF ? (
    <>
      <div
        style={{
          position: "fixed",
          top: "30px",
          width: "90%",
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "center",
          left: "5%",
        }}
      >
        <FullScreenButton />
        <UIButtons />
      </div>
      <ObservedAnimationPlayer
        style={{
          position: "fixed",
          bottom: "30px",
          transform: "translateX(-50%)",
          left: "50%",
        }}
      />
    </>
  ) : null;
});
