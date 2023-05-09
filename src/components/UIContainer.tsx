import { useRootStore } from "@/store/RootStore";
import { observer } from "mobx-react-lite";
import { AnimationPlayer } from "./AnimationPlayer";
import { ToolPanel } from "./ToolPanel";
import { Inspector } from "./Inspector";
import { LeftPanel } from "./LeftPanel";
import { MaterialInspector } from "./tweakpane-inspector/Material";

export const UIContainer = observer(function () {
  const { isFullScreen } = useRootStore();
  return (
    <>
      {!isFullScreen ? (
        <>
          <LeftPanel />
          <Inspector />
        </>
      ) : null}
      <ToolPanel />
    </>
  );
});
