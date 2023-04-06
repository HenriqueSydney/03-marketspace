import { useCallback, useState } from "react";
import { Box, Heading, HStack, Icon, Image, Pressable, ScrollView, Text, useToast, Switch, VStack, useTheme } from "native-base";
import { X, Plus } from 'phosphor-react-native';

import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputOptionProps } from "src/@types/inputOptions";
import { PhotoFileProps } from "src/@types/photoFile";

import { PaymentMethodsProps, ProductImagesDTO } from "@dtos/ProductDTO";

import { useProduct } from "@hooks/useProduct";
import { ProductPreviewDefaultValues } from "@contexts/ProductContext";

import { api } from "@services/api";

import { AppHeader } from "@components/AppHeader";
import { Input } from "@components/Input";
import { Textarea } from "@components/Textarea";
import { RadioInput } from "@components/RadioInput";
import { Checkbox} from "@components/Checkbox";
import { Button } from "@components/Button";
import { Loading } from "@components/Loading";

import { AppError } from "@utils/AppError";
import { getPaymentOptions } from "@utils/findPaymentOptions";
import { formatPriceValue } from "@utils/formatPriceValue";

const PHOTO_SIZE = 24;

type FormDataProps = {
    name: string;
    description: string;   
    is_new: 'Produto novo' | 'Produto usado' | '';
    price: string;
    accept_trade: boolean;
    payment_methods: string[];
}

type RouteParamsProps ={
    productId: string;
}

export function CreateAdvertisement(){
    const [isLoading, setIsLoading] = useState(true);
    const [isPhotoSelectionLoading, setIsPhotoSelectionLoading] = useState(false);
    const [selectedPhotosFiles, setSelectedPhotosFiles] = useState<PhotoFileProps[]>([] as any);
    const [deletedPhotosFilesOnEdit, setDeletedPhotosFilesOnEdit] = useState<string[]>([]);
    const [isLoadingFormSubmission, setIsLoadingFormSubmission] = useState(false);
    const { colors } = useTheme();
    
    const toast = useToast();
    const { setProductPreview, productPreview } = useProduct();

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const route = useRoute();

    const { productId } = route.params as RouteParamsProps;

    const productStatusRadioOptions: InputOptionProps[] = [
        {key: 'Produto novo'},
        {key: 'Produto usado'}
    ];

    const paymentOptions = getPaymentOptions();

    const advertisementSchema = yup.object({   
        name: yup.string().trim().required('Informe o título do anúncio.').min(3,'O título do anúncio deve ter, pelo menos, três caracteres.'),
        description: yup.string().trim().required('Informe a descrição do produto.').min(3,'O descrição do produto deve ter, pelo menos, três caracteres.'),       
        is_new: yup.string().trim().required('Selecione o tipo do produto.'),
        price: yup.string().test(
            "is-decimal",
            "O preço de venda deve ser um valor válido (ex.: XX.XXX,XX)",
            (val: any) => {
                if (val != undefined) {
                    return /^\s*(?:[1-9]\d{0,2}(?:\.|\d{3})*|0)(?:,\d{0,2})?$/.test(val);
                }
                return true;
            }
        ).required('O valor é obrigatório.'),        
        payment_methods: yup.array()
        .min(1,'Selecione ao menos 1 método de pagamento.').max(5, 'Apenas 5 métodos de pagamento estão disponíveis')
        .required('Informe os métodos de pagamento disponíveis para o produto.')
    });
    
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(advertisementSchema),
        defaultValues:{
            name: '',
            description: '',  
            is_new: '',
            price: '',
            accept_trade: false,
            payment_methods: []
        }     
    });

    function loadProductPreview(){     
        setIsLoading(true);
        setSelectedPhotosFiles(productPreview.product_images as PhotoFileProps[]);
        
        let defaultValuePaymentOptions: string[] = [];
        if(productPreview.payment_methods !== undefined){
            defaultValuePaymentOptions = (productPreview.payment_methods as PaymentMethodsProps[]).map((paymentMethod) => paymentMethod.key);              
        }
       
        if(productPreview.id !== '0'){
            setProductPreview(ProductPreviewDefaultValues);
        } else{          
            reset(
                {
                    name: productPreview.name,
                    description: productPreview.description,  
                    is_new: productPreview.is_new === undefined ? '' : (productPreview.is_new ? 'Produto novo' : 'Produto usado'),
                    price: productPreview.price === 0 ? '' : formatPriceValue(productPreview.price),
                    accept_trade: productPreview.accept_trade,
                    payment_methods: defaultValuePaymentOptions
                }
            );  
        }
      
        
        setIsLoading(false);  
    }

    async function fetchProductToEdit(){
        setIsLoading(true);
        try{  
            const { data } = await api.get(`/products/${productId}`);
                            
            const images: PhotoFileProps[] = data.product_images.map((image: ProductImagesDTO) => {
                return(
                    {
                        name: image.id,
                        uri: `${api.defaults.baseURL}/images/${image.path}`,
                        type: ''
                    }
                )               
            });
            setSelectedPhotosFiles(images);                    

            let defaultValuePaymentOptions: string[] = [];
            if(data.payment_methods !== undefined){
                defaultValuePaymentOptions = (data.payment_methods as PaymentMethodsProps[]).map((paymentMethod) => paymentMethod.key);
              
            }
             
            reset(
               {
                    name: data.name,
                    description: data.description,  
                    is_new: data.is_new ? 'Produto novo' : 'Produto usado',
                    price: formatPriceValue(data.price),
                    accept_trade: data.accept_trade,
                    payment_methods: defaultValuePaymentOptions
                }
            )
         
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar as informações produto. Tente novamente mais tarde.'
            
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });        
        } finally{
            setIsLoading(false);
        }
    }

    async function handleProductPhotoSelect(){
        setIsPhotoSelectionLoading(true);
        const fileNamesSelected = selectedPhotosFiles.map((image) => image.name);
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsMultipleSelection: true,
                orderedSelection: true
            });

            if(photoSelected.canceled){
                return;
            } 

            if((photoSelected.assets.length + selectedPhotosFiles.length) > 3){
                toast.show({
                    title: 'Selecione até 3 imagens',
                    placement: "top",
                    bgColor: "red.500"
                })
                return;
            } 
           
            photoSelected.assets.map( async (image, index) => {
                if(!(image.uri in fileNamesSelected)){                 

                    if(image.uri){
                        const photoInfo = await FileSystem.getInfoAsync(image.uri);
                        
                        if(photoInfo.size && (photoInfo.size/1024/1024) > 8){
                            return toast.show({
                                title: "Uma das imagens selecionadas é muito grande, escolha imagens de até 8MB.",
                                placement:"top",
                                bgColor: 'red.500'
                            });                    
                        }
        
                        const fileExtension = image.uri.split('.').pop();
                        
                        setSelectedPhotosFiles(prevState => [...prevState, {
                            name: `image_${index}_${image.assetId}`,
                            uri: image.uri,
                            type: `${image.type}/${fileExtension}`
                        }]);                   
                    }                     
                }

            });

        } catch (error) {
            const isAppError = error instanceof AppError;

            const title = isAppError ? error.message : 'Não foi possível atualizar sua foto. Tente novamente mais tarde.';

            toast.show({
                title,
                placement: "top",
                bgColor: "red.500"
            })
        } finally {
            setIsPhotoSelectionLoading(false);
        }
    }

    function handleRemoveSelectedPhoto(deletedPhoto: PhotoFileProps){
        const newPhotoSet = selectedPhotosFiles.filter((image) => image.name !== deletedPhoto.name && image);
        setSelectedPhotosFiles(newPhotoSet);

        if(productId !== '0' && deletedPhoto.type === ''){
            setDeletedPhotosFilesOnEdit(prevState => [...prevState, deletedPhoto.name]);
        }
    }

   
    async function handleGoToPreview({ name, description, is_new, price, accept_trade, payment_methods }: FormDataProps){
        setIsLoadingFormSubmission(true);     
        try {
            
            if(selectedPhotosFiles.length === 0){
                toast.show({
                    title: 'Selecione ao menos 1 imagem do produto',
                    placement: 'top',
                    bgColor: 'red.500'
                });     
                return false;
            }
            const paymentMethodsObject: PaymentMethodsProps[] = paymentOptions.filter((paymentMethod) => payment_methods.includes(paymentMethod.key));
            
            const productData = { 
                id: productId,               
                name,
                description, 
                is_new: is_new === 'Produto novo' ? true : false, 
                price: +parseFloat(price.replace(',','.')).toFixed(2).toString().replace('.',''), 
                accept_trade,
                payment_methods: paymentMethodsObject,
                is_active: true,               
                product_images: selectedPhotosFiles,     
                deletedPhotosFilesOnEdit           
            };
            setProductPreview(productData);
            navigation.navigate('advertisement_preview');         
           
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível avançar para próxima etapa. Tente novamente mais tarde.'
           
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });        
        }  finally{
            setIsLoadingFormSubmission(false)
        }     
    }

    function handleGoBack(){
        navigation.goBack();
    }

    useFocusEffect(useCallback(() => {    
        if(productId === '0'){
            loadProductPreview();     
        } else{
            fetchProductToEdit();
        }
       
    }, [productId, productPreview]));

    return(
        <VStack flex={1}  px={6}  bg="gray.200">    
       
            <AppHeader title={productId === '0' ? "Criar anúncio" : 'Editar anúncio'} mb={8}/>
           
            {isLoading ? <Loading /> :
                <ScrollView >   
                    <Heading fontFamily="heading" color="gray.600" fontWeight="bold" fontSize="md" >
                        Imagens
                    </Heading>

                    <Text fontFamily="body" color="gray.500" fontSize="sm" mt={2}>
                        Escolha até 3 imagens para mostrar o quanto o seu produto é incrível!
                    </Text>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <HStack>
                            {selectedPhotosFiles?.length > 0 && 
                                selectedPhotosFiles.map((image, index) => {
                                    return(
                                        <Box key={image.name+' '+index}>
                                            <Image 
                                                source={ { uri: image.uri} }                                        
                                                justifyContent="center" 
                                                alignItems="center" 
                                                bg="gray.300" 
                                                w={PHOTO_SIZE} 
                                                h={PHOTO_SIZE} 
                                                rounded={6} 
                                                mt={3}
                                                mr={2}                                                
                                                alt="Foto do Produto"
                                            />
                                            <Pressable 
                                                position="absolute"
                                                right={1}
                                                top={2}
                                                padding={2}
                                                rounded="full"
                                                onPress={() => handleRemoveSelectedPhoto(image)}
                                            > 
                                                <Box
                                                    rounded="full"
                                                    bg="gray.600"
                                                >
                                                    <Icon as={<X color={colors.gray[100]} size={14} />} />
                                                </Box>
                                            </Pressable>

                                        </Box>
                                    );
                                })                        
                            }

                            {selectedPhotosFiles?.length < 3 &&
                                <Pressable 
                                    justifyContent="center" 
                                    alignItems="center" 
                                    bg="gray.300" 
                                    w={PHOTO_SIZE} 
                                    h={PHOTO_SIZE} 
                                    rounded={6} 
                                    mt={3}
                                    onPress={handleProductPhotoSelect}
                                >
                                {isPhotoSelectionLoading ? <Loading /> : <Icon as={<Plus color={colors.gray[400]} size={24} />} /> } 
                                </Pressable>
                            }
                        </HStack>
                    </ScrollView>
                    <Heading fontFamily="heading" color="gray.600" fontWeight="bold" fontSize="md" mt={8} mb={5}>
                        Sobre o produto
                    </Heading>

                    <Controller
                        control={control}
                        name="name"                       
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder="Título do anúncio"                        
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />                           
                        )}
                    />

                    <Controller
                        control={control}
                        name="description"                       
                        render={({ field: { onChange, value } }) => (
                            <Textarea 
                                placeholder="Descrição do produto" 
                                numberOfLines={6}
                                h={40}                       
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.description?.message}
                            />                           
                        )}
                    />
                    <Controller
                        control={control}
                        name="is_new"                       
                        render={({ field: { onChange, value } }) => (
                            <RadioInput 
                                name="is_new"
                                options={productStatusRadioOptions}
                                value={value}
                                onChange={onChange}
                                errorMessage={errors.is_new?.message}
                            />
                        )}
                    />

                    <Heading fontFamily="heading" color="gray.600" fontWeight="bold" fontSize="md" mt={5} mb={5}>
                        Venda
                    </Heading>
                    <Text>{JSON.stringify(errors.price)}</Text>
                    <Controller
                        control={control}
                        name="price"                       
                        render={({ field: { onChange, value } }) => (
                            <Input                         
                                placeholder="Valor do produto"
                                InputLeftElement={
                                    <Text ml={3} fontSize="md" color="gray.700">R$</Text>
                                }      
                                                
                                value={value}
                                onChangeText={onChange}
                                errorMessage={errors.price?.message}
                            />
                        )}
                    />            

                    <Heading fontFamily="heading" color="gray.600" fontWeight="bold" fontSize="md" mt={5}>
                        Aceita Troca?
                    </Heading>   
                        
                    <Controller
                        control={control}
                        name="accept_trade"                       
                        render={({ field: { onChange, value } }) => (
                            <Box alignItems="flex-start" justifyContent="flex-start">   
                                <Switch                           
                                    isChecked={value}
                                    onToggle={onChange}
                                />       
                            </Box>
                        )}
                    />
                    
                    <Heading fontFamily="heading" color="gray.600" fontWeight="bold" fontSize="md" mt={3} mb={1}>
                        Meios de Pagamento?
                    </Heading> 
                
                    <Controller
                        control={control}
                        name="payment_methods"                       
                        render={({ field: { onChange, value } }) => (
                            <Checkbox
                                options={paymentOptions}
                                value={value}
                                onChange={onChange}
                                errorMessage={errors.payment_methods?.message}
                            />                    
                        )}
                    />   

                    <HStack  justifyContent="space-around" mt={2} mb={10}  pt={5} pb={8}>
                        <Button
                            title="Cancelar"
                            variant="gray"
                            mr={3}
                            flex={1}
                            onPress={handleGoBack}
                            isLoading={isLoadingFormSubmission}   
                        />

                        <Button 
                            title="Avançar"
                            variant="black"     
                            flex={1}                 
                            isLoading={isLoadingFormSubmission}   
                            isDisabled={Object.keys(errors).length ? true : false}                     
                            onPress={handleSubmit(handleGoToPreview)}
                        />
                    </HStack>
                </ScrollView>
    
            }
        </VStack>
    );
}