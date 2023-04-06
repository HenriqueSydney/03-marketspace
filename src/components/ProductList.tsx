import { Center, FlatList, Text } from "native-base";

import { ProductCard } from "@components/ProductCard";

import { ProductDTO } from "@dtos/ProductDTO";

type Props ={
    products: ProductDTO[];
    showUserPhoto?: boolean;
}

export function ProductList({ products, showUserPhoto=true }: Props){
    
    return (
     
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={2}
                mt={4}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ProductCard 
                        data={item}
                        showUserPhoto={showUserPhoto}
                    /> 
                )}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                fadingEdgeLength={100}
                _contentContainerStyle={{paddingBottom: 5}}

                ListEmptyComponent={
                    <Center flex={1}>
                        <Text color="gray.600" textAlign="center">
                            Nenhum produto localizado. {'\n'}
                            Que tal alterar os filtros de pesquisa?
                        </Text>
                    </Center> 
                }
            />     
    );

}