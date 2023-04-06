import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, Center, Heading, Icon, IconButton, Image, Skeleton, Text, useToast, VStack } from 'native-base';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { PencilSimpleLine } from 'phosphor-react-native';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from '@hooks/useAuth';

import { api } from '@services/api';

import Logo from '@assets/logo.png';
import Avatar from '@assets/avatar.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { UserPhoto } from '@components/UserPhoto';

import { AppError } from '@utils/AppError';

type FormDataProps = {
    name: string;
    email: string;   
    phoneNumber: string;
    password: string;
    passwordConfirm:string;
    avatar: any
}

const PHOTO_SIZE = 88;

export function SignUp(){
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [photoFile, setPhotoFile] = useState({} as any);
    const [photoSelectedUri, setPhotoSelectedUri] = useState('');

    const navigate = useNavigation<AuthNavigatorRoutesProps>();

    const toast = useToast();

    const { signIn } = useAuth();

    async function handleUserPhotoSelect(){
        setPhotoIsLoading(true);
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });

            if(photoSelected.canceled){
                return;
            } 

            if(photoSelected.assets[0].uri){
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
                
                if(photoInfo.size && (photoInfo.size/1024/1024) > 5){
                    return toast.show({
                        title: "Essa imagem é muito grande, escolha uma de até 5MB.",
                        placement:"top",
                        bgColor: 'red.500'
                    });                    
                }

                const fileExtension = photoSelected.assets[0].uri.split('.').pop();
                
                const photoFile = {
                    name: fileExtension,
                    uri: photoSelected.assets[0].uri,
                    type: `${photoSelected.assets[0].type}/${fileExtension}`
                } as any;

                setPhotoFile(photoFile);
                setPhotoSelectedUri(photoSelected.assets[0].uri);            
            }
           

        } catch (error) {
            const isAppError = error instanceof AppError;

            const title = isAppError ? error.message : 'Não foi possível atualizar sua foto. Tente novamente mais tarde.';

            toast.show({
                title,
                placement: "top",
                bgColor: "red.500"
            })
        } finally {
            setPhotoIsLoading(false);
        }
    }

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const signUpSchema = yup.object({   
        name: yup.string(). required('Informe o nome.').min(3,'O nome deve ter, pelo menos, 3 caracteres'),
        email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
        phoneNumber: yup.string().required('Informe o número de telefone.').matches(phoneRegExp, 'Phone number is not valid'),
        password: yup.string()
            .required('Informe a senha.')
            .min(6, 'A senha deve ter, pelo menos, 6 dígitos.'),
        passwordConfirm: yup.string()
            .required('Confirme da senha.')
            .oneOf([yup.ref('password'), null], 'A confirmação da senha não confere.')
    });
    
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    async function handleSignUp({ name, email, phoneNumber, password }: FormDataProps){

        try {
            setIsLoading(true);

            if(JSON.stringify(photoFile) === '{}') {
                toast.show({
                    title: 'A foto é obrigatória',
                    placement: 'top',
                    bgColor: 'red.500'
                });     
                return;
            }

            const signUpForm = new FormData();
            const photoFileData = {
                name:  `${name}.${photoFile.name}`.toLowerCase().replace(' ', '_'),
                uri: photoFile.uri,
                type: photoFile.type
            } as any;

            signUpForm.append('avatar', photoFileData);
            signUpForm.append('name', name);
            signUpForm.append('email', email);
            signUpForm.append('tel', phoneNumber);            
            signUpForm.append('password', password);
          
            await api.post('/users', signUpForm, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            await signIn(email, password);
           
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde.'
           
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });        
        } finally{
            setIsLoading(false);
        }
     
    }

    function handleGoBack(){
        navigate.goBack();
    }

    return(

        <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack  flex={1} px={10} pt={12} bg="gray.200">
                <Center mb={6}>
                    <Image 
                        source={Logo}
                        alt="Imagem da Logomarca da Marketspace"                        
                        size={15}
                        resizeMode="contain"
                    />

                    <Heading
                        fontFamily="heading"
                        fontWeight="bold"
                        fontSize="xl"
                        color="gray.700"
                        mb={2}
                    >
                        Boas Vindas!
                    </Heading>

                    <Text
                        fontFamily="body"
                        fontSize="sm"
                        color="gray.600"
                        textAlign="center"
                    >
                        Crie sua conta e use o espaço para comprar itens variados e vender seus produtos
                    </Text>

                    <Box mt={8} mb={3}>
                        { photoIsLoading ? 
                            <Skeleton  
                                    w={PHOTO_SIZE} 
                                    h={PHOTO_SIZE} 
                                    mr={2}
                                    rounded="full"
                                    startColor="gray.500"
                                    endColor="gray.200"
                                />
                        :
                            <UserPhoto 
                                source={photoSelectedUri ? { uri: photoSelectedUri } : Avatar }
                                alt="Foto do usuário"
                                size={PHOTO_SIZE}
                                mr={2}
                            />
                        }                        
                        <IconButton 
                            icon={ <Icon as={<PencilSimpleLine color="white" size={16} />} /> }
                            position="absolute"
                            bg="blue.300"
                            rounded="full"
                            w={10}
                            h={10}
                            bottom={0}
                            right={0}
                            onPress={handleUserPhotoSelect}

                        />
                    </Box>
                    <Controller
                        control={control}
                        name="name"                       
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder='Nome'                          
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />                           
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"                       
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder='E-mail'
                                keyboardType='email-address'
                                autoCapitalize="none"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />                           
                        )}
                    />

                    <Controller
                        control={control}
                        name="phoneNumber"                       
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder='Telefone'
                                keyboardType='phone-pad'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.phoneNumber?.message}
                            />                           
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"                       
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder='Senha'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                                isSecureInput
                            />                           
                        )}
                    />

                    <Controller
                        control={control}
                        name="passwordConfirm"                       
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder='Confirmar Senha'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.passwordConfirm?.message}
                                returnKeyType="send"
                                onSubmitEditing={handleSubmit(handleSignUp)}
                                isSecureInput
                            />                           
                        )}
                    />

                    <Button 
                        title="Criar"
                        variant="black"
                        mt={3}
                        isLoading={isLoading}
                        onPress={handleSubmit(handleSignUp)}
                    />
                    </Center>

                    <Center mt={3}>

                        <Text color="gray.600" fontSize="sm">
                            Já tem uma conta?
                        </Text>

                        <Button 
                            title="Ir para o login"
                            variant="gray"
                            mt={3}
                            onPress={handleGoBack}
                        />
                    </Center>
                
            </VStack>
        </ScrollView>


    );

}