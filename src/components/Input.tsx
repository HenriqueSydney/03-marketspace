import { useState } from "react";
import { Pressable } from "react-native";
import { Input as NativeBaseInput, IInputProps, FormControl, Icon, useTheme } from "native-base";

import { Eye, EyeSlash } from 'phosphor-react-native';

type Props = IInputProps & {
    errorMessage?: string | null;
    isSecureInput?: boolean;
}

export function Input({ errorMessage = null, isSecureInput = false, isInvalid, ...rest }: Props){
    const [passwordVisible, setPasswordVisible] = useState(isSecureInput)
    const invalid = !!errorMessage || isInvalid;

    const { colors } = useTheme();

    function handleSecureTextEntry(){
        return passwordVisible ? setPasswordVisible(false) : setPasswordVisible(true);
    }

    return( 
        <FormControl isInvalid={invalid} mb={4}>
            <NativeBaseInput 
                bg="gray.100"
                borderWidth={0}
                rounded={6}
                
                h={11}
                py={3}
                px={4}
                
                fontSize="md"
                color="gray.700"
                fontFamily="body"
                
                placeholderTextColor="gray.400"

                _focus={{
                    bg: "gray.100",
                    borderWidth: 1,
                    borderColor: "gray.500"
                }}

                isInvalid={invalid}
                _invalid={{
                    borderWidth:1,
                    borderColor: "red.500"
                }}  


                secureTextEntry={passwordVisible}
                
                InputRightElement={
                    isSecureInput ?  
                        <Pressable  onPress={handleSecureTextEntry}   >                  
                            <Icon  as={passwordVisible ? <EyeSlash color={colors.gray[500]}/> :  <Eye color={colors.gray[500]} />} m={4} />
                        </Pressable>   
                        : <></>
                        

                }               

                {...rest}
            />

            <FormControl.ErrorMessage _text={{color: "red.500"}}>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    );



}