import Slider from "@mui/material/Slider";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import React, { CSSProperties } from "react";
import IconButton from "@mui/material/IconButton";
import { Select } from "./Select";
// import { Select } from "antd";
// import Select from "@mui/material/Select";

/** in seconds */
function formatDuration(value: number) {
  const minute = Math.floor(value / 60);
  const secondLeft = value - minute * 60;
  return `${minute}:${
    secondLeft < 10 ? `0${secondLeft.toFixed(2)}` : secondLeft.toFixed(2)
  }`;
}

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
  color: "#fff",
});

interface IOptions {
  animationClips: {
    name: string;
    /** Animation length in seconds. */
  }[];
  duration: number;
  selectedClipIndex?: number;
  sliderPosition?: number;
  isPaused?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSlider?: (time: number) => void;
  onClipSelected?: (index: number) => void;
  style?: CSSProperties;
}

export function AnimationPlayer(props: IOptions) {
  const [position, setPosition] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const mainIconColor = "#fff";
  const {
    animationClips,
    sliderPosition,
    onSlider,
    selectedClipIndex,
    duration,
  } = props;
  const isPositionControlled = sliderPosition == undefined ? false : true;
  const isPausedControlled = props.isPaused == undefined ? false : true;

  const finalPosition = isPositionControlled ? sliderPosition : position;
  const finalPaused = isPausedControlled ? props.isPaused : paused;

  return (
    <div style={props.style}>
      <div
        style={{
          width: 460,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          borderRadius: 8,
          paddingLeft: -5,
          paddingRight: 15,
          maxWidth: "100%",
          margin: "auto",
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <IconButton
          aria-label={finalPaused ? "play" : "pause"}
          onClick={() => {
            if (!isPausedControlled) {
              setPaused(!finalPaused);
            }
            if (finalPaused) {
              props.onPlay && props.onPlay();
            } else {
              props.onPause && props.onPause();
            }
          }}
          sx={{}}
        >
          {finalPaused ? (
            <PlayArrowRounded
              sx={{ fontSize: "1.5rem" }}
              htmlColor={mainIconColor}
            />
          ) : (
            <PauseRounded
              sx={{ fontSize: "1.5rem" }}
              htmlColor={mainIconColor}
            />
          )}
        </IconButton>
        <Select
          selectedIndex={selectedClipIndex}
          onChange={(e) => {
            props.onClipSelected &&
              props.onClipSelected(Number(e.target.value));
          }}
          style={{ marginRight: 8, maxWidth: 120 }}
        >
          {animationClips.map((clip, index) => (
            <option key={index} value={index}>
              {clip.name}
            </option>
          ))}
        </Select>
        <div style={{ width: 300 }}>
          <Slider
            aria-label="time-indicator"
            size="small"
            value={finalPosition}
            min={0}
            step={0.01}
            max={duration}
            onChange={(_, value: number) => {
              if (isPositionControlled) {
                onSlider && onSlider(value);
              } else {
                setPosition(value as number);
              }
            }}
            sx={{
              // color: theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
              color: "#fff",
              height: 4,
              "& .MuiSlider-thumb": {
                transition: "none",
                width: 8,
                height: 8,
                "&:before": {
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
                },
                "&.Mui-active": {
                  width: 20,
                  height: 20,
                },
              },
              "& .MuiSlider-rail": {
                opacity: 0.28,
              },
              "& .MuiSlider-track": {
                transition: "none",
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: -2,
            }}
          >
            <TinyText>{formatDuration(finalPosition)}</TinyText>
            <TinyText>-{formatDuration(duration - finalPosition)}</TinyText>
          </Box>
        </div>
      </div>
    </div>
  );
}
