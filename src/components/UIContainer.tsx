import { useRootStore } from "@/store/RootStore";
import { observer } from "mobx-react-lite";
import { BottomPanel } from "./BottomPanel";
import { Inspector } from "./Inspector";
import { LeftPanel } from "./LeftPanel";

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
      <BottomPanel />
    </>
  );
});
