import { styled } from "@/theme/stitches.config";
import { InputStyle } from "@/theme/styles/InputStyle";

export const AssetName = styled("div", {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  marginLeft: 2,
  maxWidth: 123,
  fontSize: 12,
});

export const AssetContainer = styled(
  "div",
  {
    color: "$white60",
    height: 26,
    backgroundColor: "$white05",
    borderRadius: "$1",
    display: "flex",
    alignItems: "center",
    paddingLeft: 8,
    paddingRight: 4,
    "&:hover": {
      backgroundColor: "$white07",
    },
  },
  InputStyle.inputSelected
);
