import { Checkbox as NativeBaseCheckbox, FormControl, ICheckboxGroupProps } from "native-base";

import { InputOptionProps } from "src/@types/inputOptions";

type Props = ICheckboxGroupProps & {     
    options: InputOptionProps[];
    label?: string;
    errorMessage?: string | null;
    isInvalid?: boolean;
}

export function Checkbox({ options, label="", errorMessage = null, isInvalid, ...rest }: Props){
    const invalid = !!errorMessage || isInvalid;
    
    return(
        
        <FormControl isInvalid={invalid} mb={4}>
            {!!label && 
                <FormControl.Label 
                    _text={{
                        fontSize: "sm",
                        fontFamily:"heading", 
                        fontWeight:"bold",
                        color:"gray.600"
                    }} 
                >
                    {label}                    
                </FormControl.Label >
            }
            <NativeBaseCheckbox.Group 
                {...rest}
            >
                
                {
                    options.map((value) => {
                        return (                          
                            <NativeBaseCheckbox 
                                value={value.key} 
                                key={value.key}
                                my={2}
                                
                                _checked={{
                                    backgroundColor: "blue.300",
                                    borderColor: "blue.300"                                    
                                }}

                                _text={{
                                    color:"gray.600",
                                    fontSize: "md",
                                    fontFamily: "body"
                                }}
                            >
                                {value.name !== undefined ? value.name : value.key}
                            </NativeBaseCheckbox>
                        )
                    })
                }            
               
            </NativeBaseCheckbox.Group>   

            <FormControl.ErrorMessage _text={{color: "red.500"}}>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    );
}

/*
Desafio Marketspace: Erro com Checkbox e Switch do Native Base (We can not support a function callback)

**1. Descrição detalhada do contexto:**
Estou com dificuldades de implementar o Checkbox e o Switch do Native Base para o desafio do Marketspace.

Ao tentar utilizar os componentes e clicar nos componentes no aplicativo, o react está retornando o seguinte warning: "We can not support a function callback".

**2. Sistema operacional:**
Linux, Android;

**3. Mensagem de erro:**
We can not support a function callback

**4. Como reproduzi-lo:**
Utilizando o componente dentro de um formulário. Estou utilizando, inclusive com o React Hook Forms.

**5. Trechos do código:**
**6. Link do repositório no GitHub:**
            
             

*/