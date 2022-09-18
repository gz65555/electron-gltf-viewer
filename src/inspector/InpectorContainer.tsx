import { useRootStore } from "@/store/RootStore";
import { observer } from "mobx-react-lite";
import { InputVector3, Vector3Store } from "./components/InputVector3";
import { EntityInspector } from "./controllers/EntityInspector";

export const InspectorContainer = observer(() => {
  const rootStore = useRootStore();
  const selectedItem = rootStore.selectedItem;
  if (!selectedItem) {
    return <div></div>;
  } else {
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "10px 5px",
          height: "100%",
        }}
      >
        <EntityInspector item={selectedItem} />
      </div>
    );
  }
});
