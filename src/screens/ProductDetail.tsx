import { useCallback, useState } from "react";
import { Alert, Linking } from "react-native";
import { VStack, HStack, ScrollView, Text, useToast, Icon, Pressable, useTheme } from "native-base";

import { PencilSimpleLine } from "phosphor-react-native";

import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { api } from "@services/api";

import { useAuth } from "@hooks/useAuth";
import { useProduct } from "@hooks/useProduct";

import { AppHeader } from "@components/AppHeader";
import { ProductInfo } from "@components/ProductInfo";
import { ProductSkeleton } from "@components/ProductSkeleton";
import { WhatsappLogo, Power, TrashSimple } from "phosphor-react-native";
import { Button } from "@components/Button";

import { AppError } from "@utils/AppError";
import { formatPriceValue } from "@utils/formatPriceValue";

type RouteParamsProps ={
    productId: string;
}

export function ProductDetail(){
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingFormSubmission, setIsLoadingFormSubmission] = useState(false);
   

    const { sizes, colors } = useTheme();

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const { user } = useAuth();

    const route = useRoute();

    const { productId } = route.params as RouteParamsProps;

    const toast = useToast();

    const { fetchProduct, product, photosForSlide, setProduct } = useProduct();

    async function fetchSelectedProduct(){   
        setIsLoading(true);
        try{  
            await fetchProduct(productId);  

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar as informações produto. Tente novamente mais tarde.'
            
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });        
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeactivateProduct(){
        setIsLoadingFormSubmission(true);
        try{             
            await api.patch(`/products/${productId}`, {is_active: !product.is_active});
            product.is_active = !product.is_active;
            setProduct(product);
            toast.show({
                title: !product.is_active ? 'Produto desativado com sucesso' : 'Produto reativado com sucesso',
                placement: 'top',
                bgColor: 'green.300'
            });    
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar as informações produto. Tente novamente mais tarde.'
           
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });        
        } finally {
            setIsLoadingFormSubmission(false);
        }
    } 

    async function removeProduct(){
        setIsLoadingFormSubmission(true);
        try{  
            await api.delete(`/products/${productId}`);
            navigation.navigate('my_advertisement');
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar as informações produto. Tente novamente mais tarde.';           
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });    
           
        } finally {
            setIsLoadingFormSubmission(false);
        }
    }

    async function handleRemoveProduct(){
     
        Alert.alert(
            'Remover',
            'Deseja excluir o anúncio?',
            [
            {text: 'Não', style: 'cancel'},
            {text: 'Sim', onPress: () => removeProduct()}
            ]
        );          
        
    } 

    function handleWhatsAppContact(){
        const initialMessage = `Olá! Vi seu anúncio do ${product.name}, no Marketspace. Gostaria se saber mais informações sobre o produto.`;

        Linking.openURL(`whatsapp://send?text=${initialMessage}&phone=${product.user?.tel}`);
    }

    function handleGoToEditProduct(){
        navigation.navigate('create_advertisement' , { productId:  product.id });
    }
   
    useFocusEffect(useCallback(() => {
        fetchSelectedProduct();
    }, [productId]));  
  
    
    return(
        <VStack flex={1} bg="gray.200">  
            <AppHeader                 
                px={6}
                rightIcon={product.user_id === user.id && 
                    <Pressable onPress={handleGoToEditProduct}>
                            <Icon
                                as={<PencilSimpleLine />} 
                                name="arrow-left" 
                                size={sizes.md} 
                                color={colors.gray[700]}
                            />
                        </Pressable> 
                }
            />
            
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent:'center'}} showsVerticalScrollIndicator={false} >
                {isLoading ? <ProductSkeleton /> : 
                    <ProductInfo 
                        productData={product}
                        photosForSlide={photosForSlide}
                    />
                }

                {product.user_id === user.id &&  !isLoading &&
                    <VStack px={6}  mb={5}>
                        <Button
                            title={product.is_active ? "Desativar Anúncio" : "Reativar Anúncio"}
                            variant={product.is_active ? "black" : "blue"}                       
                            leftIcon={<Icon as={<Power color="white"  size={16}/>} />}
                            isLoading={isLoadingFormSubmission}
                            onPress={handleDeactivateProduct}
                            px={3}
                            mb={1}
                        />

                        <Button
                            title="Excluir Anúncio"
                            variant="gray"                       
                            leftIcon={<Icon as={<TrashSimple color="black"  size={16}/>} />}
                            isLoading={isLoadingFormSubmission}
                            onPress={handleRemoveProduct}
                            px={3}
                        />
                    </VStack>
                }

            </ScrollView> 

            {product.user_id !== user.id &&  !isLoading &&
                <HStack bg="gray.100" justifyContent="space-between" alignItems="center" px={6} pt={5} pb={8} > 
                    <HStack alignItems="flex-end" flex={1}>
                        <Text color="blue.300" fontSize="sm" fontWeight="bold">R$ </Text>
                        {!isLoading && 
                            <Text fontWeight="bold" color="blue.300" fontSize={22}>
                               {formatPriceValue(product.price)}
                            </Text>
                        }
                        
                    </HStack>
                    { product.user !== undefined && <Button
                        title="Entrar em contato"
                        variant="blue"
                        flex={1}
                        leftIcon={<Icon as={<WhatsappLogo color="white"  weight="fill" size={20}/>} />}
                        isLoading={isLoadingFormSubmission}
                        onPress={handleWhatsAppContact}
                        px={3}
                    />}
                </HStack>
            }
        
        </VStack>
    );

}