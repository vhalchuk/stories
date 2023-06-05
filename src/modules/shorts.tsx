import { type FC, useEffect, useRef } from "react";
import { type Short as ShortT } from "../types";
import { Badge, Box, Flex, Text } from "@chakra-ui/react";

const shorts: ShortT[] = [
  {
    id: "1",
    type: "image",
    src: "story-1.jpg",
    title: "story-1.jpg",
    published: "1 min ago",
  },
  {
    id: "2",
    type: "image",
    src: "story-2.jpg",
    title: "story-2.jpg",
    published: "1 min ago",
  },
  {
    id: "8",
    type: "video",
    src: "video/story-1.mp4",
    title: "video/story-1.mp4",
    published: "1 min ago",
  },
  {
    id: "9",
    type: "video",
    src: "video/story-2.mp4",
    title: "video/story-2.mp4",
    published: "1 min ago",
  },
  {
    id: "10",
    type: "video",
    src: "video/story-3.mp4",
    title: "video/story-3.mp4",
    published: "1 min ago",
  },
  {
    id: "11",
    type: "video",
    src: "video/story-1.mp4",
    title: "video/story-1.mp4",
    published: "1 min ago",
  },
  {
    id: "12",
    type: "image",
    src: "story-1.jpg",
    title: "story-1.jpg",
    published: "1 min ago",
  },
  {
    id: "13",
    type: "video",
    src: "video/story-2.mp4",
    title: "video/story-2.mp4",
    published: "1 min ago",
  },
  {
    id: "14",
    type: "image",
    src: "story-2.jpg",
    title: "story-2.jpg",
    published: "1 min ago",
  },
  {
    id: "15",
    type: "video",
    src: "video/story-3.mp4",
    title: "video/story-3.mp4",
    published: "1 min ago",
  },
];

export const Shorts: FC = () => {
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
      {shorts.map((short) => {
        return <Short key={short.id} short={short} />;
      })}
    </Flex>
  );
};

const Short: FC<{
  short: ShortT;
}> = ({ short }) => {
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
    >
      {short.type === "image" ? (
        <ImageBg src={short.src} />
      ) : (
        <VideoBg src={short.src} />
      )}
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
            <Badge>{short.published}</Badge>
          </Box>
          <Box>
            <Text color="white">{short.title}</Text>
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
