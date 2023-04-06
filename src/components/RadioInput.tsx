import { FormControl, HStack, IRadioGroupProps, IRadioProps, Radio } from "native-base";

import { InputOptionProps } from "src/@types/inputOptions";

type Props = IRadioProps & IRadioGroupProps & { 
    name: string;  
    options: InputOptionProps[];
    errorMessage?: string | null;
    label?: string;
}

export function RadioInput({ name, options, errorMessage = null, label="", isInvalid, ...rest }: Props){
    const invalid = !!errorMessage || isInvalid;
    
    return(
        
        <FormControl isInvalid={invalid} mb={4}>
            {!!label && 
                <FormControl.Label _text={{
                        fontSize:"sm", 
                        fontFamily:"heading", 
                        fontWeight:"bold", 
                        color:"gray.600"
                    }}
                >
                        {label} 
                </FormControl.Label>
                
            }
            <Radio.Group  
                name={name}               
               
                {...rest}
            >
                <HStack>
                    {
                        options.map((value, index) => {
                            let margin = 0;
                            index !== 0 ? margin=5 : margin=0;
                            return (                          
                                <Radio 
                                    value={value.key} 
                                    my={2} 
                                    ml={margin} 
                                    key={value.key}  

                                    _text={{
                                        color: "gray.600",
                                        fontSize:"md",
                                    }}                              

                                    _checked={{                                        
                                        borderColor: "blue.300",
                                        
                                    }}

                                    _icon={{
                                        color: "blue.300",
                                    }}
                                >
                                     {value.name !== undefined ? value.name : value.key}
                                </Radio>
                            )
                        })
                    }            
                </HStack>
            </Radio.Group>  
            
            <FormControl.ErrorMessage _text={{color: "red.500"}}>
                {errorMessage}
            </FormControl.ErrorMessage> 
        </FormControl>
    );
}