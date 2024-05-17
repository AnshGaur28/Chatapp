// theme.js
import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  colors: {
    brand: {
      50: "#e3f8ff",
      100: "#CBCBFF",
      200: "#81defd",
      300: "#5ed0fa",
      400: "#40c3f7",
      500: "#CBCBFF",
      600: "#1992d4",
      700: "#127fbf",
      800: "#0b69a3",
      900: "#035388",
    },
  },
  components: {
    Tabs: {
      baseStyle: {
        Tab: {
          _selected: {
            color: "white",
            bgColor: "brand.500",
          },
        },
        tablist: {
          borderBottom: "2px solid",
          borderColor: "white",
        },
      },
      sizes: {},
      variants: {
        custom: {
          tab: {
            _selected: {
              color: "white",
              bg: "brand.500",
            },
            _hover: {
              bg: "brand.300",
            },
          },
          tablist: {
            borderBottom: "2px solid",
            borderColor: "brand.600",
          },
        },
      },
      defaultProps: {
        variant: "custom",
      },
    },
  },
});

export default customTheme;
