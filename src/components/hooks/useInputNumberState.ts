import React, { ChangeEvent, FocusEventHandler, MutableRefObject, useCallback, useEffect } from "react";

interface InputNumberStateOptions {
  value?: number;
  defaultValue?: string | number | ReadonlyArray<string> | undefined;
  onChange?(val: number): void;
  fallbackVal?: number;
}

interface InputNumberProps {
  ref: React.MutableRefObject<HTMLInputElement>;
  onChange?(e: ChangeEvent<HTMLInputElement>): void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  value?: string;
  defaultValue?: string | number | ReadonlyArray<string> | undefined;
}

export function useInputNumberState(props: InputNumberStateOptions): InputNumberProps {
  const ref = React.useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>;
  const [value, setVal] = React.useState(props.value + "");
  const { fallbackVal = 0, onChange: onChangeProps } = props;
  const isControlled = props.value !== undefined;
  const result: InputNumberProps = { ref, defaultValue: props.defaultValue };

  function triggerOnChange(value: number) {
    if (value !== props.value && onChangeProps) onChangeProps(value);
  }

  const showNumber = ref.current === document.activeElement ? value : props.value + "";

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === "") {
        triggerOnChange(fallbackVal);
      } else {
        triggerOnChange(Number(e.target.value));
      }
      setVal(e.target.value);
    },
    [onChangeProps]
  );

  const onBlur = useCallback(
    (e) => {
      if (e.target.value === "") {
        triggerOnChange(fallbackVal);
        setVal(fallbackVal.toString());
      }
    },
    [onChangeProps]
  );

  if (isControlled) {
    result.onChange = onChange;
    result.onBlur = onBlur;
    result.value = showNumber;
  }

  return result;
}
