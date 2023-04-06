import { useCallback, useRef, useState } from "react";
import { Box, FlatList, HStack, View } from "native-base";
import { IFlatListProps } from "native-base/lib/typescript/components/basic/FlatList";

import { ProductImagesDTO } from "@dtos/ProductDTO";

type Props = IFlatListProps<ProductImagesDTO>;

export function Carousel({ data, ...rest }: Props) {
    const [index, setIndex] = useState(0);
    const indexRef = useRef(index);
    indexRef.current = index;
    
    const onScroll = useCallback((event: any) => {   
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);        

        const distance = Math.abs(roundIndex - index);
        
        const isNoMansLand = 0.4 < distance;

        if (roundIndex !== indexRef.current && !isNoMansLand) {
          setIndex(roundIndex);
        }
        
    }, []);

    const flatListOptimizationProps = {
        initialNumToRender: 0,
        maxToRenderPerBatch: 1,
        removeClippedSubviews: true,
        scrollEventThrottle: 16,
        windowSize: 2       
    };    

    return (
      <View style={{ flex: 1 }}  >      
        <FlatList        
          data={data}              
          pagingEnabled={true}
          onScroll={onScroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          {...flatListOptimizationProps}        
          {...rest}
        
        />
        <HStack position="absolute" bottom={1} width="full" justifyContent="space-around">
          {
            data?.map((_, currentIndex) => {              
              return(                
                <Box
                  key={currentIndex.toLocaleString()}                  
                  bg="gray.100"
                  h={1}
                  flex={1}
                  rounded="full"
                  mx={1}
                  opacity= {(index === currentIndex) ? "0.75" : "0.5"}
                />              
              );
            })
          }
        </HStack>  
        
      </View>
    );
  };