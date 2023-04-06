import { Fragment } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Badge, Image, Text, View } from "native-base";

import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { api } from "@services/api";
import { ProductDTO, ProductImagesDTO } from "@dtos/ProductDTO";

import { UserPhoto } from "./UserPhoto";

import Logo from '@assets/logo.png';

import { formatPriceValue } from "@utils/formatPriceValue";

type Props = TouchableOpacityProps & {
    data: ProductDTO;
    showUserPhoto?: boolean;
};

export function ProductCard({ data, showUserPhoto=true, ...rest}: Props){
   
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleGoToAdvertisementDetail(){
        navigation.navigate('product_detail', { productId: data.id});
    }
    return(
        <TouchableOpacity 
            style={{width: '47%', marginBottom: 32}}
            onPress={handleGoToAdvertisementDetail}

            {...rest}
        >
            {data.product_images && 
                <Image 
                    source={
                            data.product_images.length === 0 ? 
                                Logo : 
                                { uri: `${api.defaults.baseURL}/images/${(data.product_images[0] as ProductImagesDTO).path}` }
                    }
                    alt="Imagem do produto"                    
                    h={26}
                    rounded="md"                    
                    resizeMode="cover"
                />
            }

            {showUserPhoto && data.user && 
                <UserPhoto
                    source={{ uri: `${api.defaults.baseURL}/images/${data.user.avatar}` }}
                    alt="Imagem do usuário"
                    size={6}                    
                    position="absolute"
                    mt={0.5}
                    left={0.5}   
                    borderColor="gray.100"                         
                />  
            }      
    
            
            <Badge 
                bg={data.is_new ? 'blue.500' : 'gray.600'}
                px={2} 
                py={0.5} 
                rounded="full" 
                alignSelf="flex-start"
                position="absolute"
                mt={0.5}
                right={0.5}
            > 
                    <Text  
                        fontSize={10} 
                        fontWeight="bold" 
                        fontFamily="body" 
                        color="white"
                    >
                            {data.is_new ? 'NOVO' : 'USADO'}
                    </Text>
            </Badge>
            
            {data.is_active !== undefined && !data.is_active &&
                <Fragment>
                    <View 
                        h={26}
                        rounded="md"       
                        position="absolute"            
                        opacity={0.4}
                        bg="gray.700"
                        width="full"
                    />
                    <Text 
                        fontSize={11} 
                        color="gray.100"                         
                        fontWeight="bold" 
                        textTransform="uppercase" 
                        position="absolute" 
                        top={77}
                        left={2}
                    >
                        ANÚNCIO DESATIVADO
                    </Text>                    
                </Fragment>
            }
           

            <Text fontSize="sm" color={data.is_active !== undefined && !data.is_active ? "gray.400" : "gray.600"} fontFamily="body" numberOfLines={2}>
                {data.name}
            </Text>

            <Text fontSize="xs" color={data.is_active !== undefined && !data.is_active ? "gray.400" : "gray.700"} fontWeight="bold" numberOfLines={1}>
                R$ {formatPriceValue(data.price)}
            </Text>

        </TouchableOpacity>
    );
}