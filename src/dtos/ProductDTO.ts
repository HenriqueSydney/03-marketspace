import { PhotoFileProps } from "src/@types/photoFile";

export type PaymentMethodsProps = {
    name: string;
    key: string;    
}

export type ProductDTO = {
    id: string;
    name: string;
    description: string;
    price: number;
    is_new: boolean;
    is_active?: boolean;
    accept_trade: boolean;
    product_images?: ProductImagesDTO[] | PhotoFileProps[];
    payment_methods?: PaymentMethodsProps[] | string[];
    user?: {
        name?: string;
        avatar?:string;
        tel?: string;
    },
    user_id?: string;
    deletedPhotosFilesOnEdit?: string[];
}

export type ProductImagesDTO = {
    id: string;
    path: string;
}

