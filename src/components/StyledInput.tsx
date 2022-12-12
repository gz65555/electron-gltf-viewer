import { styled } from "../theme/stitches.config";
import { InputStyle } from "../theme/styles/InputStyle";

export const StyledInput = styled(
  "input",
  InputStyle.input,
  InputStyle.inputHover,
  InputStyle.inputFocused
);

export const StyledInputContainer = styled("div", {
  display: "flex",
  gap: 4,
  justifyContent: "stretch",
});

