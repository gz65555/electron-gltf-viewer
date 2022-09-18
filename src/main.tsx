import React from "react";
import ReactDOM from "react-dom/client";
// import './samples/node-api'
import "styles/index.css";
import { GlTFView } from "./GlTFViewer";
import { AppLayout } from "./layout/AppLayout";
import { RootContext, RootStore } from "./store/RootStore";
import { NodeTree } from "./tree/NodeTree";
import "antd/dist/antd.compact.css";
import { InspectorContainer } from "./inspector/InpectorContainer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <App /> */}
    <RootContext.Provider value={new RootStore()}>
      <AppLayout
        center={<GlTFView></GlTFView>}
        left={<NodeTree></NodeTree>}
        right={<InspectorContainer></InspectorContainer>}
      ></AppLayout>
    </RootContext.Provider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
