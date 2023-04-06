import { Dimensions } from "react-native";
import { VStack, HStack, Image, Heading, Text, Badge, View } from "native-base";
import { 
    Money as Cash,
    Bank as Deposit,
    QrCode as Pix,
    Barcode as Boleto,
    CreditCard as Card
} from "phosphor-react-native";

import { useAuth } from "@hooks/useAuth";

import { api } from "@services/api";
import { PaymentMethodsProps, ProductDTO, ProductImagesDTO } from "@dtos/ProductDTO";


import { Carousel } from "@components/Carousel";
import { UserPhoto } from "@components/UserPhoto";

import Avatar from '@assets/avatar.png';
import { formatPriceValue } from "@utils/formatPriceValue";

type Props = {
    productData: ProductDTO;    
    photosForSlide: ProductImagesDTO[];
    preview?: boolean;
}

export function ProductInfo({ productData, photosForSlide, preview = false }:Props){
    const { user } = useAuth();

    const { width: windowWidth } = Dimensions.get("window");  
    
    return(       
        <VStack>            

            <Carousel
                data={photosForSlide}                      
                keyExtractor={(item) => item.id}           
                renderItem={({ item }) => {
                    return ( 
                        <View>
                            <Image
                                source={preview ? { uri: item.path} : { uri: `${api.defaults.baseURL}/images/${item.path}`}}
                                w={windowWidth}
                                h={72}
                                alt="Foto do produto"
                            />                                    
                        </View>
                    );
                }}
                borderColor="red.500"
                w="full"
                h={72}    
            />       

            {!productData.is_active &&
                <VStack
                    bg="gray.700"
                    w="full"
                    h={72} 
                    opacity={0.6}
                    alignItems="center"
                    justifyContent="center"
                    position="absolute"
                >

                    <Text fontSize="sm" fontWeight="bold" color="gray.100">ANÚNCIO DESATIVADO</Text>               
                
                </VStack>
            }                

            <VStack px={6} py={6} bg="gray.200">
                <HStack flex={1} mb={5}>                   
                    <UserPhoto
                        source={ preview && user.avatar ? { uri: `${api.defaults.baseURL}/images/${user.avatar}`} : (productData.user ? { uri: `${api.defaults.baseURL}/images/${productData.user.avatar}`} : Avatar) }
                        alt="Imagem do usuário"
                        size={6}
                        mr={3}                            
                    />         
                     
                            
                    <Text fontFamily="body" fontSize="sm" color="gray.700">
                        {preview ? user.name : productData.user?.name}!
                    </Text>                    
                </HStack>
                        
                <Badge bg="gray.300" px={2} py={0.5} rounded="full" alignSelf="flex-start"> 
                    <Text  fontSize={10} fontWeight="bold" fontFamily="heading" color="gray.600">
                        {productData.is_new ? 'NOVO' : 'USADO'}
                    </Text>
                </Badge>
                {(productData.name.length + productData.price.toString().length) <= 30?
                    <HStack alignItems="center" justifyContent="space-between" my={3}>
                        <Heading fontFamily="heading" fontWeight="bold" color="gray.700" fontSize="xl">
                            {productData.name}
                        </Heading>
                        <HStack alignItems="flex-end">
                            <Text color="blue.300" fontSize="sm" fontWeight="bold">R$ </Text>                      
                            <Text fontWeight="bold" color="blue.300" fontSize="xl">
                                {formatPriceValue(productData.price)}
                            </Text>
                            
                        </HStack>
                    </HStack>
                    :
                    <VStack my={3}>
                        <Heading fontFamily="heading" fontWeight="bold" color="gray.700" fontSize="xl">
                            {productData.name}
                        </Heading>
                        <HStack alignItems="flex-end">
                            <Text color="blue.300" fontSize="sm" fontWeight="bold">R$ </Text>                      
                            <Text fontWeight="bold" color="blue.300" fontSize="xl">
                                {`${productData.price.toString().slice(0,-2)},${productData.price.toString().slice(-2)}`}
                            </Text>
                            
                        </HStack>
                    </VStack>
                }
               

                <Text  fontFamily="body"  color="gray.600" fontSize="sm">
                    {productData.description}
                </Text>

                <HStack  mt={5} mb={5}>
                    <Text fontFamily="heading" color="gray.600" fontWeight="bold" fontSize="sm" mr={2}>
                        Aceita troca?
                    </Text>
                    <Text fontFamily="body" color="gray.600" fontSize="sm">
                        {productData.accept_trade ? 'Sim' : 'Não'}
                    </Text>
                </HStack>

                <Heading fontFamily="heading" color="gray.600" fontWeight="bold" fontSize="sm" mb={3}>
                    Meios de pagamento:
                </Heading>

                {                   
                    (productData.payment_methods as PaymentMethodsProps[]).map(paymentMethod => {         
                    return(
                        <HStack key={paymentMethod.key}>
                            {paymentMethod.key === 'card' ? <Card/> : 
                                (paymentMethod.key === 'deposit' ? <Deposit/> : 
                                (paymentMethod.key === 'cash' ? <Cash/> : 
                                (paymentMethod.key === 'pix' ? <Pix/> : 
                                (paymentMethod.key === 'boleto' ? <Boleto/> : <Pix/>
                            ))))}   

                            
                            <Text ml={2}>
                                {paymentMethod.key === 'card' ? 'Cartão de Crédito' : 
                                    (paymentMethod.key === 'deposit' ? 'Depósito Bancário' : 
                                    (paymentMethod.key === 'cash' ? 'Dinheiro' : 
                                    (paymentMethod.key === 'pix' ? 'Pix' : 
                                    (paymentMethod.key === 'boleto' ? 'Boleto' : 'Pix'
                                ))))} 
                            </Text>
                        </HStack>
                    )                    
                })}                
            </VStack>
        </VStack>
    );
}