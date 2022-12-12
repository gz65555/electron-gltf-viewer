import { CSS, styled } from "@stitches/react"

// helper function which infers keys and restricts values to ElementType
const asCSSRecord = <T>(et: { [K in keyof T]: CSS }) => et;

export const InputStyle = asCSSRecord({
  input: {
    appearance: "none",
    backgroundColor: "$colors$white03",
    padding: "$1 $2",
    borderRadius: "$1",
    outline: "none",
    lineHeight: "1rem",
    width: "100%",
    height: "100%",
    borderWidth: 0,
    borderColor: "$gray500",
    color: "$input-text",
    fontSize: "$1",
    [`&[with-prefix="true"]`]: {
      paddingLeft: "$3",
      paddingRight: "$1",
      letterSpacing: "-0.5px",
    },
  },
  inputHover: {
    "&:hover": {
      backgroundColor: "$white06",
    },
  },
  inputFocused: {
    "&:focus": {
      boxShadow: "inset 0 0 0 1px $colors$blue",
    },
  },
  inputSelected: {
    [`&[is-selected="true"]`]: {
      color: "white",
      backgroundColor: "$colors$blue"
    },
  },
});

