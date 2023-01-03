import { styled } from "@/theme/stitches.config";
import React, { CSSProperties, PropsWithChildren } from "react";

const StyledSelect = styled("select", {
  outline: "none",
  border: "none",
  backgroundColor: "$white05",
  height: 26,
  lineHeight: 26,
  borderRadius: 3,
  padding: "0 20px 0 4px",
  cursor: "pointer",
  appearance: "none",
});

const StyledText = styled("p", {
  color: "$white60",
  height: 26,
  lineHeight: "23px",
  fontWeight: 600,
  padding: "0 20px 0 4px",
  fontSize: 14,
  maxWidth: 120,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  boxSizing: "border-box",
});

type IOptions = {
  style?: CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedIndex?: number;
};

export function Select(props: PropsWithChildren<IOptions>) {
  const [selectedValue, setSelected] = React.useState("");
  const { children } = props;
  const isControlled = props.selectedIndex == undefined ? false : true;

  const selectedMap: Record<number, string> = {};
  if (children && Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      selectedMap[children[i].props.value] = children[i].props.children;
    }
  }

  const finalSelectedValue = isControlled ? props.selectedIndex : selectedValue;

  return (
    <div
      style={{
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <StyledSelect
        value={finalSelectedValue}
        style={props.style}
        onChange={(e) => {
          if (isControlled) {
            props.onChange && props.onChange(e);
          } else {
            setSelected(e.target.value);
          }
        }}
      >
        {props.children}
      </StyledSelect>
      <div
        style={{
          position: "absolute",
          top: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <StyledText>{selectedMap[finalSelectedValue]}</StyledText>
      </div>
    </div>
  );
}
