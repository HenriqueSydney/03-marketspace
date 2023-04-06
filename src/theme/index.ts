import { extendTheme } from "native-base";

export const THEME = extendTheme({
    colors: {
        blue: {
            500: '#364D9D',
            300: '#647AC7',
        },
        gray: {
            700: '#1A181B',
            600: '#3E3A40',
            500: '#5F5B62',
            400: '#9F9BA1',
            300: '#D9D8DA',
            200: '#EDECEE',
            100: '#F7F7F8'
        },
        red: {
            500: '#EE7979'
        }
    },
    fonts: {
        heading: 'Karla_700Bold',
        body: 'Karla_400Regular',
    },
    fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
    },
    sizes: {
        0.5: 2,
        11: 45,
        14: 56,
        15: 60,
        17: 72,
        22: 88,
        26: 100,
        33: 148
    }
})


