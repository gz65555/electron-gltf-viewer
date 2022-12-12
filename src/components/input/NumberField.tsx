import React from "react"
import { styled } from "../../theme/stitches.config";
import { useInputNumberState } from "../hooks/useInputNumberState";
import { StyledInput } from "../StyledInput";

const StyledContainer = styled("div", {
  flexGrow: 1,
  flexShrink: 1,
  color: "$colors$white80",
  width: "100%",
});

const StyledPrefix = styled("div", {
  padding: "$1",
  lineHeight: "1.1rem",
  color: "$blue",
  opacity: 0.6,
  position: "absolute",
  textAlign: "center",
});

export const NumberField = (props: {
  prefix?: string;
  onChange?: (val: number) => void;
  value?: number;
  defaultValue?: number;
}) => {

  const inputProps = useInputNumberState({
    defaultValue: props.defaultValue,
    value: props.value,
    onChange: props.onChange,
  });

  return (
    <StyledContainer>
      <StyledPrefix>{props.prefix}</StyledPrefix>
      <StyledInput
        {...inputProps}
        type="text"
        with-prefix={
          props.prefix && props.prefix.length > 0 ? "true" : undefined
        }
      />
    </StyledContainer>
  );
};