import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { HStack, Skeleton, Text, useToast, VStack } from "native-base";

import { Plus } from "phosphor-react-native";

import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { useProduct } from "@hooks/useProduct";
import { ProductDTO } from "@dtos/ProductDTO";

import { AppHeader } from "@components/AppHeader";
import { Loading } from "@components/Loading";
import { ProductList } from "@components/ProductList";
import { Select } from "@components/Select";

import { AppError } from "@utils/AppError";

export function MyAdvertisement(){
    const [isLoading, setIsLoading] = useState(true);    
    const [filteredProduct, setFilteredProduct] = useState<ProductDTO[]>([]);
    const [filterApplied, setFilterApplied] = useState('actives');
    
    const filters = [
        {name: 'Todos', key: 'all'},
        {name: 'Ativos', key: 'actives'},        
        {name: 'Ativos e novos', key: 'activesAndNew'},
        {name: 'Ativos e usados', key: 'activeAndUsed'},
        {name: 'Desativados', key: 'deactivate'},
    ]

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const isFocused = useIsFocused();
   
    const toast = useToast();

    const { fetchProducts, userProducts } = useProduct();

    function applyFilter(products: ProductDTO[]){
        let filter: ProductDTO[] = products;
        if(filterApplied === 'actives') {
            filter = products.filter((value) => value.is_active===true)            
        } else if(filterApplied === 'activesAndNew') {
            filter = products.filter((value) => value.is_active===true && value.is_new===true)            
        } else if(filterApplied === 'activeAndUsed') {
            filter = products.filter((value) => value.is_active===true  && value.is_new===false)            
        } else if(filterApplied === 'deactivate') {
            filter = products.filter((value) => value.is_active===false)            
        }       
        setFilteredProduct(filter);
    }

    async function fetchUserProducts(){
        setIsLoading(true);       
        try {           
            await fetchProducts({ userProductsView: true });  
            applyFilter(userProducts);
        } catch (error) {
            const isAppError = error instanceof AppError; 

            const title = isAppError ? error.message : 'Não foi possível carregar os produtos.';

            toast.show({
                title,
                placement: "top",
                bgColor: "red.500"
            })
        } finally {
            setIsLoading(false);
        }
    }

    function handleOnChangeFilter(newValue: string){
        setIsLoading(true);
        setFilterApplied(newValue);
        applyFilter(userProducts);
        setIsLoading(false);
    }

    function handleCreateAdvertisementRoute(){
        navigation.navigate('create_advertisement', { productId: "0" });
    }
     
    useFocusEffect(useCallback(() => {   
        fetchUserProducts(); 
        applyFilter(userProducts);    
    }, [isFocused])); 


    return(
        <VStack flex={1} bg="gray.200" px={6}>
            <AppHeader 
                title='Meus anúncios' 
                goBackIcon={false}
                rightIcon={
                    <TouchableOpacity
                        onPress={handleCreateAdvertisementRoute}
                    >
                        <Plus />
                    </TouchableOpacity>
                }
            />                
                           
            <HStack alignItems="center" justifyContent="space-between" mb={2}  mt={10}>

            {isLoading ? 
                 <Skeleton.Text 
                    lines={1} 
                    w={20}
                    startColor='gray.400'
                    endColor='gray.300'
                />  
                
                :  
                
                <Text fontSize="md" color="gray.600"  justifyContent="flex-start" flex={1}> 
                    {filteredProduct.length} {filteredProduct.length === 1 ? 'anúncio' : 'anúncios'} 
                </Text>
            }

                <Select 
                    options={filters} 
                    selectedValue={filterApplied}
                    onValueChange={itemSelected => handleOnChangeFilter(itemSelected)}
                    w={155}                    
                    alignSelf="flex-end"
                />

            </HStack>            
            {isLoading ? <Loading /> : <ProductList products={filteredProduct} showUserPhoto={false}/> }    
        </VStack>
    );
}