import { HStack, Icon, IPressableProps, Pressable, Text, useTheme } from "native-base";
import { XCircle } from 'phosphor-react-native';

type Props = IPressableProps & {
    name: string;
    isActive: boolean;
}

export function FilterButton({ name, isActive, ...rest }: Props){
    const { sizes } = useTheme();


    return(
        <Pressable
            mr={3}
            w={17}
            h={7}
            bg="gray.300"
            rounded="full"
            justifyContent="center"
            alignItems="center"

            isPressed={isActive}
            _pressed={{
                bg:"blue.300"               
            }}

            {...rest}
        >
            <HStack justifyContent="space-around" alignItems="center">
                <Text
                    color={isActive ? "white" : "gray.500"}
                    textTransform="uppercase"
                    fontSize="xs"
                    fontWeight="bold"
                >
                    {name}
                </Text>
                {isActive &&  <Icon as={<XCircle color="white" size={16} weight="fill" />} ml={1}/>  }
            </HStack>
        </Pressable>
    );

}