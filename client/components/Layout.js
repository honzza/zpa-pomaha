import Head from "next/head";
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
      <Head>
        <title>ZPA pomáhá sportem</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
          integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300&display=swap"
        />
      </Head>
      <Navbar />
      {props.children}
      <Footer />
    </ChakraProvider>
  );
}
