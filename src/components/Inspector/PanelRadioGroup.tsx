import React from "react";
import { styled } from "../../theme/stitches.config";
import { IRadioGroupProps, RadioGroup } from "../input/RadioGroup";
import { PanelItemContainer } from "../Panel/PanelItemContainer";
import { PanelItemLabel } from "../Panel/PanelItemLabel";
import { PanelItemValue } from "../Panel/PanelItemValue";

export const PanelRadioGroup = (props: { label: string } & IRadioGroupProps) => (
  <PanelItemContainer>
    <PanelItemLabel>{props.label}</PanelItemLabel>
    <PanelItemValue>
      <RadioGroup {...props} />
    </PanelItemValue>
  </PanelItemContainer>
);