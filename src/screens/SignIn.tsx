import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Center, Heading, Image, Text, useToast, VStack } from 'native-base';

import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { useAuth } from '@hooks/useAuth';

import Logo from '@assets/logo.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { AppError } from '@utils/AppError';

type FormDataProps = {
    email: string;
    password: string;
    
}

export function SignIn(){  
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigation<AuthNavigatorRoutesProps>();

    const { signIn } = useAuth();  

    const toast = useToast();
    
    const signUpSchema = yup.object({   
        email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
        password: yup.string().required('Informe a senha.')   
    });
    
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    async function handleSignIn({ email, password }: FormDataProps){

        try {
            setIsLoading(true);
            await signIn(email, password);
           
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível entrar na conta. Tente novamente mais tarde.'
            setIsLoading(false)
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });        
        } 
     
    }

    function handleNewAccount(){
        navigate.navigate('signUp');
    }

    return(

        <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack flex={1} px={10} pt={24} bg="gray.200" roundedBottom={24}>
                <Center mb={16}>
                    <Image 
                        source={Logo}
                        alt="Imagem da Logomarca da Marketspace"
                        mb={3}
                    />
                    <Heading
                        color="gray.700"
                        fontFamily="heading"
                        fontSize="sm"
                    >
                        marketspace
                    </Heading>

                    <Text color="gray.500">
                        Seu espaço de compra e venda
                    </Text>
                </Center>
           
            
                <Text alignSelf="center" color="gray.600" fontSize="sm" mb={3}>
                    Acesse sua conta
                </Text>

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
                    name="password"                       
                    render={({ field: { onChange, value } }) => (
                        <Input 
                            placeholder='Senha'
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.password?.message}
                            returnKeyType="send"
                            onSubmitEditing={handleSubmit(handleSignIn)}
                            isSecureInput
                        />                
                    )}
                />

                

                <Button 
                    title="Entrar"
                    mt={4}
                    onPress={handleSubmit(handleSignIn)}
                />
                
            </VStack>

            <VStack flex={1} px={10} bg="white" justifyContent="center">                
                <Text alignSelf="center" color="gray.600" fontSize="xs">
                    Ainda não tem acesso?
                </Text>

                <Button
                    title="Criar uma conta"
                    variant="gray"
                    mt={3}
                    onPress={handleNewAccount}
                />                
            </VStack>

        </ScrollView>


    );

}