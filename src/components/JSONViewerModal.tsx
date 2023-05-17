import { jsonViewerStore } from "@/store/JSONViewerStore";
import { observer } from "mobx-react-lite";
import ReactJson from "react-json-view";
import { Modal, ConfigProvider, theme } from "antd";

export const JSONViewerModal = observer(function () {
  const handleClose = () => {
    jsonViewerStore.closeModal();
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Modal
        open={jsonViewerStore.isViewerOpen}
        centered={true}
        footer={null}
        onCancel={handleClose}
      >
        <ReactJson
          theme={"monokai"}
          style={{ backgroundColor: "#1f1f1f" }}
          name={jsonViewerStore.name}
          src={jsonViewerStore.object}
          indentWidth={2}
          collapsed={1}
        />
      </Modal>
    </ConfigProvider>
  );
});
