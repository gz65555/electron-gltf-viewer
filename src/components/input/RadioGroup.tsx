import React from "react";
import { useState } from "react";
import { styled } from "../../theme/stitches.config";
import { InputStyle } from "../../theme/styles/InputStyle";
import { useRadioGroupState } from "../hooks/useRadioGroupState";
import { StyledInputContainer } from "../StyledInput";

export interface IRadioGroupProps {
  selectedKey?: string;
  defaultSelectedKey?: string;
  options: Array<{ key: string; value: any; label: string | React.ReactNode }>;
  onChange?: (value: string) => void;
}

const StyledRadioButton = styled(
  "div",
  InputStyle.input,
  InputStyle.inputHover,
  InputStyle.inputSelected,
  {
    textAlign: "center",
  }
);

export function RadioGroup(props: IRadioGroupProps) {
  const { onChange, selectedKey } = useRadioGroupState({
    selectedKey: props.selectedKey,
    defaultSelectedKey: props.defaultSelectedKey,
    onChange: props.onChange,
  });
  return (
    <StyledInputContainer onClick={(e)=>{
      const dataset = (e.target as HTMLDivElement).dataset!;
      onChange && onChange(dataset.key!);
    }}>
      {props.options.map((option) => {
        return (
          <StyledRadioButton
            is-selected={selectedKey === option.key ? "true" : "false"}
            data-key={option.key}
            key={option.key}
          >
            {option.label}
          </StyledRadioButton>
        );
      })}
    </StyledInputContainer>
  );
}