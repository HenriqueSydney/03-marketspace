import { Box, Heading, HStack, Icon, Pressable, useTheme, VStack } from "native-base";
import { IVStackProps } from "native-base/lib/typescript/components/primitives/Stack/VStack";
import { ArrowLeft } from "phosphor-react-native";

import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

type Props = IVStackProps & {
    title?: string;
    rightIcon?: React.ReactNode;
    goBackIcon?: React.ReactNode;
}

export function AppHeader({ title='', rightIcon=<></>, goBackIcon=true, ...rest}: Props){
    const { colors, sizes } = useTheme();
    const navigate = useNavigation<AppNavigatorRoutesProps>();
    
    function handleGoBack(){        
        navigate.goBack();
    }

    return(
        <VStack w="full" pt={12} {...rest}>
            <HStack alignItems="center" justifyContent="space-between">
                <Box w="20%" alignItems="flex-start"> 
                    {goBackIcon && 
                         <Pressable p={2} onPress={handleGoBack}>
                            <Icon
                                as={<ArrowLeft />} 
                                name="arrow-left" 
                                size={sizes.md} 
                                color={colors.gray[700]}
                            />
                        </Pressable>                    
                    }
                   
                </Box>
                <Box w="60%" alignItems="center">
                    {!!title && 
                        <Heading fontFamily="heading" fontWeight="bold" fontSize="xl" color="gray.700">
                            {title}
                        </Heading>
                    }
                </Box>
                <Box p={2} w="20%" alignItems="flex-end">
                    {rightIcon && rightIcon}
                </Box>
            </HStack>            
        </VStack>
    );
}