import { Platform } from "react-native";
import { Icon, useTheme, View } from "native-base";
import { createBottomTabNavigator, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { House, Tag, SignOut } from 'phosphor-react-native';

import { Home } from "@screens/Home";
import { MyAdvertisement } from "@screens/MyAdvertisement";
import { CreateAdvertisement } from "@screens/CreateAdvertisement";
import { AdvertisementPreview } from "@screens/AdvertisementPreview";
import { ProductDetail } from "@screens/ProductDetail";

import { useAuth } from "@hooks/useAuth";

type AppRoutes = {
    home: undefined;
    my_advertisement: undefined;
    log_out: undefined;
    create_advertisement: { productId: string };
    advertisement_preview: undefined;
    product_detail: { productId: string };
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes(){
    const { sizes, colors } = useTheme();

    const { signOut } = useAuth();

    const iconSize = sizes[6];
   
    return(
        <Navigator screenOptions={{ 
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: colors.gray[600],
            tabBarInactiveTintColor: colors.gray[400],
            tabBarStyle: {
                backgroundColor: colors.gray[100],
                borderTopWidth: 0,
                height: Platform.OS === 'android' ? 'auto' : 96,
                paddingBottom: sizes[7],
                paddingTop: sizes[5]
            }
        }}>
            <Screen
                name="home"
                component={Home}
                options={{ 
                    tabBarIcon: ({ color }) => (
                        <Icon as={<House color={color} />} />
                    )
                }}           
            />

            <Screen
                name="my_advertisement"
                component={MyAdvertisement}
                options={{ 
                    tabBarIcon: ({ color }) => (
                        <Icon as={<Tag color={color} />} />
                    )
                }}                
            />

            <Screen
                name="log_out"
                component={View}
                options={{ 
                    tabBarInactiveTintColor: colors.red[500],
                    tabBarIcon: ({ color }) => (
                        <Icon as={<SignOut color={ colors.red[500] } />} />
                    )
                }}
                listeners={() => ({
                    tabPress: (e) => {
                        signOut();
                    },
                })}  
            />

            <Screen
                name="create_advertisement"
                component={CreateAdvertisement}
                options={{ tabBarStyle: {display: "none"}, tabBarButton: () => null}}
            />

            <Screen
                name="advertisement_preview"
                component={AdvertisementPreview}
                options={{ tabBarStyle: {display: "none"}, tabBarButton: () => null }}
               
            />


            <Screen
                name="product_detail"
                component={ProductDetail}
                options={{ tabBarStyle: {display: "none"}, tabBarButton: () => null }}
            />
        </Navigator>
    );
}