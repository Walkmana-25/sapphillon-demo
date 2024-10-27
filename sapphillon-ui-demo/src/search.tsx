import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Input, Flex, HStack, Icon } from '@chakra-ui/react';
import { TbDog } from "react-icons/tb";


function SearchView() {

    const [loadState, setLoadState] = useState(true);

    const [searchParams] = useSearchParams();
    const searchParam = searchParams.get('q');

    const navBar = () => {
        return (
            <Box bg={"gray.100"} px={"4px"}>
                <Flex h={"10"} alignItems={"center"} justifyContent={"space-between"}>
                    <HStack as="a" href="/" display="flex">
                        <Icon as={TbDog} color="blue.500" boxSize={"8"} />
                        <Box>Sapphillon Search Demo</Box>
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