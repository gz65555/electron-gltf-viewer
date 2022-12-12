import { styled } from "../../theme/stitches.config";

export const PanelItemLabel = styled("div", {
  whiteSpace: "nowrap",
  maxWidth: 60,
  textOverflow: "ellipsis",
  overflow: "hidden",
  color: "$colors$white40",
  fontSize: "$fontSizes$1",
});