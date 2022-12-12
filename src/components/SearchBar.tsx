import { styled } from "../theme/stitches.config";
import { StyledInput } from "./StyledInput";
import SearchIcon from "@mui/icons-material/Search";
import { CSS } from "@stitches/react/types/css-util";

const StyledSearchBar = styled("div", {
  margin: "$1b $2b 0 $2b",
  height: "$space$4",
  marginBottom: "$2b",
  color: "$white80",
  position: "relative",
  width: "100%",
});

export const SearchBar = (props: { onChange?: (v: string) => void, css?: CSS } ) => {
  return (
    <StyledSearchBar css={props.css}>
      <SearchIcon
        sx={{
          width: 16,
          height: 32,
          marginLeft: "8px",
          color: "rgba(255, 255, 255, .3)",
          position: "absolute",
        }}
      ></SearchIcon>
      <StyledInput
        onChange={(e) => {
          props.onChange && props.onChange(e.currentTarget.value);
        }}
        placeholder="Search"
        css={{ paddingLeft: 32, boxSizing: "border-box", height: 32 }}
      ></StyledInput>
    </StyledSearchBar>
  );
};
