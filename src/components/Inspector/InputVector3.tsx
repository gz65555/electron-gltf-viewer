import React from "react";
import { styled } from "../../theme/stitches.config";
import { NumberField } from "../input/NumberField";
import { PanelItemContainer } from "../Panel/PanelItemContainer";
import { PanelItemLabel } from "../Panel/PanelItemLabel";
import { PanelItemValue } from "../Panel/PanelItemValue";
import { observer } from "mobx-react-lite";
import { StyledInputContainer } from "../StyledInput";


const BasicInputVector3 = observer(() => {
  return (
    <StyledInputContainer>
      <NumberField defaultValue={1} prefix="X"></NumberField>
      <NumberField defaultValue={0} prefix="Y"></NumberField>
      <NumberField defaultValue={0} prefix="Z"></NumberField>
    </StyledInputContainer>
  );
});

export const InputVector3 = (props: { label: string }) => (
  <PanelItemContainer>
    <PanelItemLabel>{props.label}</PanelItemLabel>
    <PanelItemValue>
      <BasicInputVector3 />
    </PanelItemValue>
  </PanelItemContainer>
);