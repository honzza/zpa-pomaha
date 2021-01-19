import {
  List,
  Box,
  Flex,
  Heading,
  useColorMode,
  DarkMode,
  Image,
  Stack,
  Link,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FiLogOut, FiInfo } from "react-icons/fi";
import NextLink from "next/link";
import NavLink from "./UIElements/NavLink";
import NavIcon from "./UIElements/NavIcon";
import AuthContext from "../context/auth-context";
import { useContext } from "react";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const auth = useContext(AuthContext);

  const authClickHandler = () => {
    auth.logout();
  };

  return (
    <Box
      backgroundColor="#25283d"
      color="#fff"
      height={{ base: "100px", lg: "70px" }}
    >
      <Flex
        direction={{ base: "column", lg: "row" }}
        justify={{ base: "", lg: "space-between" }}
        align="center"
        maxWidth="1300px"
        mx="auto"
        height="100%"
        px="40px"
      >
        <Stack direction="row" align="center">
          <Image
            boxSize={{ base: "80px", lg: "60px" }}
            display={{ base: "none", lg: "inline" }}
            src="zpa.png"
            alt="ZPA logo"
            mr="15px"
          />
          <Heading
            as="h1"
            fontWeight="200"
            fontSize={{ base: "26px", lg: "32px" }}
            my={{ base: "10px", lg: "0" }}
          >
            ZPA pomáhá sportem
          </Heading>
        </Stack>
        {auth.isLoggedIn && (
          <Box display="flex">
            <List display="flex">
              <NavLink path="/main" text="úvod" />
              <NavLink path="/ride" text="cyklo" />
              <NavLink path="/run" text="běh" />
              <NavLink path="/swim" text="plavání" />
            </List>
            <DarkMode>
              <NextLink href="/about">
                <Link>
                  <NavIcon
                    as={FiInfo}
                    label="O aplikaci"
                    aria="About"
                    p="7px"
                  />
                </Link>
              </NextLink>
              <NavIcon
                label="Světlý/Tmavý mód"
                aria="Toggle dark mode"
                icon={{ light: <MoonIcon />, dark: <SunIcon /> }[colorMode]}
                action={toggleColorMode}
              />
              <NextLink href="/">
                <Link onClick={() => authClickHandler()}>
                  <NavIcon
                    as={FiLogOut}
                    label="Odhlášení z aplikace"
                    aria="Logout"
                    p="7px"
                  />
                </Link>
              </NextLink>
            </DarkMode>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
