import React from "react";

export interface IRadioGroupProps {
  selectedKey?: string;
  defaultSelectedKey?: string;
  onChange?: (key: string) => void;
}

export function useRadioGroupState(props: IRadioGroupProps) {
  const {selectedKey, defaultSelectedKey, onChange} = props
  const isControlled = selectedKey !== undefined;
  const [selectedKeyState, setSelectedKeyState] = React.useState(defaultSelectedKey);

  if(isControlled) {
    return {
      selectedKey,
      onChange: props.onChange,
    };
  } else {
    return {
      selectedKey: selectedKeyState,
      onChange: (key) => setSelectedKeyState(key),
    };
  }
}