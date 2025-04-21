import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    50: '#E6F6FF',
    100: '#B3E0FF',
    200: '#80CBFF',
    300: '#4DB5FF',
    400: '#1A9FFF',
    500: '#0088E6',
    600: '#006BB3',
    700: '#004F80',
    800: '#00324D',
    900: '#00161A',
  },
};

const fonts = {
  heading: 'Roboto, system-ui, sans-serif',
  body: 'Roboto, system-ui, sans-serif',
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'md',
    },
    variants: {
      solid: (props) => ({
        bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.400' : 'brand.600',
        },
      }),
      outline: (props) => ({
        borderColor: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
        color: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
      }),
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: 'md',
      },
    },
    variants: {
      outline: (props) => ({
        field: {
          borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: `0 0 0 1px ${
              props.colorMode === 'dark' ? 'brand.500' : 'brand.500'
            }`,
          },
        },
      }),
    },
  },
};

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({ colors, fonts, components, config });

export default theme; 