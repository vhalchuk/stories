import "../App.css";
import { Circle, Flex } from "@chakra-ui/react";
import { FC, useState } from "react";
import { type StoryGroup as StoryGroupT } from "../types";
import { StoriesModal } from "../dependencies/Story";

export const StoryGroups: FC<{ storyGroups: StoryGroupT[] }> = ({
  storyGroups,
}) => {
  const [storyGroupIndex, setStoryGroupIndex] = useState<null | number>(null);

  const isOpen = storyGroupIndex !== null;
  const handleClose = () => {
    setStoryGroupIndex(null);
  };

  return (
    <Flex gap="0.5rem" padding="1rem">
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
