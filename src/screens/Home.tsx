import { Fragment, useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Divider, Heading, HStack, Icon, Text, useToast, VStack, useTheme, Pressable, Skeleton } from "native-base";

import { Tag, ArrowRight, MagnifyingGlass, Sliders } from 'phosphor-react-native';

import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { useProduct } from "@hooks/useProduct";

import { ProductDTO } from "@dtos/ProductDTO";

import { Input } from "@components/Input";
import { Loading } from "@components/Loading";
import { HomeHeader } from "@components/HomeHeader";
import { FilterModal } from "@components/FilterModal";
import { ProductList } from "@components/ProductList";

import { AppError } from "@utils/AppError";

export function Home(){
    const [showModal, setShowModal] = useState(false);
    const [productName, setProductName] = useState('');
    const [userActiveAdvertisements, setUserActiveAdvertisements] = useState(0);   
    
    const { colors } = useTheme();

    const { fetchProducts, products, filteredProducts, setFilteredProducts, userProducts, isLoadingFetchingProductData } = useProduct();
   
    const toast = useToast();

    const isFocused = useIsFocused();

    const navigation = useNavigation<AppNavigatorRoutesProps>();
      
    async function fetchAvailableProducts(){
        try {
            await fetchProducts({ userProductsView: true });      
            countNumberOfActiveUserProducts() 
            await fetchProducts({});    
            filterProducts();
        } catch (error) { 
            console.log(error)
            const isAppError = error instanceof AppError; 

            const title = isAppError ? error.message : 'Não foi possível carregar os produtos.';

            toast.show({
                title,
                placement: "top",
                bgColor: "red.500"
            })
        } 
    }

    function countNumberOfActiveUserProducts(){
        let ActiveAdvertisements = 0;
        userProducts.map((product: ProductDTO) =>  product.is_active && ActiveAdvertisements++)
       
        setUserActiveAdvertisements(ActiveAdvertisements);
    }

    function filterProducts(){
        const filter = products.filter((value) => value.name.includes(productName))
        setFilteredProducts(filter);
    }

    async function handleSearchInput(input:string){
        setProductName(input);
        const filter = products.filter((value) => value.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()))
        setFilteredProducts(filter);
    }

    function handleGoToMyAdvertisements(){
        navigation.navigate('my_advertisement');
    }    

    useFocusEffect(useCallback(() => {
        fetchAvailableProducts();     
    }, [isFocused])); 

    useFocusEffect(useCallback(() => {
        countNumberOfActiveUserProducts() ;     
    }, [userProducts])); 
    
  
    return(
        <VStack flex={1} bg="gray.200">
            <HomeHeader />

            <VStack  px={6} flex={1}>
                <Text color="gray.500" fontSize="sm">
                    Seus produtos anunciados para venda
                </Text>
                <TouchableOpacity
                    onPress={handleGoToMyAdvertisements}
                >
                    <HStack bg='rgba(100, 122, 199, 0.1)' rounded={6} px={5} py={3} mt={3} justifyContent="space-between" alignItems="center" mb={8}>
                        <HStack alignItems="center" justifyContent="center">

                            <Icon  as={<Tag color={colors.blue[500]} size={22}/>} />

                            <VStack ml={4}>
                                <Heading fontFamily="heading" fontWeight="bold" color="gray.600" fontSize="xl">
                                    {isLoadingFetchingProductData ? 
                                        <Skeleton
                                            rounded="full"
                                            w={4}
                                            h={6}
                                            startColor="gray.400"
                                            endColor="gray.300"
                                        />                                         
                                        : userActiveAdvertisements                                        
                                        
                                    }
                                </Heading>

                                <Text fontSize="xs" fontFamily="body" color="gray.600">
                                   { userActiveAdvertisements === 1 ? 'anúncio ativo' : 'anúncios ativos' }
                                </Text>
                            </VStack>
                        </HStack>
                        <HStack  alignItems="center" justifyContent="center">
                            <Heading fontSize="xs" fontFamily="heading" fontWeight="bold" color="blue.500" mr={2}>
                                Meus anúncios                           
                            </Heading>

                            <Icon as={<ArrowRight color={colors.blue[500]} size={16} weight="bold"  />} />
                        </HStack>
                    </HStack>
                </TouchableOpacity>
                <Text color="gray.500" fontSize="sm" mb={3}>
                    Compre produtos variados
                </Text>

                <Input 
                    placeholder="Buscar anúncio"
                    value={productName}
                    onChangeText={newText => handleSearchInput(newText)}
                    InputRightElement={
                        <Fragment>
                            
                            <Icon  as={<MagnifyingGlass color={colors.gray[600]} size={20} weight="bold" />}  /> 

                            <Divider orientation="vertical" mx={3} h={6}/>

                            <Pressable  mr={3} onPress={() => setShowModal(true)}>
                                <Icon as={<Sliders color={colors.gray[600]} size={20} weight="bold" />} />
                            </Pressable>  

                        </Fragment> 
                    }
                
                />
                <FilterModal 
                    showModal={showModal}
                    setShowModal={setShowModal}
                    query={productName}
                    setQuery={setProductName}
                />  
                
                {isLoadingFetchingProductData ? <Loading /> : <ProductList products={filteredProducts} /> }       

            </VStack>              
                
        </VStack>
    );
}