import { useRootStore } from "@/store/RootStore";
import { observer } from "mobx-react-lite";
import { CSSProperties } from "react";
import { AnimationPlayer } from "./AnimationPlayer";

export const ObservedAnimationPlayer = observer(function (props: {
  style?: CSSProperties;
}) {
  const { glTFResource, animationStore, isFullScreen } = useRootStore();
  const hasAnimations =
    glTFResource.animations && glTFResource.animations.length > 0;

  return (
    <>
      {hasAnimations && !isFullScreen ? (
        <AnimationPlayer
          style={props.style}
          isPaused={!animationStore.isPlaying}
          duration={animationStore.duration}
          onPause={() => {
            animationStore.pauseAnimation();
          }}
          onPlay={() => {
            animationStore.playAnimation();
          }}
          animationClips={glTFResource.animations.map((item) => {
            return {
              name: item.name,
              duration: item.length,
            };
          })}
          sliderPosition={animationStore.frameTime}
          onSlider={function (time: number): void {
            animationStore.setFrameTime(time);
          }}
          selectedClipIndex={animationStore.selectedIndex}
          onClipSelected={(index) => {
            animationStore.selectAnimation(index);
          }}
        />
      ) : null}
    </>
  );
});
