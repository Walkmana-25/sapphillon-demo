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
    Center,
    Card,
    CardHeader,
    CardBody,
    Heading,
    SimpleGrid,
    Image,
    Stack
} from '@chakra-ui/react';
import { TbDog } from "react-icons/tb";
import { LuSearch } from 'react-icons/lu';

import { parse } from 'node-html-parser';

function getBaseUrl(url: string): string {
    try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (error) {
        console.error('Invalid URL:', error);
        return '';
    }
}

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

    //const [loadState, setLoadState] = useState(true);
    const [loadState, setLoadState] = useState(true);
    const [searchStarted, setSearchStarted] = useState(false);

    const [searchParams] = useSearchParams();
    const searchParam = searchParams.get('q');

    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT

    const [searchText, setSearchText] = useState(searchParam ?? "");
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

    const [websiteInfo, setWebsiteInfo] = useState<{ [key: string]: string }>({});
    const [websitePic, setWebsitePic] = useState<{ [key: string]: string }>({});

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


    // APIをたたく
    useEffect(() => {
        let ignore = false;
        function fetchSys() {
            console.log("API Endpoint: " + apiEndpoint);
            fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ query: searchParam })
            })
                .then(response => { console.log(response); return response.json() })
                .then(data => {
                    console.log(data);
                    const result: SearchResult = data;
                    console.log(result);
                    setSearchResult(result);

                    // get website info
                    const info = websiteInfo;
                    const pic = websitePic
                    const fetchPromises = result.urls.map((url) => {
                        return fetch("https://api.allorigins.win/get?url=" + url.url)
                            .then((res) => res.text())
                            .then((data) => {
                                const root = parse(data);
                                const title = root?.querySelector('title');
                                const meta = root?.querySelectorAll('meta').filter((m) => m.getAttribute('property') === '\\"og:image\\"')[0];

                                // if pic does not have domain name, add it
                                const baseUrl = getBaseUrl(url.url);
                                // @ts-ignore
                                const picUrl = meta?.getAttribute('content')?.replaceAll('"', "").replaceAll("\\", "") ?? "";
                                const fullPicUrl = picUrl.startsWith('http') ? picUrl : `${baseUrl}${picUrl}`

                                console.log(title?.text);
                                console.log(fullPicUrl);

                                info[url.url] = title?.text ?? url.url;
                                pic[url.url] = fullPicUrl;
                            })
                            .catch((error) => {
                                console.error('Error fetching website info:', error);
                                info[url.url] = url.url;
                            });
                    });

                    Promise.all(fetchPromises).then(() => {
                        setWebsiteInfo(info);
                        setWebsitePic(pic);
                        setLoadState(false);
                    });

                })
                .catch((error) => {
                    console.error('Error:', error);
                    //window.location.href = '/?err=API Error';
                });
        };

        if (!ignore && !searchStarted) {
            ignore = true;
            setSearchStarted(true);
            fetchSys();
        }

        return () => {
            ignore = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



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
                <Box padding={10}>
                    <Text as="h2" fontSize="xl" fontWeight="bold">Search Results for "{searchParam}"</Text>
                    <Text fontSize="md" color="gray.500">Showing top 5 results</Text>
                    <Card variant="outline" mt="10" borderWidth={3}>
                        <CardHeader pb={0}>
                            <Heading as="h3" size="md">Summary</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text>{searchResult?.summary}</Text>
                        </CardBody>
                    </Card>

                    <Text as="h3" fontSize="lg" fontWeight="bold" mt={10} mb={5}>Recommend WebSites</Text>
                    <Card>
                        <SimpleGrid columns={1} spacing={5} p={5}>
                            {searchResult?.urls.map((url, index) => {
                                return (
                                    <Card size="mg" key={index} overflow={"hidden"} direction={{ base: "column", md: "row" }}>
                                        <Center w={{ base: "100%", md: "250px" }} h="250px">
                                            {websitePic[url.url] && <Image src={websitePic[url.url]} alt={websiteInfo[url.url]} w="250px" h="250px" objectFit={"scale-down"} p="3" />}
                                        </Center>
                                        <Stack>
                                            <CardHeader>
                                                <Heading as="a" size="md" href={url.url}>{websiteInfo[url.url]}</Heading>
                                                <br />
                                                <Text as="a" href={url.url} fontSize="xs" textColor={"gray.400"}>{url.url}</Text>
                                            </CardHeader>

                                            <CardBody>
                                                <Text>{url.summary}</Text>
                                            </CardBody>
                                        </Stack>
                                    </Card>
                                )
                            })}
                        </SimpleGrid>
                    </Card>

                </Box>
            </>
        )
    }

}

export default SearchView;