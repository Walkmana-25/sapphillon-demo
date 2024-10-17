import {
  Flex,
  Box,
  Center,
  Icon,
  Input,
  Heading,
  VStack,
  Button,
  Text
} from "@chakra-ui/react";
import { TbDog } from "react-icons/tb";

const searchBox = () => {
  return (
    <Input
      w="85%"
      h="50"
      borderColor={"gray.300"}
      bg="gray.100"
      placeholder="Search With Sapphillon"
      variant={"outline"}
    ></Input>
  )

}

function App() {
  return (
    <>
      <title>Sapphillon Demo</title>
      <Box h="calc(100vh)" w="calc(100vw)" bg="gray.100">
        <Center h="100%">
          <VStack>
            <Flex m="10">
              <Icon
                as={TbDog}
                boxSize={{ base: "85", sm: "70" }}
                m={{ base: "7", sm: "5" }}
                color="blue.500"
              />
              <Center>
                <Heading
                  as="h1"
                  fontSize={{ base: "30", sm: "50" }}
                  justifyContent={"center"}
                >
                  Sapphillon Demo
                </Heading>
              </Center>
            </Flex>
            {searchBox()}
            <Button m="3" colorScheme="blackAlpha"><Text fontSize={20}>Go!</Text></Button>
          </VStack>
        </Center>
      </Box>
    </>
  );
}

export default App;
