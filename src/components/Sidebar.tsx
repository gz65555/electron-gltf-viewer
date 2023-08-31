import { styled } from "../theme/stitches.config";

const StyledSidebar = styled("div", {
  width: 230,
  position: "fixed",
  bottom: "$space$3",
  top: "$space$3",
  userSelect: "none",
  display: "flex",
  boxShadow: "0 0 0 1x",
  flexDirection: "column",
  backgroundColor: "#121316",
  overflow: "hidden",
  borderRadius: "$radii$1",
});

export const SiderBar = StyledSidebar;

export const LeftSidebar = styled(StyledSidebar, {
  left: "$3",
});

export const RightSidebar = styled(StyledSidebar, {
  right: "$3",
});
