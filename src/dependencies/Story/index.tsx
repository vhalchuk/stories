import { type FC, memo, useEffect, useRef, useState } from "react";
import {
  Box,
  Circle,
  Flex,
  IconButton,
  Modal,
  ModalContent,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Cube } from "../Cube";
import { StoryGroup as StoryGroupT } from "../../types";
import { useCallbackRef } from "../useCallbackRef";
import { CloseIcon } from "@chakra-ui/icons";
import { useLatestRef } from "../useLatestRef";
import { PubSub } from "../PubSub";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  storyGroupIndex: number;
  setStoryGroupIndex: (index: number) => void;
  storyGroups: StoryGroupT[];
};

const pauseVideoPubSub = new PubSub();
const unpauseVideoPubSub = new PubSub();

export const StoriesModal: FC<Props> = ({
  isOpen,
  onClose,
  storyGroupIndex,
  setStoryGroupIndex,
  storyGroups,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalContent>
        <Cube
          index={storyGroupIndex}
          onChange={setStoryGroupIndex}
          hasNext={(index) => index < storyGroups.length - 1}
          lockScrolling
          width={window.innerWidth}
          height={window.innerHeight}
          scaleRange={[1, 0.97]}
          paneStyle={{
            padding: 0,
          }}
          renderItem={(index) => {
            const storyGroup = storyGroups[index];

            if (!storyGroup) return null;

            const handleNoPreviousStory = () => {
              const previousStoryGroupIndex = index - 1;
              const hasPreviousStoryGroup =
                !!storyGroups[previousStoryGroupIndex];
              if (hasPreviousStoryGroup) {
                setStoryGroupIndex(previousStoryGroupIndex);
              }
            };

            const handleNoNextStory = () => {
              const nextStoryGroupIndex = index + 1;
              const hasNextStoryGroup = !!storyGroups[nextStoryGroupIndex];
              if (hasNextStoryGroup) {
                setStoryGroupIndex(nextStoryGroupIndex);
              } else {
                onClose();
              }
            };

            return (
              <StoryGroup
                key={storyGroup.id}
                storyGroup={storyGroup}
                onNoPreviousStory={handleNoPreviousStory}
                onNoNextStory={handleNoNextStory}
                onClose={onClose}
                isActiveStoryGroup={storyGroupIndex === index}
              />
            );
          }}
          onMoveStart={() => {
            pauseVideoPubSub.publish();
          }}
          onMoveEnd={() => {
            unpauseVideoPubSub.publish();
          }}
        />
      </ModalContent>
    </Modal>
  );
};

const UPDATE_PROGRESS_EVERY_MS = 300;

const StoryGroup: FC<{
  storyGroup: StoryGroupT;
  onNoPreviousStory: () => void;
  onNoNextStory: () => void;
  onClose: () => void;
  isActiveStoryGroup: boolean;
}> = ({
  storyGroup,
  onNoPreviousStory,
  onNoNextStory,
  onClose,
  isActiveStoryGroup,
}) => {
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const story = storyGroup.stories[storyIndex];

  const handlePreviousTap = () => {
    const previousIndex = storyIndex - 1;
    const hasPreviousStory = !!storyGroup.stories[previousIndex];

    if (hasPreviousStory) {
      setStoryIndex(previousIndex);
      setProgress(0);
    } else {
      onNoPreviousStory();
    }
  };

  const handleNextTap = useCallbackRef(() => {
    const nextIndex = storyIndex + 1;
    const hasNextStory = !!storyGroup.stories[nextIndex];

    if (hasNextStory) {
      setStoryIndex(nextIndex);
      setProgress(0);
    } else {
      onNoNextStory();
    }
  });

  useEffect(() => {
    if (progress === 100) {
      setTimeout(handleNextTap, UPDATE_PROGRESS_EVERY_MS);
    }
  }, [progress, handleNextTap]);

  const Content: ContentComponent =
    story.type === "image" ? ImageContent : VideoContent;

  return (
    <Box backgroundColor="#3a3a3a" width="100%" height="100%">
      <Box
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
        }}
      >
        <Content
          src={story.src}
          active={isActiveStoryGroup}
          setProgress={setProgress}
        />
        <Box
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            color: "white",
            padding: "0.5rem",
          }}
        >
          <Flex gap="2px">
            {storyGroup.stories.map((story, index) => {
              const isPast = index < storyIndex;
              const isCurrent = index === storyIndex;
              const storyProgress = isPast ? 100 : isCurrent ? progress : 0;
              const hasTransition = progress !== 0;

              return (
                <ProgressLine
                  key={story.id}
                  progress={storyProgress}
                  hasTransition={hasTransition}
                />
              );
            })}
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text>{storyGroup.title}</Text>
            <IconButton
              onClick={onClose}
              size="sm"
              aria-label="Close"
              variant="unstyled"
            >
              <CloseIcon />
            </IconButton>
          </Flex>
          <Flex flexGrow={1}>
            <Box height="100%" width="50%" onClick={handlePreviousTap} />
            <Box height="100%" width="50%" onClick={handleNextTap} />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

const ProgressLine: FC<{ progress: number; hasTransition: boolean }> = ({
  progress,
  hasTransition,
}) => {
  return (
    <Box
      style={{
        width: "100%",
        height: "2px",
        borderRadius: "1px",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
      }}
    >
      <Box
        style={{
          width: `${progress}%`,
          height: "2px",
          borderRadius: "1px",
          backgroundColor: "white",
          transition: hasTransition
            ? `width ${UPDATE_PROGRESS_EVERY_MS}ms linear`
            : undefined,
        }}
      ></Box>
    </Box>
  );
};

type ContentComponent = FC<{
  src: string;
  active: boolean;
  setProgress: (progress: number | ((prevProgress: number) => number)) => void;
}>;

const ImageContent: ContentComponent = memo(({ src, setProgress, active }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;

    if (!image || !active) return;

    let isPaused = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startProgressInterval = () => {
      const IMAGE_STORY_SHOW_TIME_MS = 10_000; // 10 seconds
      const numberOfIntervals =
        IMAGE_STORY_SHOW_TIME_MS / UPDATE_PROGRESS_EVERY_MS;
      const updatePercent = 100 / numberOfIntervals;

      intervalId = setInterval(() => {
        if (isPaused) return;

        setProgress((prevProgress) => {
          const newProgress = prevProgress + updatePercent;
          return newProgress <= 100 ? newProgress : 100;
        });
      }, UPDATE_PROGRESS_EVERY_MS);
    };

    if (image.complete) {
      startProgressInterval();
    } else {
      image.addEventListener("load", startProgressInterval);
    }

    const unsubscribeFromMoveStarted = pauseVideoPubSub.subscribe(() => {
      isPaused = true;
    });
    const unsubscribeFromMoveEnded = unpauseVideoPubSub.subscribe(() => {
      isPaused = false;
    });

    return () => {
      image.removeEventListener("load", startProgressInterval);
      intervalId && clearInterval(intervalId);
      unsubscribeFromMoveStarted();
      unsubscribeFromMoveEnded();
      setProgress(0);
    };
  }, [active, src, setProgress]);

  return (
    <img
      ref={imageRef}
      src={src}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
      loading="lazy"
      alt="Story"
    />
  );
});

const VideoContent: ContentComponent = memo(({ src, active, setProgress }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadingSpinnerRef = useRef<HTMLDivElement>(null);
  const activeRef = useLatestRef(active);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.ontimeupdate = (event) => {
        const video = event.currentTarget as HTMLVideoElement;

        const CUT_VIDEO_ENDING_SECONDS = 1;

        const currentTimeSeconds = video.currentTime || 0;
        const durationSeconds = video.duration
          ? video.duration - CUT_VIDEO_ENDING_SECONDS // because state update happens later than video finishes
          : 0;
        const progress = (currentTimeSeconds / durationSeconds) * 100;

        if (Number.isNaN(progress)) return;

        function clamp(value: number, min: number, max: number) {
          return Math.min(Math.max(value, min), max);
        }
        const clampedValue = clamp(progress, 0, 100);

        setProgress(clampedValue);
      };
    }
  }, [setProgress]);

  useEffect(() => {
    const video = videoRef.current;

    return pauseVideoPubSub.subscribe(() => {
      if (video) {
        video.pause();
      }
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    return unpauseVideoPubSub.subscribe(() => {
      if (video && activeRef.current) {
        video.play();
      }
    });
  }, [activeRef]);

  // AUTO-PLAY
  useEffect(() => {
    const video = videoRef.current;

    if (active && video) {
      video.play();
    }

    return () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, [active, src]);

  // MANAGE LOADING STATE
  useEffect(() => {
    const video = videoRef.current;
    const loadingSpinner = loadingSpinnerRef.current;

    const handleWaiting = () => {
      if (loadingSpinner) {
        loadingSpinner.style.display = "grid";
      }
    };

    const handleCanPlay = () => {
      if (loadingSpinner) {
        loadingSpinner.style.display = "none";
      }
    };

    if (video) {
      video.onwaiting = handleWaiting;
      video.oncanplay = handleCanPlay;
    }
  }, [src]);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          inset: 0,
          objectFit: "cover",
        }}
        controls={false}
        autoPlay={false}
        playsInline
      />
      <div
        ref={loadingSpinnerRef}
        style={{
          display: "none",
          position: "absolute",
          height: "100%",
          width: "100%",
          inset: 0,
          placeItems: "center",
        }}
      >
        <Circle backgroundColor="rgba(0,0,0,0.5)" padding="0.625rem">
          <Spinner size="md" color="white" speed="0.75s" />
        </Circle>
      </div>
    </>
  );
});
