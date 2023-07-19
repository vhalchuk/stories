import { Box, Flex, Text } from "@chakra-ui/react";
import { Shorts } from "./modules/shorts";
import { shorts } from "./data";

export default function App() {
  return (
    <Flex flexDirection="column" maxW="100vw" minH="100dvh">
      <Box padding="1rem">
        <Text>Muted, infinite loop playing</Text>
      </Box>
      <Shorts shorts={shorts} />
      {/*<Box padding="1rem">*/}
      {/*  <Text>Paused</Text>*/}
      {/*</Box>*/}
      {/*<Shorts shorts={shorts} paused />*/}
    </Flex>
  );
}
