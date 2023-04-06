import { PaymentMethodsProps } from "@dtos/ProductDTO";

export function getPaymentOptions(){
    const paymentOptions: PaymentMethodsProps[] = [
        {key: 'boleto', name:'Boleto'},
        {key: 'pix', name:'Pix'},
        {key: 'cash', name:'Dinheiro'},
        {key: 'card', name:'Cartão de Crédito'},
        {key: 'deposit', name:'Depósito Bancário'},
    ];
    
    return paymentOptions;

    
}