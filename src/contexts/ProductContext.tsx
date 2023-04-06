import { createContext, ReactNode, useState } from "react";
import { api } from "@services/api";

import { ProductDTO, ProductImagesDTO } from "@dtos/ProductDTO";

export type ProductContextDataProps ={
    isLoadingFetchingProductData: boolean;
    fetchProducts: ({ userProductsView, params }: FetchParamProps) => Promise<void>;
    products: ProductDTO[];
    setFilteredProducts: React.Dispatch<React.SetStateAction<ProductDTO[]>>;
    filteredProducts: ProductDTO[];
    userProducts: ProductDTO[];
    fetchProduct: (productId: string) => Promise<void>;
    setProduct: React.Dispatch<React.SetStateAction<ProductDTO>>;
    product: ProductDTO;
    setProductPreview: React.Dispatch<React.SetStateAction<ProductDTO>>;
    productPreview: ProductDTO;
    photosForSlide: ProductImagesDTO[];
}

type ProductContextProviderProps = {
    children: ReactNode;
}

export type FetchParamProps  = {
    userProductsView?: boolean;
    params?: {
        is_new?: boolean;
        accept_trade?:boolean;
        payment_methods?: string[];
        query?: string;
    }
}

export const ProductContext = createContext<ProductContextDataProps>({} as ProductContextDataProps);

export const ProductPreviewDefaultValues = {
    id: '0',
    name: '',
    description: '',  
    is_new: true,
    price: 0,
    accept_trade: false,
    payment_methods: [],
    product_images: []
}     

export function ProductContextProvider({ children }: ProductContextProviderProps){
    const [isLoadingFetchingProductData, setIsLoadingFetchingProductData] = useState(true);
    const [products, setProducts] = useState<ProductDTO[]>([]);     
    const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);   
    const [userProducts, setUserProducts] = useState<ProductDTO[]>([]);
    const [product, setProduct] = useState<ProductDTO>({} as ProductDTO);  
    const [productPreview, setProductPreview] = useState<ProductDTO>(ProductPreviewDefaultValues);  
    const [photosForSlide, setPhotosForSlide] = useState<ProductImagesDTO[]>([] as any);

    async function fetchProducts({userProductsView=false, params={}}: FetchParamProps){
        setIsLoadingFetchingProductData(true);
        try {     
            let productRoute = '';      
           
            if(userProductsView){
                productRoute = '/users';               
            }
           
            const { data } = await api.get(`${productRoute}/products`, { params: params });  
            
            if(userProductsView){
                setUserProducts(data);              
            } else{     
               
                setProducts(data);
                setFilteredProducts(data);
            }
           
        } catch (error) {
            throw error;
        } finally{ 
            setIsLoadingFetchingProductData(false);
        }
    }

    async function fetchProduct(productId: string){
        setIsLoadingFetchingProductData(true);
        try {     
            const { data } = await api.get(`/products/${productId}`);  
            setProduct(data);
            setPhotosForSlide(data.product_images);
        } catch (error) {
            throw error;
        } finally{
            setIsLoadingFetchingProductData(false);
        }
    }   

    return(
        <ProductContext.Provider 
            value={{ 
                isLoadingFetchingProductData,
                fetchProducts,
                products, 
                setFilteredProducts,
                filteredProducts,
                userProducts,            
                fetchProduct, 
                setProduct,            
                product,
                setProductPreview,
                productPreview,  
                photosForSlide
            }}
        >
            {children}
        </ProductContext.Provider> 
    );
}