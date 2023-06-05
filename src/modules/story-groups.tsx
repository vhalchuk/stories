import "../App.css";
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
import { FC, memo, useEffect, useRef, useState } from "react";
import { Cube } from "../dependencies/Cube";
import { CloseIcon } from "@chakra-ui/icons";
import { useLatestRef } from "../dependencies/useLatestRef";
import { useCallbackRef } from "../dependencies/useCallbackRef";

type Story = {
  id: string;
  type: "video" | "image";
  src: string;
};

type StoryGroup = {
  id: string;
  title: string;
  stories: Story[];
  src: string;
};

const storyGroups: StoryGroup[] = [
  {
    id: "1",
    title: "Story group #1",
    src: "story-1.jpg",
    stories: [
      {
        id: "1",
        type: "image",
        src: "story-1.jpg",
      },
      {
        id: "2",
        type: "image",
        src: "story-2.jpg",
      },
    ],
  },
  {
    id: "2",
    title: "Story group #2",
    src: "story-2.jpg",
    stories: [
      {
        id: "3",
        type: "image",
        src: "story-3.jpg",
      },
      {
        id: "4",
        type: "image",
        src: "story-4.jpg",
      },
      {
        id: "5",
        type: "image",
        src: "story-5.jpg",
      },
      {
        id: "6",
        type: "image",
        src: "story-6.jpg",
      },
      {
        id: "7",
        type: "image",
        src: "story-7.jpg",
      },
    ],
  },
  {
    id: "3",
    title: "Story group #3",
    src: "story-3.jpg",
    stories: [
      {
        id: "8",
        type: "image",
        src: "story-8.jpg",
      },
      {
        id: "9",
        type: "image",
        src: "story-9.jpg",
      },
      {
        id: "10",
        type: "image",
        src: "story-10.jpg",
      },
    ],
  },
  {
    id: "4",
    title: "Story group #4",
    src: "story-4.jpg",
    stories: [
      {
        id: "8",
        type: "video",
        src: "video/story-1.mp4",
      },
      {
        id: "9",
        type: "video",
        src: "video/story-2.mp4",
      },
      {
        id: "10",
        type: "video",
        src: "video/story-3.mp4",
      },
    ],
  },
  {
    id: "5",
    title: "Story group #5",
    src: "story-5.jpg",
    stories: [
      {
        id: "11",
        type: "video",
        src: "video/story-1.mp4",
      },
      {
        id: "12",
        type: "image",
        src: "story-1.jpg",
      },
      {
        id: "13",
        type: "video",
        src: "video/story-2.mp4",
      },
      {
        id: "14",
        type: "image",
        src: "story-2.jpg",
      },
      {
        id: "15",
        type: "video",
        src: "video/story-3.mp4",
      },
    ],
  },
];

type Subscriber<T extends unknown[]> = (...args: T) => void;

class PubSub<T extends unknown[]> {
  #subscribers: Subscriber<T>[] = [];

  subscribe(subscriber: Subscriber<T>) {
    this.#subscribers.push(subscriber);

    return () => this.unsubscribe(subscriber);
  }

  unsubscribe(subscriber: Subscriber<T>) {
    this.#subscribers = this.#subscribers.filter((sub) => sub !== subscriber);
  }

  publish(...args: T) {
    for (const subscriber of this.#subscribers) {
      subscriber(...args);
    }
  }
}

const pauseVideoPubSub = new PubSub();
const unpauseVideoPubSub = new PubSub();

export const StoryGroups: FC = () => {
  const [storyGroupIndex, setStoryGroupIndex] = useState<null | number>(null);

  const isOpen = storyGroupIndex !== null;
  const handleClose = () => {
    setStoryGroupIndex(null);
  };

  return (
    <Flex justify="space-between" gap="0.5rem" padding="1rem" width="100%">
      {storyGroups.map((storyGroup, index) => (
        <Circle
          key={storyGroup.id}
          size="40px"
          bg={`url(${storyGroup.src})`}
          bgSize="cover"
          cursor="pointer"
          onClick={() => setStoryGroupIndex(index)}
        />
      ))}
      <Modal isOpen={isOpen} onClose={handleClose} size="full">
        <ModalContent>
          <Cube
            index={
              /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
              storyGroupIndex!
            }
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
                  handleClose();
                }
              };

              return (
                <StoryGroup
                  key={storyGroup.id}
                  storyGroup={storyGroup}
                  onNoPreviousStory={handleNoPreviousStory}
                  onNoNextStory={handleNoNextStory}
                  onClose={handleClose}
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
    </Flex>
  );
};

const UPDATE_PROGRESS_EVERY_MS = 300;

const StoryGroup: FC<{
  storyGroup: StoryGroup;
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
