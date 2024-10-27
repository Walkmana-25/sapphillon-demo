import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    Box,
    Input,
    Flex,
    HStack,
    Icon,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Button,
    useToast,
    Spinner,
    Text,
    VStack,
    Center
} from '@chakra-ui/react';
import { TbDog } from "react-icons/tb";
import { LuSearch } from 'react-icons/lu';

interface url {
    url: string;
    summary: string;
}

interface SearchResult {
    summary: string;
    urls: url[];
}

function SearchView() {
    const toast = useToast();

    const [loadState, setLoadState] = useState(true);

    const [searchParams] = useSearchParams();
    const searchParam = searchParams.get('q');
    
    const apiEndpoint = import.meta.env.API_ENDPOINT

    const [searchText, setSearchText] = useState(searchParam ?? "");
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

    const navBar = () => {
        return (
            <Box bg={"gray.100"} px={"10px"}>
                <Flex h={"8vh"} alignItems={"center"} justifyContent={"space-between"}>
                    <HStack as="a" href="/" display="flex">
                        <Icon as={TbDog} color="blue.500" boxSize={"8"} />
                        <Box>Sapphillon Search Demo</Box>
                    </HStack>
                    <HStack>
                        <InputGroup flex="1">
                            <InputLeftElement children={<LuSearch />} />
                            <Input
                                defaultValue={searchParam ?? ""}
                                onChange={(e) => { setSearchText(e.target.value) }}
                                bg={"gray.200"}
                                border={"black"}
                                w={"500"}
                            />
                            <InputRightElement children={
                                <Button
                                    onClick={() => {
                                        if (searchText === searchParam) {
                                            toast({
                                                title: "Error",
                                                position: "bottom-right",
                                                description: "Search query is the same as the current query.",
                                                status: "error",
                                                duration: 5000,
                                                isClosable: true,
                                            })
                                        } else if (searchText === "") {
                                            toast({
                                                title: "Error",
                                                position: "bottom-right",
                                                description: "Search query cannot be empty.",
                                                status: "error",
                                                duration: 5000,
                                                isClosable: true,
                                            })
                                        } else {
                                            window.location.href = '/search?q=' + searchText;
                                        }
                                    }}
                                    colorScheme={"blackAlpha"}
                                    variant={"solid"}
                                >
                                    GO!
                                </Button>
                            } />
                        </InputGroup>
                    </HStack>
                </Flex>
            </Box>
        )
    }

    // searchParamがあるか確認する。
    // なければ、/にリダイレクトする。
    useEffect(() => {
        if (!searchParam) {
            window.location.href = '/?err=No search query provided.';
        }
    }, [searchParam]);
    

    if (loadState) {
        return (
            <>
                {navBar()}
                <Box h="92vh">
                <Center h="100%">
                    <VStack>
                        <Spinner size="xl" />
                        <Text>Searching for {searchParam}...</Text>
                    </VStack>
                </Center>
                </Box>
            </>
        )
    } else {
        return (
            <>
                {navBar()}
                <Box h="92vh">
                <Center h="100%">
                    <VStack>
                        <Spinner size="xl" />
                        <Text>Searching for {searchParam}...</Text>
                    </VStack>
                </Center>
                </Box>
            </>
        )
    }

}

export default SearchView;