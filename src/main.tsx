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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div>
    {/* <App /> */}
    <RootContext.Provider value={rootStore}>
      <GlTFView />
      <UIContainer />
      <ImagePreview />
      <JSONViewerModal></JSONViewerModal>
    </RootContext.Provider>
  </div>
);
