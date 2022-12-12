import React from "react";
import ReactDOM from "react-dom/client";
// import './samples/node-api'
import "./assets/styles/index.css";
import { GlTFView } from "./GlTFViewer";
import { AppLayout } from "./layout/AppLayout";
import { RootContext, RootStore } from "./store/RootStore";
import { NodeTree } from "./tree/NodeTree";
import { InspectorContainer } from "./inspector/InpectorContainer";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { LeftPanel } from "./components/LeftPanel";
import { Inspector } from "./components/Inspector";
import { BottomPanel } from "./components/BottomPanel";
import { UIContainer } from "./components/UIContainer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div>
    {/* <App /> */}
    <RootContext.Provider value={new RootStore()}>
      <GlTFView />
      <UIContainer />
    </RootContext.Provider>
  </div>
);
