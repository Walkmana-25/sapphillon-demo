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
    SimpleGrid
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

    //const [loadState, setLoadState] = useState(true);
    const [loadState, setLoadState] = useState(false);

    const [searchParams] = useSearchParams();
    const searchParam = searchParams.get('q');

    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT

    const [searchText, setSearchText] = useState(searchParam ?? "");
    //const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

    const sample_text = `{
  "summary": "Kubernetes is an open-source platform designed for managing containerized applications and services. It automates deployment, scaling, and operations of application containers across clusters of hosts. This summary provides insights into what Kubernetes is, its functionalities, and its significance in modern application development.",
  "urls": [
    {
      "url": "https://kubernetes.io/docs/concepts/overview/",
      "summary": "An overview of Kubernetes, detailing its capabilities in managing containerized workloads and services."
    },
    {
      "url": "https://kubernetes.io/docs/home/",
      "summary": "The official Kubernetes documentation, offering guidance on how to use Kubernetes for automating and managing containerized applications."
    },
    {
      "url": "https://www.geeksforgeeks.org/introduction-to-kubernetes-k8s/",
      "summary": "An introduction to Kubernetes, explaining its workings, benefits, and comparisons with other container orchestration platforms."
    },
    {
      "url": "https://www.zdnet.com/article/what-is-kubernetes-and-why-is-it-so-important/",
      "summary": "An article discussing the importance of Kubernetes, its features, benefits, challenges, and future trends in the context of cloud-native applications."
    }
  ]
}`;
    const [searchResult, setSearchResult] = useState<SearchResult | null>(JSON.parse(sample_text));

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
    // useEffect(() => {
    //     console.log("API Endpoint: " + apiEndpoint);
    //     fetch(apiEndpoint, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'accept': 'application/json'
    //         },
    //         body: JSON.stringify({ query: searchParam } )
    //     })
    //         .then(response => {console.log(response); return response.json()})
    //         .then(data => {
    //             console.log(data);
    //             const result: SearchResult = data;
    //             console.log(result);
    //             setSearchResult(result);
    //             setLoadState(false);
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //             window.location.href = '/?err=API Error';
    //         });
    // }, [apiEndpoint, searchParam]);



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
                        <SimpleGrid columns={1} spacing={5}>
                            {searchResult?.urls.map((url, index) => {
                                return (
                                    <Box key={index} border="1px" borderColor="gray.200" borderRadius="md" p={5} m={2} mr={5} ms={5}>
                                        <a href={url.url} target="_blank" rel="noreferrer">
                                            <Text fontSize="lg" fontWeight="bold">{url.url}</Text>
                                        </a>
                                        <Text>{url.summary}</Text>
                                    </Box>
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