export const AppLayout = function (props: {
  header?: JSX.Element;
  left: JSX.Element;
  center: JSX.Element;
  right: JSX.Element;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div
        id="header"
        style={{
          backgroundColor: "red",
          gridColumn: "1 / 4",
          height: 50,
        }}
      ></div>
      <div style={{ height: "calc(100vh - 50px)", display: "flex" }}>
        <div
          id="left"
          style={{
            backgroundColor: "ActiveBorder",
            height: "100%",
            width: 250,
            transition: "width 0.3s",
          }}
        >
          {props.left}
        </div>
        <div
          id="center"
          style={{ backgroundColor: "ButtonFace", height: "100%", flex: 1 }}
        >
          {props.center}
        </div>
        <div
          id="inspector"
          style={{ backgroundColor: "GrayText", height: "100%", width: 250 }}
        >
          {props.right}
        </div>
      </div>
    </div>
  );
};
