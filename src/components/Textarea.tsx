import { FormControl, ITextAreaProps, TextArea as NativeBaseTextarea } from "native-base";

type Props = ITextAreaProps & {
    errorMessage?: string | null;
    autoCompleteType?: boolean;
}

export function Textarea({errorMessage = null, autoCompleteType=false, isInvalid, ...rest}: Props){
    const invalid = !!errorMessage || isInvalid;

    return(
        <FormControl isInvalid={invalid} mb={4}>
            <NativeBaseTextarea           

                bg="gray.100"

                borderWidth={0}
                rounded={6}

                py={3}
                px={4}              
                
                fontSize="md"
                color="gray.700"
                fontFamily="body"
                
                placeholderTextColor="gray.400"

                autoCompleteType={autoCompleteType}

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

                {...rest}
            />
            
             <FormControl.ErrorMessage _text={{color: "red.500"}}>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
        
    );
}