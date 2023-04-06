import { Image, IImageProps } from "native-base";

type Props = IImageProps & {
    size: number;
    borderColor?: 'blue.300' | 'gray.100';
}

export function UserPhoto({ size, borderColor='blue.300', ...rest}: Props){
    return(
        <Image 
            w={size}
            h={size}
            rounded="full"
            borderWidth={borderColor==='blue.300' ? 2 : 1} 
            borderColor={borderColor}
        
            {...rest}
        />
    );
}