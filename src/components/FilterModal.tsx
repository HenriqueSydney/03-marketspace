import { useState } from "react";
import { Modal as NativeBaseModal, Box, HStack, Switch, Text, useToast } from "native-base";

import { useProduct } from "@hooks/useProduct";

import { FilterButton } from "@components/FilterButton";
import { Checkbox } from "@components/Checkbox";
import { Button } from "@components/Button";

import { AppError } from "@utils/AppError";
import { getPaymentOptions } from "@utils/findPaymentOptions";

type Props = {
    showModal: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>
}

type ParamsProps ={
    is_new?: boolean,
    accept_trade: boolean,
    payment_methods: string[],
    query: string
}

export function FilterModal({ showModal, setShowModal, query, setQuery }:Props){
    const [isNewSelected, setIsNewSelected] = useState(false);
    const [isUsedSelected, setIsUsedSelected] = useState(false);
    const [acceptTradeSwitch, setAcceptTradeSwitch] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
    const [isLoadingResetFilter, setIsLoadingResetFilter] = useState(false);
    const [isLoadingApplyFilter, setIsLoadingApplyFilter] = useState(false);

    const { fetchProducts } = useProduct();

    const toast = useToast();

    function handleConditionFilter(condition: string){
        if(condition==='new' && isNewSelected===true){
            setIsNewSelected(false);            
        } else  if(condition==='new' && isNewSelected===false){
            setIsNewSelected(true);  
            setIsUsedSelected(false);          
        } else if(condition==='used' && isUsedSelected===true){
            setIsUsedSelected(false);            
        } else  if(condition==='used' && isUsedSelected===false){
            setIsNewSelected(false);  
            setIsUsedSelected(true);          
        }
    }

    async function handleResetFilter(){
        setIsLoadingResetFilter(true);
        try {  
            setIsNewSelected(false);
            setIsUsedSelected(false);
            setAcceptTradeSwitch(false);
            setPaymentMethods([]);
            setQuery('');

            await fetchProducts({})      
          
            setShowModal(false);
          
        } catch (error) {
            const isAppError = error instanceof AppError;           
            const title = isAppError ? error.message : 'Não foi possível resetar os filtros. Tente novamente mais tarde.'           
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });        
        } finally {
            setIsLoadingResetFilter(false);
        } 
    }

    async function handleApplyFilter(){
        setIsLoadingApplyFilter(true);
        try {      
            let params: ParamsProps = {
                is_new: isNewSelected,
                accept_trade: acceptTradeSwitch,
                payment_methods: paymentMethods,
                query: query
            };

            if(!isUsedSelected && !isNewSelected){
                delete params["is_new"];
            }
            
            await fetchProducts({params: params})   
                     
            setShowModal(false);
          
        } catch (error) {
            const isAppError = error instanceof AppError;           
            const title = isAppError ? error.message : 'Não foi possível aplicar os filtros. Tente novamente mais tarde.'           
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });        
        } finally {
            setIsLoadingApplyFilter(false);
        }
    }

    const PaymentOptions = getPaymentOptions();

    return(
        <NativeBaseModal isOpen={showModal} onClose={() => setShowModal(false)} size="full">            
            <NativeBaseModal.Content mx={10} bg="gray.200" mt={0} mb="auto" pt={8}  borderRadius={0} >

                <NativeBaseModal.CloseButton color="gray.400" mt={8}/>

                <NativeBaseModal.Header bg="gray.200" borderColor="gray.200">
                    <Text color="gray.700" fontSize="xl" fontWeight="bold" fontFamily="heading">
                    Filtrar anúncios
                    </Text>                    
                </NativeBaseModal.Header>

                <NativeBaseModal.Body borderWidth={0}> 
                <Text color="gray.700" fontSize="sm" fontWeight="bold" mb={3}>Condição</Text>                       
                <HStack>
                    <FilterButton 
                        isActive={isNewSelected}
                        name="Novo"
                        onPress={() => handleConditionFilter('new')}
                    />

                    <FilterButton 
                        isActive={isUsedSelected}
                        name="Usado"
                        onPress={() => handleConditionFilter('used')}
                    />
                </HStack>

                <Text color="gray.700" fontSize="sm" fontWeight="bold" mt={5}>Aceita Troca?</Text>   
                <Box alignItems="flex-start" justifyContent="flex-start">                
                    <Switch size="lg" onToggle={() => setAcceptTradeSwitch(!acceptTradeSwitch)} isChecked={acceptTradeSwitch}/>       
                </Box>

                <Text color="gray.700" fontSize="sm" fontWeight="bold">Meios de Pagamento?</Text>  
                <Checkbox 
                    options={PaymentOptions}
                    onChange={setPaymentMethods} 
                    value={paymentMethods} 
                /> 

                </NativeBaseModal.Body>

                <NativeBaseModal.Footer bg="gray.200" borderColor="gray.200" mt={5}>
                <HStack  alignItems="center" justifyContent="space-between" flex={1}>
                    <Button 
                        title="Resetar Filtros"
                        variant="gray"
                        flex={1}
                        mr={3}
                        onPress={handleResetFilter}
                        isLoading={isLoadingResetFilter}
                        isDisabled={isLoadingApplyFilter}
                    />

                    <Button 
                        title="Aplicar Filtros"
                        variant="black"
                        flex={1}
                        onPress={handleApplyFilter}
                        isLoading={isLoadingApplyFilter}
                        isDisabled={isLoadingResetFilter}
                    />
                </HStack>

                </NativeBaseModal.Footer>
            </NativeBaseModal.Content>

        </NativeBaseModal>
    );
}