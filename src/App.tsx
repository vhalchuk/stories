import "./App.css";
import { Box, Circle, Flex, IconButton, Spinner, Text } from "@chakra-ui/react";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Cube } from "./dependencies/Cube";
import { CloseIcon } from "@chakra-ui/icons";
import { useLatestRef } from "./dependencies/useLatestRef";
import { useCallbackRef } from "./dependencies/useCallbackRef";

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
    src: "story-group-1.jpeg",
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
    src: "story-group-1.jpeg",
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
    src: "story-group-1.jpeg",
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
    src: "story-group-1.jpeg",
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
];

const Modal: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box
      style={{
        position: "absolute",
        inset: 0,
        height: "100%",
        width: "100%",
        zIndex: 1000,
        backgroundColor: "white",
      }}
    >
      {children}
    </Box>
  );
};

type Subscriber<T extends any[]> = (...args: T) => void;

class PubSub<T extends any[]> {
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

const moveStartedPubSub = new PubSub();
const moveEndedPubSub = new PubSub();

function App() {
  const [storyGroupIndex, setStoryGroupIndex] = useState<null | number>(null);

  const onClose = () => {
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
      {storyGroupIndex !== null && (
        <Modal>
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
              moveStartedPubSub.publish();
            }}
            onMoveEnd={() => {
              moveEndedPubSub.publish();
            }}
          />
        </Modal>
      )}
    </Flex>
  );
}

const UPDATE_PROGRESS_EVERY_MS = 500;

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
  }, [progress]);

  const ContentBackground: ContentBackground =
    story.type === "image" ? ImageBackground : VideoBackground;

  return (
    <Box backgroundColor="#3a3a3a" width="100%" height="100%">
      <ContentBackground
        src={story.src}
        active={isActiveStoryGroup}
        setProgress={setProgress}
      >
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
      </ContentBackground>
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

type ContentBackground = FC<{
  src: string;
  children: ReactNode;
  active: boolean;
  setProgress: (progress: number | ((prevProgress: number) => number)) => void;
}>;

const ImageBackground: ContentBackground = ({
  src,
  setProgress,
  active,
  children,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;

    if (!image || !active) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startProgressInterval = () => {
      intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          // Increase the progress by 10% every UPDATE_PROGRESS_EACH_MS
          const newProgress = prevProgress + 10;
          return newProgress <= 100 ? newProgress : 100;
        });
      }, UPDATE_PROGRESS_EVERY_MS);
    };

    if (image.complete) {
      startProgressInterval();
    } else {
      image.addEventListener("load", startProgressInterval);
    }

    return () => {
      image.removeEventListener("load", startProgressInterval);
      intervalId && clearInterval(intervalId);
    };
  }, [active, src]);

  return (
    <Box
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
      }}
    >
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
      {children}
    </Box>
  );
};

const VideoBackground: ContentBackground = ({
  src,
  active,
  setProgress,
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadingSpinnerRef = useRef<HTMLDivElement>(null);
  const activeRef = useLatestRef(active);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.ontimeupdate = (event) => {
        const currentTime =
          (event.currentTarget as HTMLVideoElement)?.currentTime || 0;
        const duration =
          (event.currentTarget as HTMLVideoElement)?.duration || 0;
        const progress = (currentTime / duration) * 100;

        if (Number.isNaN(progress)) return;

        setProgress(progress);
      };
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    return moveStartedPubSub.subscribe(() => {
      if (video) {
        video.pause();
      }
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    return moveEndedPubSub.subscribe(() => {
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
    <Box
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
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
      {children}
    </Box>
  );
};

export default App;
