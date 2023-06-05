import { type FC, useEffect, useRef, useState } from "react";
import { type Short as ShortT, StoryGroup } from "../types";
import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import { StoriesModal } from "../dependencies/Story";

export const Shorts: FC<{ shorts: ShortT[] }> = ({ shorts }) => {
  const [storyGroupIndex, setStoryGroupIndex] = useState<null | number>(null);

  const isOpen = storyGroupIndex !== null;
  const handleClose = () => {
    setStoryGroupIndex(null);
  };
  const storyGroups = shorts.map<StoryGroup>((short) => short.storyGroup);

  return (
    <Flex
      gap="1rem"
      padding="1rem"
      overflowX="auto"
      css={{
        msOverflowStyle: "none" /* IE and Edge */,
        scrollbarWidth: "none" /* Firefox */,

        "&::-webkit-scrollbar": {
          /* Chrome, Safari and Opera*/ display: "none",
        },
      }}
    >
      {shorts.map((short, index) => {
        const story = short.storyGroup.stories[0];

        return (
          <Short
            id={short.id}
            key={short.id}
            published={short.published}
            title={short.title}
            src={story.src}
            type={story.type}
            onClick={() => setStoryGroupIndex(index)}
          />
        );
      })}
      <StoriesModal
        storyGroups={storyGroups}
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        storyGroupIndex={storyGroupIndex!}
        setStoryGroupIndex={setStoryGroupIndex}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </Flex>
  );
};

const Short: FC<{
  id: string;
  src: string;
  published: string;
  title: string;
  type: "video" | "image";
  onClick: () => void;
}> = ({ src, published, title, type, onClick }) => {
  return (
    <Box
      style={{
        backgroundColor: "#3a3a3a",
        position: "relative",
        height: "256px",
        width: "154px",
        borderRadius: "0.5rem",
        flexShrink: 0,
      }}
      onClick={onClick}
    >
      {type === "image" ? <ImageBg src={src} /> : <VideoBg src={src} />}
      <Box
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          borderRadius: "0.5rem",
          padding: "0.5rem",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Badge>{published}</Badge>
          </Box>
          <Box>
            <Text color="white">{title}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const ImageBg: FC<{ src: string }> = ({ src }) => {
  return (
    <img
      src={src}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "0.5rem",
      }}
      loading="lazy"
      alt="Short"
    />
  );
};

const VideoBg: FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadingSpinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // If the video is in viewport, play the video
            video?.play();
          } else {
            // If the video is not in viewport, pause the video
            video?.pause();
          }
        });
      },
      {
        threshold: 0.5, // Trigger callback when 50% of the video is in the viewport
      }
    );
    if (video) {
      observer.observe(video);
    }

    // Cleanup function
    return () => {
      if (video) {
        observer.unobserve(video);
      }
    };
  }, []);

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
      muted={true}
      loop={true}
    />
  );
};
