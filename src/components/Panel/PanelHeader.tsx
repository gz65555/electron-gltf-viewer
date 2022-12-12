import { styled } from "../../theme/stitches.config";

const StyledPanelHeader = styled("div", {
  fontSize: "$fontSizes$1",
  lineHeight: "1rem",
  color: "$colors$white80",
  userSelect: "none",
  letterSpacing: "0.01em",
  fontWeight: 600,
  padding: "0 12px",
  tabSize: 4,
  marginBottom: "0.6875rem",
});


export const PanelHeader = StyledPanelHeader;