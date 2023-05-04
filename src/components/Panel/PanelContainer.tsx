import React, { PropsWithChildren } from "react";
import { styled } from "../../theme/stitches.config";
import { PanelContainerColumn } from "./PanelContainerColumn";
import { PanelHeader } from "./PanelHeader";

const StyledPanelContainer = styled("div", {
  padding: "16px 0",
  borderBottom: "1px solid hsla(0,0%,100%,0.05)",
  "&:hover": {
    backgroundColor: "$colors$bgHover",
  },
});

export const PanelContainer = (props: PropsWithChildren<{ title?: string }>) => {
  return (
    <StyledPanelContainer>
      <PanelHeader>{props.title}</PanelHeader>
      <PanelContainerColumn>{props.children}</PanelContainerColumn>
    </StyledPanelContainer>
  );
};
