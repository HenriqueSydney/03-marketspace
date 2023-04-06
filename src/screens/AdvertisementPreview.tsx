import { useCallback, useState } from "react";
import { VStack, HStack, ScrollView, useToast, useTheme, Icon, Heading, Text} from "native-base";
import { ArrowLeft, Tag } from 'phosphor-react-native';

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { useProduct } from "@hooks/useProduct";
import { ProductPreviewDefaultValues } from "@contexts/ProductContext";

import { api } from "@services/api";
import { PaymentMethodsProps, ProductImagesDTO } from "@dtos/ProductDTO";

import { Button } from "@components/Button";
import { ProductInfo } from "@components/ProductInfo";

import { AppError } from "@utils/AppError";

import { PhotoFileProps } from "src/@types/photoFile";

export function AdvertisementPreview(){
    const [isLoadingFormSubmission, setIsLoadingFormSubmission] = useState(false);    
    const [photosForSlide, setPhotosForSlide] = useState<ProductImagesDTO[]>([]);   
          
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const { colors } = useTheme();

    const toast = useToast();

    const { setProductPreview, productPreview } = useProduct();
   
    async function handlePublishProduct(){
        setIsLoadingFormSubmission(true);
        try {              
            const selectedPaymentMethodsKeys = (productPreview.payment_methods as PaymentMethodsProps[]).map((selectedPaymentMethod) => selectedPaymentMethod.key);
            
            const productToSendServer = {
                name: productPreview.name,
                description: productPreview.description,
                is_new: productPreview.is_new,
                price: +productPreview.price,
                accept_trade: productPreview.accept_trade,
                payment_methods: selectedPaymentMethodsKeys
            };
                       
            const fileData = new FormData();
            let haveNewPhotosToSendServer = false;
            (productPreview.product_images as PhotoFileProps[]).map((image) => {
                if(image.type !== ''){
                    fileData.append('images', image as any);                    
                    haveNewPhotosToSendServer = true;
                }
            });

            let productId = productPreview.id;          
          
            if(productId === '0'){
                const { data } = await api.post('/products', productToSendServer);
                fileData.append('product_id', data.id);
                productId = data.id;
            } else{              
                await api.put(`/products/${productPreview.id}`, productToSendServer);               
                fileData.append('product_id', productPreview.id);
               
                if(productPreview.deletedPhotosFilesOnEdit !== undefined && productPreview.deletedPhotosFilesOnEdit.length>0){
                    await api.delete('/products/images', { data: { productImagesIds: productPreview.deletedPhotosFilesOnEdit }});                   
                }                
            }
                      
            if(haveNewPhotosToSendServer){
                await api.post('/products/images', fileData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            if(productId === '0'){               
                toast.show({
                    title:'Não foi possível atualizar/cadastrar o produto. Tente novamente mais tarde.',
                    placement: 'top',
                    bgColor: 'red.500'
                });        
                navigation.navigate('home');
            } else{
                const title = productPreview.id !== '0' ? 'Produto editado com sucesso' : 'Produto cadastrado com sucesso';
                toast.show({
                    title,
                    placement: 'top',
                    bgColor: 'green.400'
                });    
                setProductPreview(ProductPreviewDefaultValues);
                navigation.navigate('product_detail', { productId });
            }           
          
        } catch (error) {
            const isAppError = error instanceof AppError;           
            const title = isAppError ? error.message : 'Não foi possível atualizar/cadastrar o produto. Tente novamente mais tarde.'
            
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });        
        } finally{
            setIsLoadingFormSubmission(false);
        }
    }

    function handleGoBack(){
        navigation.navigate('create_advertisement' , { productId:  productPreview.id });
    }

    useFocusEffect(useCallback(() => {
        const photos =  (productPreview.product_images as PhotoFileProps[]).map((photo, index) => {return({id: photo.uri+index, path: photo.uri})});
      
        setPhotosForSlide(photos as ProductImagesDTO[]);
 
    }, [productPreview.product_images]));  
     
    return(
        <VStack flex={1} >  
            <VStack w="full" pt={16} pb={4} px={6} alignItems="center" justifyContent="center" bg="blue.300">
                <Heading fontFamily="heading" fontWeight="bold" color="gray.100" fontSize="md">
                    Pré visualização do anúncio
                </Heading>    
                <Text fontFamily="body" color="gray.100" fontSize="sm">
                    É assim que seu produto vai aparecer
                </Text>
            </VStack>    
            
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent:'center'}} showsVerticalScrollIndicator={false}>
               
                <ProductInfo 
                    productData={productPreview}
                    photosForSlide={photosForSlide}
                    preview={true}
                />
              
            </ScrollView>
            
            <HStack bg="gray.100" justifyContent="space-between" alignItems="center" px={6} pt={5} pb={8}>            
                <Button 
                    leftIcon={<Icon as={<ArrowLeft color={colors.gray[600]} size={16} />} />}
                    title="Voltar e editar"
                    variant="gray"
                    flex={1}
                    mr={3}
                    onPress={handleGoBack}
                />
                <Button
                    leftIcon={<Icon as={<Tag color={colors.gray[100]} size={16} />} />}
                    title="Publicar"                   
                    variant="blue"
                    flex={1}
                    isLoading={isLoadingFormSubmission}
                    onPress={handlePublishProduct}
                />
            </HStack>   
              
        </VStack>
    );

}