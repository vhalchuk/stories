import { Flex } from "@chakra-ui/react";
import { StoryGroups } from "./modules/story-groups";
import { Shorts } from "./modules/shorts";
import { shorts, storyGroups } from "./data";

export default function App() {
  return (
    <Flex flexDirection="column" gap="2rem" maxW="100vw">
      <StoryGroups storyGroups={storyGroups} />
      <Shorts shorts={shorts} />
    </Flex>
  );
}
