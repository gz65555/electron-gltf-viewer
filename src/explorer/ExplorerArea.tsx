export const ExplorerArea = function (props: {
  header: JSX.Element;
  nodeTree: JSX.Element;
  center: JSX.Element;
  inspector: JSX.Element;
}) {
  return (
    <div style={{ display: "grid" }}>
      <div id="header" style={{ backgroundColor: "ButtonShadow" }}></div>
      <div id="nodeTree" style={{ backgroundColor: "ActiveBorder" }}></div>
      <div id="center" style={{ backgroundColor: "ButtonFace" }}></div>
      <div id="inspector" style={{ backgroundColor: "GrayText" }}></div>
    </div>
  );
};
