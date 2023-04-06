import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

type Props = IButtonProps & {
    title: string;
    variant?: 'black' | 'blue' | 'gray';
}

export function Button({ title, variant = 'blue', ...rest }: Props){

    return(

            <ButtonNativeBase 
                bg={variant === "blue" ? "blue.300" : (variant === 'gray') ? "gray.300" : "gray.700"}
                
                w="full"
                h={11}

                rounded="sm"

                _pressed={{
                    bg: variant === "blue" ? "gray.500" : (variant === 'gray') ? "gray.400" : "gray.500"
                }}

                {...rest}
            >
                                   
                <Text 
                    color={variant === "gray" ? "gray.700" : "gray.100"}
                    fontFamily="heading" 
                    fontSize="sm"
                >                        
                    {title}
                </Text>
            </ButtonNativeBase>

    );
}