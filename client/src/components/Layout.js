import Footer from "./Footer";
import Navbar from "./Navbar";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: "Montserrat, sans-serif",
    heading: "Montserrat, sans-serif",
  },
});

export default function Layout(props) {
  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      {props.children}
      <Footer />
    </ChakraProvider>
  );
}
