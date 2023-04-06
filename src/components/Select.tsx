import { ChevronDownIcon, FormControl, ISelectProps, Select as NativeBaseSelect } from "native-base";

import { InputOptionProps } from "src/@types/inputOptions";

type Props = ISelectProps & {
    options: InputOptionProps[];
    errorMessage?: string | null;
}

export function Select({options, errorMessage = null, ...rest}: Props){
    const invalid = !!errorMessage;

    return(
        <FormControl isInvalid={invalid} flex={1}  >
            <NativeBaseSelect                                       
                accessibilityLabel="Selecione uma opção de produto" 
                placeholder="Selecione"
                placeholderTextColor="gray.700"
                color="gray.700"
                fontSize="sm"
                dropdownIcon={<ChevronDownIcon size="4" mr={2}/>}
                borderColor="gray.300"
                borderRadius={6}
                py={2}
                
                alignItems="center"
                
                _selectedItem={{
                    bg: "gray.300"
                }} 
                {...rest}
            >
                {options.map((option) => <NativeBaseSelect.Item 
                                            key={option.key}
                                            label={option.name ? option.name: option.key}                                             
                                            value={option.key} />)}                  
                
            </NativeBaseSelect>
            
             <FormControl.ErrorMessage _text={{color: "red.500"}}>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
        
    );
}