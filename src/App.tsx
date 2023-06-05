import { Flex } from "@chakra-ui/react";
import { StoryGroups } from "./modules/story-groups";
import { Shorts } from "./modules/shorts";

export default function App() {
  return (
    <Flex flexDirection="column" gap="2rem" maxW="100vw">
      <StoryGroups />
      <Shorts />
    </Flex>
  );
}
