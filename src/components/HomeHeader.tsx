import { Box, HStack, Icon, Text, useTheme, VStack } from "native-base";
import { Plus } from 'phosphor-react-native';

import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { api } from "@services/api";

import { useAuth } from "@hooks/useAuth";

import { UserPhoto } from "@components/UserPhoto";
import { Button } from "@components/Button";

import defaultUserPhotoImg from '@assets/avatar.png';


export function HomeHeader(){
    const { colors, sizes } = useTheme();
    const { user } = useAuth();

    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleCreateAdvertisementRoute(){
        navigation.navigate('create_advertisement', { productId: "0" });
    }

    return (
        
        <VStack  px={6} pt={12}>
            <HStack justifyContent="space-between" alignItems="center" mb={8}>
                <HStack flex={1} mr={10}>
                    <UserPhoto
                        source={ user.avatar ? { uri: `${api.defaults.baseURL}/images/${user.avatar}`} : defaultUserPhotoImg }
                        alt="Imagem do usuário"
                        size={12}
                        mr={4}
                    
                    />
                    <VStack>
                        <Text>
                            Boas Vindas,
                        </Text>
                        <Text fontFamily="heading" fontSize="md" color="gray.700">
                            {user.name}!
                        </Text>
                    </VStack>
                </HStack>
                <Box flex={1}>
                    <Button
                        title="Criar anúncio"
                        variant="black"
                        leftIcon={ <Icon  as={<Plus size={16} color={colors.gray[200]}/>} /> }
                        onPress={handleCreateAdvertisementRoute}
                    />
                </Box>
            </HStack>
        </VStack>
    )
}