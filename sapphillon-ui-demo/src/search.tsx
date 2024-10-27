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
    useToast
} from '@chakra-ui/react';
import { TbDog } from "react-icons/tb";
import { LuSearch } from 'react-icons/lu';


function SearchView() {
    const toast = useToast();

    const [loadState, setLoadState] = useState(true);

    const [searchParams] = useSearchParams();
    const searchParam = searchParams.get('q');

    const [searchText, setSearchText] = useState(searchParam ?? "");

    const navBar = () => {
        return (
            <Box bg={"gray.100"} px={"10px"}>
                <Flex h={20} alignItems={"center"} justifyContent={"space-between"}>
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
                <h1>test</h1>
                <p>{searchParam}</p>
            </>
        )
    } else {
        return (
            <h1>test</h1>
        )
    }

}

export default SearchView;