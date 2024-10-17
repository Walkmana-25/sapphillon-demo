import {
  Flex,
  Box,
  Center,
  Icon,
  Input,
  Heading,
  VStack,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { TbDog } from "react-icons/tb";
import { useState } from "react";

function Home() {
  const [searchText, setSearchText] = useState("");
  const [searchIsNull, setSearchIsNull] = useState(false);
  const toast = useToast();

  const searchBox = () => {
    if (searchIsNull) {
      return (
        <Input
          w="85%"
          h="50"
          borderColor={"gray.300"}
          bg="gray.100"
          placeholder="Search With Sapphillon"
          variant={"outline"}
          isInvalid
          errorBorderColor="crimson"
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        ></Input>
      );
    } else {
      return (
        <Input
          w="85%"
          h="50"
          borderColor={"gray.300"}
          bg="gray.100"
          placeholder="Search With Sapphillon"
          variant={"outline"}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        ></Input>
      );
    }
  };

  const doSearch = () => {
    if (searchText === "") {
      toast({
        title: "Search is empty",
        position: "top-right",
        description: "Please enter a search term",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setSearchIsNull(true);
    } else {
      setSearchIsNull(false);
    }
  };

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
            <Button
              m="3"
              colorScheme="blackAlpha"
              onClick={() => {
                doSearch();
              }}
            >
              <Text fontSize={20}>Go!</Text>
            </Button>
          </VStack>
        </Center>
      </Box>
    </>
  );
}

export default Home;
