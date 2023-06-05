import { Flex } from "@chakra-ui/react";
import { StoryGroups } from "./modules/story-groups";

export default function App() {
  return (
    <Flex flexDirection="column" gap="2rem" width="100%">
      <StoryGroups />
    </Flex>
  );
}
