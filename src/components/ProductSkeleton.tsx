import { VStack, HStack, Skeleton, Heading, Text } from "native-base";

export function ProductSkeleton(){   
    
    const START_COLOR = "gray.400";  
    const END_COLOR = "gray.300"; 

    return(
        <VStack>
            <Skeleton 
                h={72}
                w="full"
                startColor="gray.400"
                endColor="gray.300"
            /> 

            <VStack px={6} py={6} bg="gray.200" alignItems="flex-start" >
                <HStack flex={1} mb={5} justifyContent="center"  alignItems="center">                   
                    <Skeleton 
                        size={6}
                        mr={3}
                        rounded="full"
                        startColor={START_COLOR}
                        endColor={END_COLOR}
                    /> 
                                                 
                    <Skeleton.Text 
                        lines={1} 
                        w={40} 
                        startColor={START_COLOR}
                        endColor={END_COLOR}
                    />                   
                </HStack>
                        
                <Skeleton 
                    w={15}
                    h={5}
                    mr={3}
                    rounded="full"
                    startColor={START_COLOR}
                    endColor={END_COLOR}
                />         
                
                <HStack alignItems="center" justifyContent="space-between" my={3}>
                    <Skeleton.Text 
                        lines={1} 
                        w={40} 
                        flex={1} 
                        mr={10}
                        startColor={START_COLOR}
                        endColor={END_COLOR}
                    />
                    <Skeleton.Text 
                        lines={1} 
                        w={100} 
                        startColor={START_COLOR}    
                        endColor={END_COLOR}
                    />
                </HStack>

                <Skeleton.Text lines={3} startColor={START_COLOR} endColor={END_COLOR} />

                <HStack  mt={5} mb={5} justifyContent="center"  alignItems="center">
                    <Text fontFamily="heading" color="gray.600" fontWeight="bold" fontSize="sm" mr={2}>
                        Aceita troca?
                    </Text>
                    <Skeleton.Text 
                        lines={1} 
                        w={10}
                        startColor={START_COLOR}    
                        endColor={END_COLOR}
                    />
                </HStack>

                <Heading fontFamily="heading" color="gray.600" fontWeight="bold" fontSize="sm" mb={3}>
                    Meios de pagamento:
                </Heading>
                <Skeleton.Text lines={1} w={40} mb={2} startColor={START_COLOR} endColor={END_COLOR} />
                <Skeleton.Text lines={1} w={40} mb={2} startColor={START_COLOR} endColor={END_COLOR} />
                <Skeleton.Text lines={1} w={40} startColor={START_COLOR} endColor={END_COLOR} />                
            </VStack>
        </VStack>
    );
}