import ReactDOM from "react-dom/client";
// import './samples/node-api'
import "./assets/styles/index.css";
import { GlTFView } from "./GlTFViewer";
import { RootContext, rootStore } from "./store/RootStore";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { UIContainer } from "./components/UIContainer";
import { ImagePreview } from "./components/ImagePreview";
import { JSONViewerModal } from "./components/JSONViewerModal";
import { ExportModal } from "./components/ExportModal";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div style={{ position: "fixed", left: 0, top: 0 }}>
    <RootContext.Provider value={rootStore}>
      <GlTFView />
      <UIContainer />
      <ImagePreview />
      <JSONViewerModal />
      <ExportModal />
    </RootContext.Provider>
  </div>
);
