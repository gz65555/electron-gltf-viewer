import { jsonViewerStore } from "@/store/JSONViewerStore";
import { observer } from "mobx-react-lite";
import ReactJson from "react-json-view";
import { Modal, ConfigProvider, theme, Select, Form, Checkbox } from "antd";
import { exportStore } from "@/store/ExportStore";

export const ExportModal = observer(function () {
  const [form] = Form.useForm();

  const handleClose = () => {
    exportStore.closeModal();
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: [theme.darkAlgorithm],
        token: {
          colorPrimary: "#2b99ff",
          fontFamily:
            "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
          // colorBgContainer: '#f6ffed',
          borderRadius: 4,
        },
      }}
    >
      <Modal
        title={"Export Options"}
        open={exportStore.isModalOpen}
        centered={true}
        okText="Export"
        bodyStyle={{ padding: "20px 0px" }}
        onOk={() => {
          form.submit();
        }}
        onCancel={handleClose}
      >
        <Form
          size="small"
          form={form}
          labelCol={{ span: 6 }}
          labelAlign="left"
          onFinish={(values) => {
            console.log(values);
          }}
          initialValues={{
            type: "glTF",
            ktx2: true,
            meshopt: false,
            meshQuantize: false,
          }}
        >
          <Form.Item label="Type" name="type">
            <Select
              style={{ width: 200 }}
              options={[{ label: "glTF" }, { label: "glb" }]}
            />
          </Form.Item>
          <Form.Item label="KTX2" valuePropName="checked" name={"ktx2"}>
            <Checkbox />
          </Form.Item>
          <Form.Item label="MeshOpt" valuePropName="checked" name="meshopt">
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="MeshQuantize"
            valuePropName="checked"
            name="meshQuantize"
          >
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
});
