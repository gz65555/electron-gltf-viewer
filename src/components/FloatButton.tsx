import { styled } from "@/theme/stitches.config";

export const FloatButton = styled("div", {
  textAlign: "center",
  width: 32,
  height: 32,
  color: "white",
  fontSize: 12,
  borderRadius: "8px",
  backgroundColor: "$white03",
  transition: "background-color 0.2s",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "inset 0 0 0 1px $colors$white10",
  "&:hover": {
    backgroundColor: "$white10",
  },
});
